import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient;
  user: any; // TODO: define user type
}

export const context = ({ req }) => {
  // Note: This example uses the `req` argument to access headers,
  // but the arguments received by `context` vary by integration.
  // This means they vary for Express, Koa, Lambda, etc.
  //
  // To find out the correct arguments for a specific integration,
  // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

  // Get the user token from the headers.
  const token = req.headers.authorization || "";

  // Try to retrieve a user with the token
  // TODO implement getUser(token);
  const user = { id: 1, name: "Chalo" };

  // Add the user to the context
  return { prisma, user };
};

