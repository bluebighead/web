const db = require('../config/database');

class Folder {
  static getAll() {
    const data = db.read();
    return data.folders || [];
  }

  static getById(id) {
    const data = db.read();
    return data.folders.find(f => f.id === parseInt(id));
  }

  static create(folderData) {
    const data = db.read();
    const newFolder = {
      id: Date.now(),
      ...folderData,
      created_at: new Date().toISOString()
    };
    data.folders.push(newFolder);
    db.write(data);
    return newFolder;
  }

  static update(id, folderData) {
    const data = db.read();
    const index = data.folders.findIndex(f => f.id === parseInt(id));
    if (index !== -1) {
      data.folders[index] = { ...data.folders[index], ...folderData };
      db.write(data);
    }
  }

  static delete(id) {
    const data = db.read();
    data.folders = data.folders.filter(f => f.id !== parseInt(id));
    db.write(data);
  }

  static getByParentId(parentId) {
    const data = db.read();
    return data.folders.filter(f => f.parent_id === parseInt(parentId));
  }

  static getByPath(path) {
    const data = db.read();
    return data.folders.filter(f => f.path.startsWith(path));
  }

  static hasChildren(id) {
    const data = db.read();
    return data.folders.some(f => f.parent_id === parseInt(id));
  }
}

module.exports = Folder;
