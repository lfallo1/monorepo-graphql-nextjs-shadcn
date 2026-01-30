import 'reflect-metadata';
import { buildSchema, type BuildSchemaOptions } from 'type-graphql';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProductResolver, OrderResolver, UserResolver } from './resolvers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Build the GraphQL schema using TypeGraphQL.
 *
 * This is similar to the pattern used in the reference project:
 * - Resolvers are classes decorated with @Resolver, @Query, @Mutation, etc.
 * - Types are classes decorated with @ObjectType, @Field, etc.
 * - The schema is built at runtime from these decorated classes
 *
 * @param emitGeneratedSchemaFile - If true, emits the generated schema.graphql file
 */
export const buildGraphQLSchema = async ({ emitGeneratedSchemaFile }: { emitGeneratedSchemaFile: boolean }) => {
  const options: BuildSchemaOptions = {
    resolvers: [
      ProductResolver,
      OrderResolver,
      UserResolver,
    ],
    // Emit the schema file for reference/debugging
    emitSchemaFile: emitGeneratedSchemaFile ? path.resolve(__dirname, 'schema.graphql') : false,
    // Validation options
    validate: { forbidUnknownValues: false },
  };

  return buildSchema(options);
};
