const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
initializeApp({ projectId: config.projectId });
const db = getFirestore('ai-studio-e9c2d681-7821-46c6-83a5-06aac423e67a');
db.collection('test').add({ test: true }).then(() => { console.log('success'); process.exit(0); }).catch(console.error);
