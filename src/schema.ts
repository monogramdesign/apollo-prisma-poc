import { Category } from "@prisma/client";
import { gql } from "apollo-server";
import { DateTimeResolver } from "graphql-scalars";
import { context, Context } from "./context";

export const typeDefs = gql`
  type Product {
    id: ID!
    createdAt: DateTime
    updatedAt: DateTime
    name: String!
    published: Boolean!
    price: Float!
    category: Category!
    orders: [Order]
  }

  type Category {
    id: ID!
    name: String!
    products: [Product!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    orders: [Order]
  }

  type Order {
    id: ID!
    createdAt: DateTime!
    product: Product
    user: User
  }

  type Query {
    allProducts: [Product!]!
    productsByCategory(categoryId: Int!): [Product]
    productById(id: Int): Product

    allUsers: [User!]!

    allCategories: [Category!]!

    allOrders: [Order!]!
  }

  type Mutation {
    addProduct(
      name: String!
      price: Float!
      published: Boolean
      category: CategoryUniqueInput!
    ): Product
  }

  input ProductOrderByPriceAtInput {
    price: SortOrder!
  }

  input CategoryUniqueInput {
    name: String
    id: Int
  }

  enum SortOrder {
    asc
    desc
  }

  scalar DateTime
`;

export const resolvers = {
  Query: {
    allProducts: (_parent, _args, context: Context) => {
      return context.prisma.product.findMany();
    },
    productById: (_parent, args: { id: number }, context: Context) => {
      return context.prisma.product.findUnique({
        where: { id: args.id || undefined },
      });
    },
    productsByCategory: (
      _parent,
      args: { categoryId: number },
      context: Context
    ) => {
      return context.prisma.product.findMany({
        where: {
          categoryId: args.categoryId,
        },
      });
    },
  },
  Mutation: {
    addProduct: (
      _parent,
      args: {
        name: string;
        price: number;
        published: boolean;
        category: Category;
      }
    ) => {
      return context.prisma.product.create({
        data: {
          name: args.name,
          price: args.price,
          published: args.published,
          category: {
            connect: { id: args.category.id },
          },
        },
      });
    },
  },
  DateTime: DateTimeResolver,
  Product: {
    category: (parent, _args, context: Context) => {
      return context.prisma.product
        .findUnique({
          where: { id: parent?.id },
        })
        .category();
    },
  },
  Category: {
    products: (parent, _args, context: Context) => {
      return context.prisma.category
        .findUnique({
          where: { id: parent?.id },
        })
        .products();
    },
  },
};
