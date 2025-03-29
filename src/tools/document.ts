import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Cluster, Bucket } from 'couchbase';
import { optional, z } from 'zod';

export function registerDocumentTools(server: McpServer, cluster: Cluster, bucket: Bucket) {
  // Create document
  server.tool(
    'createDocument',
    'Create a new document in Couchbase',
    {
      id: z.string().describe('The ID of the document to create'),
      content: z.object({}).describe('The content of the document to create'),
      collection: z.string().describe('The name of the collection to create the document in'),
      scope: z.string().describe('The name of the scope to create the document in'),
    },
    async ({ id, content, collection, scope }) => {
      try {
        const coll = bucket.scope(scope).collection(collection);
        await coll.insert(id, content);
        return {
          content: [{ type: 'text', text: `Document created successfully: ${id}` }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to create document: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // Read document
  server.tool (
    'getDocument',
    'Retrieve a document by ID',
    {
      id: z.string().describe('The ID of the document to retrieve'),
      collection: z.string().describe('The name of the collection to retrieve the document from'),
      scope: z.string().describe('The name of the scope to retrieve the document from'),
    },
    async ({ id, collection, scope }) => {
      try {
        const coll = bucket.scope(scope).collection(collection);
        const result = await coll.get(id);
        return {
          content: [{ type: 'text', text: JSON.stringify(result.content, null, 2) }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to retrieve document: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // Update document
  server.tool(
    'updateDocument',
    'Update an existing document',
    {
      id: z.string().describe('The ID of the document to update'),
      content: z.object({}).describe('The content of the document to update'),
      collection: z.string().describe('The name of the collection to update the document in'),
      scope: z.string().describe('The name of the scope to update the document in'),
    },
    async ({ id, content, collection, scope }) => {
        try {
        const coll = bucket.scope(scope).collection(collection);
        await coll.replace(id, content);
        return {
          content: [{ type: 'text', text: `Document updated successfully: ${id}` }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to update document: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // Delete document
  server.tool(
    'deleteDocument',
    'Delete a document by ID',
    {
      id: z.string().describe('The ID of the document to delete'),
      collection: z.string().describe('The name of the collection to delete the document from'),
      scope: z.string().describe('The name of the scope to delete the document from'),
    },
    async ({ id, collection, scope }) => {
      try {
        const coll = bucket.scope(scope).collection(collection);
        await coll.remove(id);
        return {
          content: [{ type: 'text', text: `Document deleted successfully: ${id}` }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Failed to delete document: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // Bulk operations
  server.tool(
    'bulkCreateDocuments',
    'Create multiple documents in a single operation',
    {
      documents: z.array(z.object({
        id: z.string(),
        content: z.object({}),
      })),
      collection: z.string().describe('The name of the collection to create the documents in'),
      scope: z.string().describe('The name of the scope to create the documents in'),
    },
    async ({ documents, collection, scope }) => {
      try {
        const coll = bucket.scope(scope).collection(collection);
        const success: string[] = [];
        const errors: { id: string; error: string }[] = [];
        const results = await Promise.all(
          documents.map(async (doc) => {
            try {
              await coll.insert(doc.id, doc.content);
              success.push(doc.id);
            } catch (error: any) {
              errors.push({ id: doc.id, error: error.message });
            }
          })
        );
        return {
          content: [{ type: 'text', text: `Bulk operation completed. Success: ${success.join(', ')}. Errors: ${errors.map((e) => `${e.id}: ${e.error}`).join(', ')}` }],
          isError: false,
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Bulk operation failed: ${error.message}` }],
          isError: true,
        };
      }
    }
  );
} 