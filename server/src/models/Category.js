const db = require('../config/database');

class Category {
  static getAll() {
    const data = db.read();
    return data.categories || [];
  }

  static getById(id) {
    const data = db.read();
    return data.categories.find(c => c.id === parseInt(id));
  }

  static create(categoryData) {
    const data = db.read();
    const newCategory = {
      id: Date.now(),
      ...categoryData,
      created_at: new Date().toISOString()
    };
    data.categories.push(newCategory);
    db.write(data);
    return newCategory;
  }

  static update(id, categoryData) {
    const data = db.read();
    const index = data.categories.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      data.categories[index] = { ...data.categories[index], ...categoryData };
      db.write(data);
    }
  }

  static delete(id) {
    const data = db.read();
    data.categories = data.categories.filter(c => c.id !== parseInt(id));
    db.write(data);
  }

  static getByParentId(parentId) {
    const data = db.read();
    return data.categories.filter(c => c.parent_id === parseInt(parentId));
  }

  static hasChildren(id) {
    const data = db.read();
    return data.categories.some(c => c.parent_id === parseInt(id));
  }
}

module.exports = Category;
