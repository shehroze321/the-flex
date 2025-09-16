#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Flex Living Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully');
    console.log('📝 Please review and update the .env file with your configuration');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  console.log('📁 Creating logs directory...');
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Logs directory created successfully');
} else {
  console.log('✅ Logs directory already exists');
}

console.log('\n🎉 Backend setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Review the .env file and update if needed');
console.log('2. Install dependencies: npm install');
console.log('3. Start the backend: npm run dev');
console.log('4. Test the API: curl http://localhost:3001/health');
console.log('\n🔗 API Documentation: http://localhost:3001/');
console.log('🏥 Health Check: http://localhost:3001/health');
