import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';

const typeDefs = readFileSync('./model.graphql', { encoding: 'utf-8' });
import resolvers from './resolvers.js';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false
});

// Configuration CORS
const corsOptions = {
  origin: '*', // Autorise toutes les origines pour le développement
  credentials: true // Autorise les cookies et les sessions HTTP
};

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  cors: corsOptions,
});

console.log(`🚀  Server ready at: ${url}`);
