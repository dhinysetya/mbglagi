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

  # Input untuk data resep makanan
  input RecipeInput {
    id_inventory: Int!
    jumlah_kebutuhan: Float!
  }

  # Input utama untuk menu baru
  input MenuInput {
    nama_paket: String!
    deskripsi: String
    MenuRecipes: [RecipeInput] # Menerima array list resep sekaligus
  }

  type Query {
    getSemuaMenu: [Menu]
    getMenuById(id: Int!): Menu
  }

  type Mutation {
    # Diubah agar menerima object input bertingkat
    createMenu(input: MenuInput!): Menu
    updateMenu(id: Int!, nama_paket: String, deskripsi: String): Menu
    deleteMenu(id: Int!): Boolean
  }
`;

module.exports = typeDefs;