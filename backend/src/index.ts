// npm install @apollo/server express graphql cors body-parser
import {makeExecutableSchema} from "@graphql-tools/schema"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import typeDefs from "../graphql/typeDefs";
import resolvers from "../graphql/resolvers";
import * as dotenv from "dotenv"
import {getSession} from "next-auth/react"
import { GraphQLContext, Session } from "../util/types";
import {PrismaClient} from "@prisma/client"

interface MyContext {
  token?: String;
}

const main = async()=>{
  dotenv.config();
const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const corsOptions ={
  origin:process.env.CLIENT_ORIGIN,
  credentials:true,
}

// context parameters
const prisma= new PrismaClient()



const server = new ApolloServer<MyContext>({
  schema,
  csrfPrevention:true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  '/graphql',
  cors<cors.CorsRequest>(corsOptions),
  json(),
  expressMiddleware(server, {
    context: async ({ req }):Promise<GraphQLContext> => {
      const session = await getSession({req});
      return {session:session as Session ,prisma  };
    },
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 5000 }, resolve));
console.log(`🚀 Server ready at http://localhost:5000/graphql`);
}

main().catch((err)=>console.log(err))