const db = require('../config/database');

class File {
  static getAll() {
    const data = db.read();
    return data.files || [];
  }

  static getById(id) {
    const data = db.read();
    return data.files.find(f => f.id === parseInt(id));
  }

  static getByCategoryId(categoryId) {
    const data = db.read();
    return data.files.filter(f => f.category_id === parseInt(categoryId));
  }

  static create(fileData) {
    const data = db.read();
    const newFile = {
      id: Date.now(),
      ...fileData,
      created_at: new Date().toISOString()
    };
    data.files.push(newFile);
    db.write(data);
    return newFile;
  }

  static update(id, fileData) {
    const data = db.read();
    const index = data.files.findIndex(f => f.id === parseInt(id));
    if (index !== -1) {
      data.files[index] = { ...data.files[index], ...fileData };
      db.write(data);
    }
  }

  static delete(id) {
    const data = db.read();
    data.files = data.files.filter(f => f.id !== parseInt(id));
    db.write(data);
  }

  static getByPath(path) {
    const data = db.read();
    return data.files.filter(f => f.path.startsWith(path));
  }
}

module.exports = File;
