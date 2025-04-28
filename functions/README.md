# OpenSponsor API

A Firebase Functions API built with Fastify for the OpenSponsor platform.

## Tech Stack

-   **Firebase Functions**: Serverless functions
-   **TypeScript**: Type-safe JavaScript
-   **Fastify**: Modern, fast web framework for Node.js
-   **Firebase Admin SDK**: For Firebase services integration

## API Structure

The API follows a RESTful architecture with the following components:

-   **Routes**: Organized in the `/src/routes` directory
-   **API Versioning**: All endpoints are prefixed with `/api/v1`

## Available Endpoints

### Base Endpoints

-   `GET /`: Welcome message
-   `GET /health`: Health check endpoint

### Sponsors Endpoints

-   `GET /api/v1/sponsors`: Get all sponsors
-   `GET /api/v1/sponsors/:id`: Get a specific sponsor
-   `POST /api/v1/sponsors`: Create a new sponsor
-   `PUT /api/v1/sponsors/:id`: Update a sponsor
-   `DELETE /api/v1/sponsors/:id`: Delete a sponsor

## Development

### Prerequisites

-   Node.js 22+
-   Firebase CLI
-   npm or yarn

### Getting Started

1. Install dependencies:

    ```
    npm install
    ```

2. Run the local development server:

    ```
    npm run serve
    ```

3. To deploy to Firebase:
    ```
    npm run deploy
    ```

## Testing API Locally

You can use tools like cURL, Postman, or REST Client to test your API locally:

```bash
# Get all sponsors
curl http://localhost:5001/[your-project-id]/us-central1/api/api/v1/sponsors

# Create a new sponsor
curl -X POST http://localhost:5001/[your-project-id]/us-central1/api/api/v1/sponsors \
  -H "Content-Type: application/json" \
  -d '{"name":"New Sponsor","tier":"platinum","website":"https://example.org"}'
```

## Future Enhancements

-   Add authentication middleware
-   Implement database integration (Firestore)
-   Add request validation
-   Set up unit and integration tests
