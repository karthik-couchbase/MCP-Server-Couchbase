import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Cluster, Bucket } from 'couchbase';
import { z } from 'zod';

export function registerCollectionTools(server: McpServer, cluster: Cluster, bucket: Bucket) {
  server.tool(
    'createCollection',
    'Create a new collection in a scope',
    {
      collectionName: z.string().describe('The name of the collection to create'),
      scopeName: z.string().describe('The name of the scope to create the collection in'),
    },
    async ({ collectionName, scopeName }) => {
      try {
        const collectionManager = bucket.collections();
        await collectionManager.createCollection(collectionName, scopeName);
        return {
          content: [{ type: 'text', text: `Collection ${collectionName} created successfully in scope ${scopeName}` }],
          isError: false
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to create collection: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.tool(
    'dropCollection', 
    'Delete a collection from a scope',
    {
      collectionName: z.string().describe('The name of the collection to drop'),
      scopeName: z.string().describe('The name of the scope to drop the collection from'),
    },
    async ({ collectionName, scopeName }) => {
      try {
        const collectionManager = bucket.collections();
        await collectionManager.dropCollection(collectionName, scopeName);
        return {
          content: [{ type: 'text', text: `Collection ${collectionName} dropped successfully from scope ${scopeName}` }],
          isError: false
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to drop collection: ${error.message}` }],
          isError: true
        };
      }
    }
  );
}
