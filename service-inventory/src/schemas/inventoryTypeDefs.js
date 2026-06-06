const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Inventory {
    id_inventory: ID!
    id_dapur: ID!
    nama_bahan: String!
    stok: Float!
    satuan: String!
  }

  input InventoryInput {
    id_dapur: ID!
    nama_bahan: String!
    stok: Float!
    satuan: String!
  }

  type Query {
    semuaInventory: [Inventory]
    inventoryByDapur(id_dapur: ID!): [Inventory]
    inventoryById(id: ID!): Inventory
  }

  type Mutation {
    createInventory(input: InventoryInput!): Inventory
    updateInventory(id: ID!, input: InventoryInput!): Inventory
    deleteInventory(id: ID!): Boolean
  }
`;

module.exports = typeDefs;