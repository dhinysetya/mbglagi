const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Distribusi {
    id_distribusi: ID!
    id_menu: ID!
    id_dapur: ID!
    jumlah_distribusi: Int!
    tanggal_distribusi: String!
  }

  input DistribusiInput {
    id_menu: ID!
    id_dapur: ID!
    jumlah_distribusi: Int!
    tanggal_distribusi: String!
  }

  type Query {
    semuaDistribusi: [Distribusi]
    distribusiById(id_distribusi: ID!): Distribusi
  }

  type Mutation {
    createDistribusi(input: DistribusiInput!): Distribusi
    updateDistribusi(id_distribusi: ID!, input: DistribusiInput!): Distribusi
    deleteDistribusi(id_distribusi: ID!): Boolean
  }
`;

module.exports = typeDefs;