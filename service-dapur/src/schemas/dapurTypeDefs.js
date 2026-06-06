const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Dapur {
    id_dapur: ID!
    nama_dapur: String!
    lokasi: String
    kapasitas_porsi: Int!
  }

  input DapurInput {
    nama_dapur: String!
    lokasi: String
    kapasitas_porsi: Int!
  }

  type Query {
    semuaDapur: [Dapur]
    dapurById(id_dapur: ID!): Dapur
  }

  type Mutation {
    createDapur(input: DapurInput!): Dapur
    updateDapur(id_dapur: ID!, input: DapurInput!): Dapur
    deleteDapur(id_dapur: ID!): Boolean
  }
`;

module.exports = typeDefs;