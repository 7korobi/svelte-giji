var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/server.js
import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
const app = express();
const httpServer = http.createServer(app);
app.use(assetsMiddleware, prerenderedMiddleware, kitMiddleware);
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql `
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!'
    },
    Mutation: {
        double: (_, { x }) => x * 2
    }
};
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        console.error(`bootup server...`);
        // The ApolloServer constructor requires two parameters: your schema
        // definition and your set of resolvers.
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
        });
        yield server.start();
        server.applyMiddleware({ app, path: '/graphql' });
        yield new Promise(() => httpServer.listen({ port: 3000 }));
        console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
    });
}
start();
//# sourceMappingURL=index.js.map