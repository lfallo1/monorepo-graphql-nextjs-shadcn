import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildGraphQLSchema } from './schema.js';

async function bootstrap() {
  // Build the schema from TypeGraphQL decorated classes
  // Set emitGeneratedSchemaFile to true to output schema.graphql for inspection
  const schema = await buildGraphQLSchema({ emitGeneratedSchemaFile: true });

  // Create Apollo Server with the TypeGraphQL-generated schema
  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
  });

  // Start the server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      // You can add context here (e.g., authentication, dataloaders)
      return {
        // Add any shared context needed by resolvers
      };
    },
  });

  console.log(`🚀 TypeGraphQL Server ready at ${url}`);
  console.log(`📝 Schema file emitted to src/schema.graphql`);
}

bootstrap().catch(console.error);
