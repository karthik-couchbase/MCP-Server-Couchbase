import * as dotenv from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { connect, Cluster } from 'couchbase';
import { registerTools } from './registry';
// Load environment variables
dotenv.config();

async function main() {
  const COUCHBASE_URL = process.env.COUCHBASE_URL;
  const BUCKET = process.env.COUCHBASE_BUCKET;
  const USERNAME = process.env.COUCHBASE_USERNAME;
  const PASSWORD = process.env.COUCHBASE_PASSWORD;

  // console.log(JSON.stringify(process.env, null, 2))

  if (!COUCHBASE_URL || !BUCKET || !USERNAME || !PASSWORD) {
    console.error("Error: Missing Couchbase connection environment variables.");
    console.error("Please set COUCHBASE_URL, COUCHBASE_BUCKET, COUCHBASE_USERNAME, and COUCHBASE_PASSWORD.");
    process.exit(1);
  }

  // Connect to Couchbase
  const cluster: Cluster = await connect(COUCHBASE_URL, {
    username: USERNAME,
    password: PASSWORD,
  });

  // Get the default bucket
  const defaultBucket = cluster.bucket(BUCKET);

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