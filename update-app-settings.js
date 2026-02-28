// Simple Node.js script to replace placeholders in template files using app.settings.ts
const fs = require('fs');
const path = require('path');
const settings = require('./src/app.settings');

const replacements = {
  '{{APP_ID}}': settings.APP_SETTINGS.APP_ID,
  '{{APP_NAME}}': settings.APP_SETTINGS.APP_NAME,
  '{{REMOTE_URL}}': settings.APP_SETTINGS.REMOTE_URL,
  '{{ALLOW_NAVIGATION}}': settings.APP_SETTINGS.ALLOW_NAVIGATION.join(', '),
  '{{DISPLAY_NAME}}': settings.APP_SETTINGS.DISPLAY_NAME,
  '{{PACKAGE_NAME}}': settings.APP_SETTINGS.PACKAGE_NAME
};

const files = [
  'ios/App/App/capacitor.config.json',
  'ios/App/App.xcodeproj/project.pbxproj',
  'ios/App/App/public/index.html'
];

files.forEach(file => {
  const filePath = path.resolve(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
