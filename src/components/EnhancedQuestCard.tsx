import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Target, 
  Zap, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Star,
  Trophy,
  AlertTriangle
} from 'lucide-react'
import { QuestWithTasks } from '../lib/questService'

interface EnhancedQuestCardProps {
  quest: QuestWithTasks
  index: number
  onComplete?: (questId: string, event: React.MouseEvent) => void
  onMiss?: (questId: string, event: React.MouseEvent) => void
  showTasks?: boolean
  completed?: boolean
  missed?: boolean
}

const difficultyColors = {
  'E': 'from-gray-500 to-gray-600',
  'D': 'from-green-500 to-green-600', 
  'C': 'from-blue-500 to-blue-600',
  'B': 'from-purple-500 to-purple-600',
  'A': 'from-red-500 to-red-600',
  'S': 'from-yellow-500 to-orange-500'
}

const categoryColors = {
  'daily': 'from-emerald-500 to-teal-500',
  'weekly': 'from-blue-500 to-indigo-500',
  'monthly': 'from-purple-500 to-pink-500',
  'milestone': 'from-yellow-500 to-orange-500'
}

const difficultyLabels = {
  'E': 'Novice',
  'D': 'Apprentice',
  'C': 'Journeyman', 
  'B': 'Expert',
  'A': 'Master',
  'S': 'Legendary'
}

export const EnhancedQuestCard: React.FC<EnhancedQuestCardProps> = ({ 
  quest, 
  index, 
  onComplete, 
  onMiss, 
  showTasks = true,
  completed = false,
  missed = false
}) => {
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  
  const difficultyColor = difficultyColors[quest.difficulty] || difficultyColors['E']
  const categoryColor = categoryColors[quest.category] || categoryColors['daily']
  
  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const totalTaskXP = quest.tasks.reduce((sum, task) => sum + task.xp_reward, 0)
  const completedTaskXP = quest.tasks
    .filter(task => completedTasks.includes(task.id))
    .reduce((sum, task) => sum + task.xp_reward, 0)
  
  const allTasksCompleted = quest.tasks.length > 0 && completedTasks.length === quest.tasks.length

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        bounce: 0.3
      }}
      whileHover={{ 
        scale: 1.02,
        rotateY: completed || missed ? 0 : 2,
        z: 50
      }}
      style={{ perspective: 1000 }}
    >
      {/* Glow Effect */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${categoryColor} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}
        whileHover={{ scale: 1.05 }}
      />
      
      {/* Main Card */}
      <motion.div
        className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 shadow-2xl ${
          completed ? 'border-green-400/50 bg-green-500/5' : 
          missed ? 'border-red-400/50 bg-red-500/5' : 
          'hover:border-blue-400/30'
        }`}
        animate={missed ? { x: [-1, 1, -1, 1, 0] } : {}}
        transition={missed ? { duration: 0.3, repeat: 1 } : {}}
      >
        {/* Category & Difficulty Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${categoryColor} text-white shadow-lg uppercase tracking-wide`}>
              {quest.category}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${difficultyColor} text-white shadow-lg flex items-center gap-1`}>
              <Star size={12} />
              {quest.difficulty} - {difficultyLabels[quest.difficulty]}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-yellow-400 font-bold flex items-center gap-1">
              <Zap size={16} />
              {quest.xp_reward} XP
            </div>
            {quest.tasks.length > 0 && (
              <div className="text-xs text-blue-300">
                +{totalTaskXP} from tasks
              </div>
            )}
          </div>
        </div>

        {/* Quest Title & Description */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold mb-2 ${
            completed ? 'text-green-300 line-through' : 
            missed ? 'text-red-300 line-through' : 
            'text-white'
          }`}>
            {quest.title}
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {quest.description}
          </p>
        </div>

        {/* Quest Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Target size={14} className="text-blue-400" />
            <span>Primary: <span className="text-blue-400 capitalize">{quest.primary_trait.replace('_', ' ')}</span></span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Clock size={14} className="text-purple-400" />
            <span>Time: <span className="text-purple-400">{quest.estimated_time}</span></span>
          </div>
        </div>

        {/* Secondary Traits */}
        {quest.secondary_traits.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Secondary Traits:</div>
            <div className="flex flex-wrap gap-1">
              {quest.secondary_traits.map(trait => (
                <span key={trait} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs capitalize">
                  {trait.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {showTasks && quest.tasks.length > 0 && (
          <div className="mb-4">
            <motion.button
              onClick={() => setShowTaskDetails(!showTaskDetails)}
              className="flex items-center justify-between w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-yellow-400" />
                <span className="font-semibold">Tasks ({quest.tasks.length})</span>
                <span className="text-xs text-gray-400">
                  {completedTasks.length}/{quest.tasks.length} completed
                </span>
              </div>
              {showTaskDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </motion.button>

            <AnimatePresence>
              {showTaskDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2"
                >
                  {quest.tasks.map(task => (
                    <motion.div
                      key={task.id}
                      className={`p-3 rounded-lg border transition-all ${
                        completedTasks.includes(task.id)
                          ? 'bg-green-500/10 border-green-400/30'
                          : 'bg-white/5 border-white/10 hover:border-blue-400/30'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${
                              completedTasks.includes(task.id) ? 'text-green-300 line-through' : 'text-white'
                            }`}>
                              {task.title}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs capitalize">
                              {task.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-1">{task.description}</p>
                          <p className="text-xs text-purple-300">Criteria: {task.completion_criteria}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className="text-yellow-400 text-xs font-bold">+{task.xp_reward}</span>
                          <motion.button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              completedTasks.includes(task.id)
                                ? 'bg-green-500 border-green-400'
                                : 'border-gray-400 hover:border-green-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {completedTasks.includes(task.id) && <CheckCircle size={12} className="text-white" />}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Hunter Notes */}
        {quest.hunter_notes && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/20 rounded-xl">
            <div className="text-xs text-blue-400 font-semibold mb-1">Hunter's Notes:</div>
            <p className="text-sm text-blue-200 italic">{quest.hunter_notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        {!completed && !missed && onComplete && onMiss && (
          <div className="flex gap-3">
            <motion.button
              onClick={(e) => onComplete(quest.id, e)}
              disabled={quest.tasks.length > 0 && !allTasksCompleted}
              className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                quest.tasks.length > 0 && !allTasksCompleted
                  ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
              }`}
              whileHover={quest.tasks.length === 0 || allTasksCompleted ? { scale: 1.05, y: -2 } : {}}
              whileTap={quest.tasks.length === 0 || allTasksCompleted ? { scale: 0.95 } : {}}
            >
              <CheckCircle size={16} />
              Complete Quest
              {quest.tasks.length > 0 && !allTasksCompleted && (
                <span className="text-xs">({completedTasks.length}/{quest.tasks.length} tasks)</span>
              )}
            </motion.button>
            
            <motion.button
              onClick={(e) => onMiss(quest.id, e)}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <XCircle size={16} />
              Mark Failed
            </motion.button>
          </div>
        )}

        {/* Status Messages */}
        {completed && (
          <motion.div
            className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-400/30 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-green-300 font-medium">
              Quest Completed! +{quest.xp_reward + completedTaskXP} XP Total
            </span>
          </motion.div>
        )}

        {missed && (
          <motion.div
            className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-red-300 font-medium">Quest Failed! Try again next time.</span>
          </motion.div>
        )}

        {/* Progress Indicator for Tasks */}
        {quest.tasks.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Task Progress</span>
              <span>{completedTasks.length}/{quest.tasks.length}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / quest.tasks.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
} 