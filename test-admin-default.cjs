const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
initializeApp({ projectId: config.projectId });
const db = getFirestore();
db.collection('test').add({ test: true }).then(() => { console.log('success'); process.exit(0); }).catch(console.error);
