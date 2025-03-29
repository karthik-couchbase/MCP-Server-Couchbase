import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Cluster, Bucket } from 'couchbase';
import { z } from 'zod';

export function registerScopeTools(server: McpServer, cluster: Cluster, bucket: Bucket) {
    server.tool(
        'createScope',
        'Create a new scope in the bucket',
        {
            scopeName: z.string().describe('Name of the scope to create'),
        },
        async ({ scopeName }) => {
            try {
                await bucket.collections().createScope(scopeName);
                return {
                    content: [{ type: 'text', text: `Successfully created scope: ${scopeName}` }],
                    isError: false,
                };
            } catch (error: any) {
                return {
                    content: [{ type: 'text', text: `Failed to create scope: ${error.message}` }],
                    isError: true,
                };
            }
        }
    );

    server.tool(
        'deleteScope',
        'Delete an existing scope from the bucket',
        {
            scopeName: z.string().describe('Name of the scope to delete'),
        },
        async ({ scopeName }) => {
            try {
                await bucket.collections().dropScope(scopeName);
                return {
                    content: [{ type: 'text', text: `Successfully deleted scope: ${scopeName}` }],
                    isError: false,
                };
            } catch (error: any) {
                return {
                    content: [{ type: 'text', text: `Failed to delete scope: ${error.message}` }],
                    isError: true,
                };
            }
        }
    );

    server.tool(
        'listScopes',
        'List all scopes in the bucket',
        {},
        async () => {
            try {
                const scopes = await bucket.collections().getAllScopes();
                const scopeNames = scopes.map(scope => scope.name);
                return {
                    content: [{ type: 'text', text: JSON.stringify(scopeNames, null, 2) }],
                    isError: false,
                };
            } catch (error: any) {
                return {
                    content: [{ type: 'text', text: `Failed to list scopes: ${error.message}` }],
                    isError: true,
                };
            }
        }
    );
} 