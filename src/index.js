import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@as-integrations/express5';
import mongoose from 'mongoose';
import { resolvers } from './graphql/resolvers.js';
import { typeDefs } from './graphql/typeDefs.js';

function getMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER_HOST } = process.env;
  if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_CLUSTER_HOST) {
    throw new Error(
      'Configura MONGODB_URI o MONGODB_USERNAME, MONGODB_PASSWORD y MONGODB_CLUSTER_HOST.',
    );
  }

  const username = encodeURIComponent(MONGODB_USERNAME);
  const password = encodeURIComponent(MONGODB_PASSWORD);
  return `mongodb+srv://${username}:${password}@${MONGODB_CLUSTER_HOST}/`;
}

async function startServer() {
  await mongoose.connect(getMongoUri(), {
    dbName: process.env.MONGODB_DATABASE || 'CreateDatabaseonAtlas',
  });

  const app = express();
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await apollo.start();
  app.get('/healthz', (_, response) => response.status(200).json({ status: 'ok' }));
  app.use('/graphql', cors(), express.json(), expressMiddleware(apollo));

  const port = Number(process.env.PORT) || 4000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Apollo Sandbox disponible en http://localhost:${port}/graphql`);
  });
}

startServer().catch((error) => {
  console.error('No se pudo iniciar la API:', error.message);
  process.exit(1);
});