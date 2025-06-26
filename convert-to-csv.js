import fs from 'fs';
import { parse } from 'json2csv';

// Load JSON
const questions = JSON.parse(fs.readFileSync('./Trait_questions.json', 'utf8'));

// Specify fields (must match table columns!)
const fields = [
  'trait_name',
  'question_text',
  'trait_weight',
  'reverse_scoring',
  'difficulty',
  'category'
];

const opts = { fields };
const csv = parse(questions, opts);

fs.writeFileSync('Trait_questions.csv', csv);
console.log('✅ CSV file created successfully.');
