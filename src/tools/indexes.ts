import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Cluster, Bucket } from 'couchbase';

export function registerIndexTools(server: McpServer, cluster: Cluster, bucket: Bucket) {
  // Create index
  server.tool(
    'createIndex',
    'Create a new index on specified fields',
    {
      indexName: z.string(),
      fields: z.array(z.string()),
      collection: z.string(),
      scope: z.string(),
    },
    async ({ indexName, fields, collection, scope }) => {
      try {
        const query = `CREATE INDEX ${indexName} ON \`${bucket.name}\`.\`${scope}\`.\`${collection}\`(${fields.join(',')})`;
        await cluster.query(query);
        return {
          content: [{ type: 'text', text: 'Index created successfully' }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to create index: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // Create primary index
  server.tool(
    'createPrimaryIndex',
    'Create a primary index on a collection',
    {
      collection: z.string().describe('The name of the collection to create the primary index on'),
      scope: z.string().describe('The name of the scope to create the primary index on'),
      indexName: z.string().optional().describe('The name of the primary index to create'),
    },
    async ({ collection, scope, indexName }) => {
      try {
        const indexClause = indexName ? ` ${indexName}` : '';
        const query = `CREATE PRIMARY INDEX${indexClause} ON \`${bucket.name}\`.\`${scope}\`.\`${collection}\``;
        await cluster.query(query);
        return {
          content: [{ type: 'text', text: 'Primary index created successfully' }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to create primary index: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // List indexes
  server.tool(
    'listIndexes',
    'List all indexes in a bucket',
    {},
    async () => {
      try {
        const query = `SELECT RAW name FROM system:indexes 
            WHERE bucket_id = '${bucket.name}'`
        const result = await cluster.query(query);
        return { 
          content: [{ type: 'text', text: JSON.stringify(result.rows, null, 2) }],
          isError: false,
        };
      } catch (error: any) {
        return { 
          content: [{ type: 'text', text: `Failed to list indexes: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // Drop index
  server.tool(
    'dropIndex',
    'Drop an existing index',
    {
      indexName: z.string().describe('The name of the index to drop'),
      collection: z.string().describe('The name of the collection to drop the index from'),
      scope: z.string().describe('The name of the scope to drop the index from'),
    },
    async ({ indexName, collection, scope }) => {
      try {
        const query = `DROP INDEX \`${bucket.name}\`.\`${scope}\`.\`${collection}\`.${indexName}`;
        await cluster.query(query);
        return {
          content: [{ type: 'text', text: 'Index dropped successfully' }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to drop index: ${error.message}` }],
          isError: true,
        };
      }
    }
  );
} 