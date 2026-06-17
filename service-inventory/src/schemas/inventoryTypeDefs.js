const inventoryTypeDefs = `#graphql
  type Inventory {
    id_inventory: ID!
    id_dapur: Int!
    nama_bahan: String!
    stok: Float!
    satuan: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    getInventories: [Inventory]
    getInventoryByDapur(id_dapur: Int!): [Inventory]
    getInventoryById(id_inventory: ID!): Inventory
  }

  type Mutation {
    createInventory(id_dapur: Int!, nama_bahan: String!, stok: Float!, satuan: String!): Inventory
    updateInventory(id_inventory: ID!, stok: Float!): Inventory
    deleteInventory(id_inventory: ID!): String
  }
`;

module.exports = inventoryTypeDefs;
