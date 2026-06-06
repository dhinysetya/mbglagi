const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Menu = sequelize.define('Menu', {
  id_menu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_paket: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'menus',
  timestamps: true
});

const MenuRecipe = sequelize.define('MenuRecipe', {
  id_recipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_menu: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_inventory: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jumlah_kebutuhan: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'menu_recipes',
  timestamps: true
});

Menu.hasMany(MenuRecipe, { foreignKey: 'id_menu' });
MenuRecipe.belongsTo(Menu, { foreignKey: 'id_menu' });

module.exports = { Menu, MenuRecipe };