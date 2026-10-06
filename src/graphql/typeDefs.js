export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    category: String!
    description: String!
  }

  input ProductFilterInput {
    name: String
    category: String
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
  }

  input UpdateProductInput {
    name: String
    price: Float
    stock: Int
    category: String
    description: String
  }

  type Query {
    products(filter: ProductFilterInput): [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    updateProduct(id: ID!, input: UpdateProductInput!): Product
  }
`;