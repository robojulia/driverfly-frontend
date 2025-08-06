const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const buildInfo = {
  NEXT_PUBLIC_APP_VERSION: packageJson.version,
  NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
};

// Create .env.local if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

// Read existing .env.local if it exists
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Update or add build info variables
Object.entries(buildInfo).forEach(([key, value]) => {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const newLine = `${key}=${value}`;

  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, newLine);
  } else {
    envContent = envContent ? `${envContent}\n${newLine}` : newLine;
  }
});

// Write updated content back to .env.local
fs.writeFileSync(envPath, envContent);

console.log('Build info updated:', buildInfo);

// Copy en-us.html to index.html for Azure Static Web Apps compatibility
const sourcePath = path.join(process.cwd(), '.next', 'server', 'pages', 'en-us.html');
const targetPath = path.join(process.cwd(), '.next', 'index.html');

if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, targetPath);
  console.log('Copied en-us.html to index.html for Azure Static Web Apps');
} else {
  console.log('Warning: en-us.html not found, skipping copy to index.html');
}
