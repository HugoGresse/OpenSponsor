/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https'
import { logger } from 'firebase-functions'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import clicksRoutes from './routes/clicks'
import { app as firebaseApp } from 'firebase-admin'
import { firebasePlugin } from './firebasePlugin'

type Firebase = firebaseApp.App
declare module 'fastify' {
    interface FastifyInstance {
        firebase: Firebase
    }
}

// Initialize Fastify
const app = Fastify({
    logger: true,
})

// Register plugins
app.register(cors, {
    origin: true, // Adjust as needed for production
})

// Register Firebase plugin
app.register(firebasePlugin)

// API version prefix
const API_PREFIX = '/v1'

// Register routes
app.register(clicksRoutes, { prefix: API_PREFIX })

// Define base routes
app.get('/', (_request, reply) => {
    reply.send({ message: 'Welcome to OpenSponsor API!' })
})

// Health check endpoint
app.get('/health', (_request, reply) => {
    reply.send({ status: 'ok', timestamp: new Date().toISOString() })
})

// Handle 404
app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: 'Route not found', path: request.url })
})

// Handle errors
app.setErrorHandler((error, request, reply) => {
    logger.error('Error occurred:', error)
    reply.status(500).send({ error: 'Internal server error' })
})

// Export the Firebase Functions HTTP handler
export const api = onRequest({ cors: true }, async (request, response) => {
    try {
        // Handle the request with Fastify
        await app.ready()
        app.server.emit('request', request, response)
    } catch (error) {
        logger.error('Failed to handle request:', error)
        response.status(500).send({ error: 'Internal server error' })
    }
})
