const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Menu {
    id_menu: Int
    nama_paket: String
    deskripsi: String
    MenuRecipes: [MenuRecipe]
  }

  type MenuRecipe {
    id_recipe: Int
    id_menu: Int
    id_inventory: Int
    jumlah_kebutuhan: Float
  }

  type Query {
    getSemuaMenu: [Menu]
    getMenuById(id: Int!): Menu
  }

  type Mutation {
    createMenu(nama_paket: String!, deskripsi: String): Menu
    updateMenu(id: Int!, nama_paket: String, deskripsi: String): Menu
    deleteMenu(id: Int!): Boolean

    createMenuRecipe(
        id_menu: Int!
        id_inventory: Int!
        jumlah_kebutuhan: Float!
    ): MenuRecipe

    deleteByMenu(
        id_menu: Int!
    ): Boolean
  }
`;

module.exports = typeDefs;