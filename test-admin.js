const admin = require('firebase-admin');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
admin.initializeApp({ projectId: config.projectId });
const db = admin.firestore();
db.settings({ databaseId: 'ai-studio-e9c2d681-7821-46c6-83a5-06aac423e67a' });
db.collection('test').add({ test: true }).then(() => console.log('success')).catch(console.error);
