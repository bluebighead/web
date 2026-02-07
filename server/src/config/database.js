const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

function readDB() {
  if (!fs.existsSync(dbPath)) {
    const initialData = { users: [], categories: [], files: [], folders: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const db = {
  read: () => readDB(),
  write: (data) => writeDB(data),
  data: readDB()
};

console.log('Connected to JSON database');

module.exports = db;
