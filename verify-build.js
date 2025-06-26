const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying AscendOS Build Output...\n');

const outDir = path.join(__dirname, 'out');
const requiredFiles = [
  'index.html',
  'dashboard.html', 
  'quests.html',
  'rewards.html',
  'inventory.html',
  'settings.html',
  '404.html'
];

const requiredDirs = [
  '_next'
];

let allGood = true;

// Check if out directory exists
if (!fs.existsSync(outDir)) {
  console.log('❌ Output directory "out" not found. Run "npm run build" first.');
  process.exit(1);
}

console.log('✅ Output directory found');

// Check required HTML files
console.log('\n📄 Checking HTML files:');
requiredFiles.forEach(file => {
  const filePath = path.join(outDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check required directories
console.log('\n📁 Checking directories:');
requiredDirs.forEach(dir => {
  const dirPath = path.join(outDir, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}/`);
  } else {
    console.log(`  ❌ ${dir}/ - MISSING`);
    allGood = false;
  }
});

// Check for Next.js assets
console.log('\n🎨 Checking Next.js assets:');
const nextDir = path.join(outDir, '_next');
if (fs.existsSync(nextDir)) {
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log('  ✅ Static assets found');
  } else {
    console.log('  ❌ Static assets missing');
    allGood = false;
  }
} else {
  console.log('  ❌ _next directory missing');
  allGood = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 BUILD VERIFICATION PASSED!');
  console.log('✅ All required files are present');
  console.log('🚀 Ready for Netlify deployment');
  console.log('\nNext steps:');
  console.log('1. Run "deploy.bat" for automated deployment');
  console.log('2. Or manually upload the "out" folder to Netlify');
  console.log('3. Configure environment variables in Netlify dashboard');
} else {
  console.log('❌ BUILD VERIFICATION FAILED!');
  console.log('🔧 Please run "npm run build" and fix any errors');
  process.exit(1);
}

console.log('='.repeat(50) + '\n'); 