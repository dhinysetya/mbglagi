const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Sekolah {
    id_sekolah: ID!
    npsn: String!
    nama_sekolah: String!
    alamat_sekolah: String
    jenjang: String
    jumlah_siswa: Int
  }

  input SekolahInput {
    npsn: String!
    nama_sekolah: String!
    alamat_sekolah: String
    jenjang: String!
    jumlah_siswa: Int
  }

  input UpdateSekolahInput {
    nama_sekolah: String
    alamat_sekolah: String
    jumlah_siswa: Int
  }

  type Query {
    semuaSekolah: [Sekolah]
    sekolahById(id_sekolah: ID!): Sekolah
  }

  type Mutation {
    createSekolah(input: SekolahInput!): Sekolah
    updateSekolah(id_sekolah: ID!, input: UpdateSekolahInput!): Sekolah
    deleteSekolah(id_sekolah: ID!): Boolean
  }
`;

module.exports = typeDefs;