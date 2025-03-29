# 🗄️ Couchbase MCP Server for LLMs

A Model Context Protocol (MCP) server that enables LLMs to interact directly with Couchbase databases on Capella clusters. Query buckets, perform CRUD operations, execute N1QL queries, and manage data seamlessly through natural language.

## 🚀 Quick Start

1. **Prerequisites**

   - Node.js 16 or higher
   - A running Couchbase instance on Capella
   - Claude Desktop application

2. **Installation**

   ```bash
   # Clone the repository
   git clone https://github.com/Aniket310101/MCP-Server-Couchbase.git
   cd MCP-Server-Couchbase

   # Install dependencies
   npm install
   ```

3. **Configuration**

   - Create a `.env` file in the root directory with your Couchbase credentials:
     ```env
     COUCHBASE_URL=your_couchbase_url
     COUCHBASE_USERNAME=your_username
     COUCHBASE_PASSWORD=your_password
     COUCHBASE_BUCKET=your_bucket_name
     ```

4. **Build the Project**

   ```bash
   npm run build
   ```

5. **Claude Desktop Integration**
   Add this configuration to your Claude Desktop config file:

   **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`  
   **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "couchbase": {
         "command": "node",
         "args": ["path/to/MCP-Server-Couchbase/dist/index.js"],
         "env": {
           "COUCHBASE_URL": "<COUCHBASE CONNECTION STRING>",
           "COUCHBASE_BUCKET": "<BUCKET NAME>",
           "COUCHBASE_USERNAME": "<COUCHBASE USERNAME>",
           "COUCHBASE_PASSWORD": "<COUCHBASE PASSWORD>"
         }
       }
     }
   }
   ```

6. **Verify Connection**
   - Restart Claude Desktop
   - The Couchbase MCP server tools should now be available in your conversations

## 📝 Available Tools

### Basic Operations

- `query`: Execute N1QL queries
- `listBuckets`: List available buckets

### Scope Management

- `createScope`: Create a new scope in a bucket
- `deleteScope`: Delete an existing scope
- `listScopes`: List all scopes in a bucket

### Collection Management

- `createCollection`: Create a new collection in a scope
- `dropCollection`: Delete a collection from a scope

### Document Operations

- `createDocument`: Create a new document
- `getDocument`: Retrieve a document by ID
- `updateDocument`: Update an existing document
- `deleteDocument`: Delete a document by ID
- `bulkCreateDocuments`: Create multiple documents at once

### Index Management

- `createIndex`: Create a new index on specified fields
- `createPrimaryIndex`: Create a primary index on a collection
- `listIndexes`: List all indexes in a bucket
- `dropIndex`: Drop an existing index

Each tool supports optional `collection` and `scope` parameters for targeting specific data containers.

## 🔒 Security Considerations

- Always use environment variables for sensitive credentials
- Consider running the server behind a reverse proxy for production use
- Implement appropriate access controls and authentication as needed

## 📚 Examples

Here are some example interactions with Claude using the MCP server:

1. List all buckets:

   ```
   Could you show me all available buckets in the database?
   ```

2. Create a scope and collection:

   ```
   Create a new scope called "users" and a collection called "profiles" in it
   ```

3. Query documents:

   ```
   Find all users who signed up in the last 30 days
   ```

4. Create a document:
   ```
   Create a new user document with name "John Doe" and email "john@example.com"
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
