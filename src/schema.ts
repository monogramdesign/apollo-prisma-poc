import { gql } from 'apollo-server'
import { DateTimeResolver } from 'graphql-scalars'
import { context, Context } from './context'

export const typeDefs = gql`
  type Product {
    id:        ID!
    createdAt: DateTime
    updatedAt: DateTime
    name:     String!
    published: Boolean!
    price:    Float!
    category:    Category!
    orders:  [Order]
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
    addProduct(name: String!, price: Float!, published: Boolean, category: CategoryUniqueInput!): Product
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
`

export const resolvers = {
  Query: {
    allProducts: (_parent, _args, context: Context) => {
      return context.prisma.product.findMany()
    },
    productById: (_parent, args: { id: number }, context: Context) => {
      return context.prisma.product.findUnique({
        where: { id: args.id || undefined },
      })
    },
    productsByCategory: (_parent, args: { categoryId: number }, context: Context) => {
      return context.prisma.product.findMany({
        where: {
          categoryId: args.categoryId
        }
      })
    },
  },
  Mutation: {
    addProduct: (
      _parent, 
      args: {data: {name: string, price: number, published: boolean, categoryId: number}}
      ) => {
        return context.prisma.product.create({
          data:{
            name: args.data.name,
            price: args.data.price,
            published: args.data.published,
            categoryId: args.data.categoryId,
          }
        })
      }
  //   signupUser: (
  //     _parent,
  //     args: { data: UserCreateInput },
  //     context: Context,
  //   ) => {
  //     const postData = args.data.posts?.map((post) => {
  //       return { title: post.title, content: post.content || undefined }
  //     })

  //     return context.prisma.user.create({
  //       data: {
  //         name: args.data.name,
  //         email: args.data.email,
  //         posts: {
  //           create: postData,
  //         },
  //       },
  //     })
  //   },
  //   createDraft: (
  //     _parent,
  //     args: { data: PostCreateInput; authorEmail: string },
  //     context: Context,
  //   ) => {
  //     return context.prisma.post.create({
  //       data: {
  //         title: args.data.title,
  //         content: args.data.content,
  //         author: {
  //           connect: { email: args.authorEmail },
  //         },
  //       },
  //     })
  //   },
  //   togglePublishPost: async (
  //     _parent,
  //     args: { id: number },
  //     context: Context,
  //   ) => {
  //     try {
  //       const post = await context.prisma.post.findUnique({
  //         where: { id: args.id || undefined },
  //         select: {
  //           published: true,
  //         },
  //       })

  //       return context.prisma.post.update({
  //         where: { id: args.id || undefined },
  //         data: { published: !post?.published },
  //       })
  //     } catch (error) {
  //       throw new Error(
  //         `Post with ID ${args.id} does not exist in the database.`,
  //       )
  //     }
  //   },
  //   incrementPostViewCount: (
  //     _parent,
  //     args: { id: number },
  //     context: Context,
  //   ) => {
  //     return context.prisma.post.update({
  //       where: { id: args.id || undefined },
  //       data: {
  //         viewCount: {
  //           increment: 1,
  //         },
  //       },
  //     })
  //   },
  //   deletePost: (_parent, args: { id: number }, context: Context) => {
  //     return context.prisma.post.delete({
  //       where: { id: args.id },
  //     })
  },
  DateTime: DateTimeResolver,
  Product: {
    category: (parent, _args, context: Context) => {
      return context.prisma.product
        .findUnique({
          where: { id: parent?.id },
        })
        .category()
    },
  },
  Category: {
    products: (parent, _args, context: Context) => {
      return context.prisma.category
        .findUnique({
          where: { id: parent?.id },
        })
        .products()
    },
  },
}

// enum SortOrder {
//   asc = 'asc',
//   desc = 'desc',
// }

// interface PostOrderByUpdatedAtInput {
//   updatedAt: SortOrder
// }

// interface UserUniqueInput {
//   id?: number
//   email?: string
// }

// interface PostCreateInput {
//   title: string
//   content?: string
// }

// interface UserCreateInput {
//   email: string
//   name?: string
//   posts?: PostCreateInput[]
// }