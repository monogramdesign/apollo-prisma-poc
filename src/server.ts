import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from './schema'
import { context } from './context'

new ApolloServer({
  resolvers,
  typeDefs,
  context: context,
  introspection: process.env.INTROSPECTION === "true",
})
  .listen({ port: 4000 })
  .then(({ url }) => {
    `🚀 Server ready at: ${url}. INTROSPECTION=${process.env.INTROSPECTION}`;
  });
