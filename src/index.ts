import "dotenv/config";
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { connect, Cluster } from 'couchbase';
import { registerTools } from './registry';
import { config } from 'dotenv';

// Load environment variables
config();

async function main() {

  const env = {
    "COUCHBASE_URL": "couchbases://cb.nn723hj-11yxopb.cloud.couchbase.com",
    "COUCHBASE_BUCKET": "travel-sample",
    "COUCHBASE_USERNAME": "Admin",
    "COUCHBASE_PASSWORD": "Admin@123"
  }
  const url = process.env.COUCHBASE_URL;
  const bucket = process.env.COUCHBASE_BUCKET;
  const username = process.env.COUCHBASE_USERNAME;
  const password = process.env.COUCHBASE_PASSWORD;

  if (!url || !bucket || !username || !password) {
    throw new Error('Missing required environment variables. Please check your .env file');
  }

  // Connect to Couchbase
  const cluster: Cluster = await connect(url, {
    username,
    password,
  });

  // Get the default bucket
  const defaultBucket = cluster.bucket(bucket);

  // Create MCP server instance
  const server = new McpServer({
    name: 'couchbase-mcp-server',
    version: '1.0.0',
  });

  // Register all tools
  registerTools(server, cluster, defaultBucket);

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log('Couchbase MCP Server is running...');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { registerQueryTools } from './tools/query'; 