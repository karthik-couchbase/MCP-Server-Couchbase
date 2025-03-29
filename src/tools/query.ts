import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Cluster, Bucket } from 'couchbase';
import { z } from 'zod'; 
export function registerQueryTools(server: McpServer, cluster: Cluster, bucket: Bucket) {
    server.tool(
    'query',
    'Execute N1QL queries on Couchbase',
    {
      query: z.string().describe('The N1QL query to execute'),
    },
    async ({ query }) => {
      try { 
        const result = await cluster.query(query);
        return { 
          content: [{ type: 'text', text: JSON.stringify(result.rows, null, 2) }],
          isError: false,
        };
      } catch (error: any) {
        return { 
          content: [{ type: 'text', text: `Query failed: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    'listBuckets',
    'List all available buckets',
    {},
    async () => {
      try {
        const buckets = await cluster.buckets().getAllBuckets();
        return {
          content: [{ type: 'text', text: JSON.stringify(buckets, null, 2) }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to list buckets: ${error.message}` }],
          isError: true,
        };
      }
    }
  );
} 