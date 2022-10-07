import { ApolloServer } from 'apollo-server'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";

import { resolvers, typeDefs } from "./schema";
import { context } from "./context";

new ApolloServer({
  resolvers,
  typeDefs,
  context: context,

  // Enable the Apollo Studio Explorer only if the environment has the INTROSPECTION === "true" variable
  introspection: process.env.INTROSPECTION === "true",

  // Prevent CSRF and XS-Search attacks
  // https://www.apollographql.com/docs/apollo-server/security/cors#preventing-cross-site-request-forgery-csrf
  csrfPrevention: true,

  // https://www.apollographql.com/docs/apollo-server/performance/cache-backends#ensuring-a-bounded-cache
  cache: "bounded",

  cors: {
    // TODO define correct origin
    origin: [
      "https://www.your-app.example",
      "https://studio.apollographql.com",
    ],

    // Allow to pass credentials (cookies) to the server
    credentials: true,
  },

  // https://www.apollographql.com/docs/apollo-server/data/errors
  formatError: (err) => {
    // Don't give the specific errors to the client.
    if (err.message.startsWith("Database Error: ")) {
      return new Error("Internal server error");
    }

    // Otherwise return the original error. The error can also
    // be manipulated in other ways, as long as it's returned.
    return err;
  },

  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: "my-graph-id@my-graph-variant",
          footer: false,
        })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
})
  .listen({ port: 4000 })
  .then(({ url }) => {
    `🚀 Server ready at: ${url}. INTROSPECTION=${process.env.INTROSPECTION}`;
  });
