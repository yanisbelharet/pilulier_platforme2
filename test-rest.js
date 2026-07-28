const apiKey = "AIzaSyBmaOFGKyMwJ735BkZ4Psmdx6H2rAtBei8";
const projectId = "gen-lang-client-0983661862";
const databaseId = "ai-studio-e9c2d681-7821-46c6-83a5-06aac423e67a";
const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/test?key=${apiKey}`;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields: { test: { booleanValue: true } } })
}).then(res => res.json()).then(console.log).catch(console.error);
