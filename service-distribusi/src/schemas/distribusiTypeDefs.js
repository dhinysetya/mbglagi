const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Shipment {
  id_shipment: ID!
  id_sekolah: ID!
  id_dapur: ID!
  id_menu: ID!
  jumlah_porsi: Int
  status_kirim: String
  waktu_sampai: String

  nama_sekolah: String  
  nama_dapur: String  
  nama_menu: String  
  
  createdAt: String 
  updatedAt: String 
}

  type StatusResponse {
    isProcessing: Boolean
  }

  type MessageResponse {
    message: String
  }

  type Query {
    allShipments: [Shipment]
    shipmentById(id: ID!): Shipment
    checkMenuStatus(id_menu: ID!): StatusResponse
  }

  type Mutation {
    createShipment(
      id_sekolah: ID!
      id_dapur: ID!
      id_menu: ID!
      jumlah_porsi: Int
      status: String
      waktu_sampai: String
    ): Shipment

    updateShipment(
      id: ID!
      id_sekolah: ID
      id_dapur: ID
      id_menu: ID
      jumlah_porsi: Int
      status: String
      waktu_sampai: String
    ): MessageResponse

    deleteShipment(
      id: ID!
    ): MessageResponse
  }
`;

module.exports = typeDefs;