import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Cluster, Bucket } from 'couchbase';
import { registerQueryTools } from './tools/query';
import { registerDocumentTools } from './tools/document';
import { registerIndexTools } from './tools/indexes';
import { registerCollectionTools } from './tools/collection';
import { registerScopeTools } from './tools/scope';

export function registerTools(server: McpServer, cluster: Cluster, bucket: Bucket) {
  registerQueryTools(server, cluster, bucket);
  registerDocumentTools(server, cluster, bucket);
  registerIndexTools(server, cluster, bucket);
  registerCollectionTools(server, cluster, bucket);
  registerScopeTools(server, cluster, bucket);
}