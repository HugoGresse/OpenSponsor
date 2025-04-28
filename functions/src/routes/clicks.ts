import { FastifyInstance } from 'fastify'
import { logger } from 'firebase-functions'
import { FieldValue } from 'firebase-admin/firestore'
import * as admin from 'firebase-admin'

// Define interfaces for type safety
interface YearData {
    total: number
    [month: string]: number
}

interface AggregateData {
    [year: string]: YearData
}

interface ClickData {
    sponsorId: string
    scopeId: string
    totalClicks: number
    aggregate: AggregateData
    lastUpdated: FirebaseFirestore.FieldValue
}

/**
 * Click tracking routes
 */
export default async function clicksRoutes(fastify: FastifyInstance) {
    // Track a click for a specific sponsor in a specific scope
    fastify.get('/scopes/:scopeId/sponsors/:sponsorId/click', async (request, reply) => {
        try {
            const { scopeId, sponsorId } = request.params as { scopeId: string; sponsorId: string }

            // Get current date for aggregation
            const now = new Date()
            const year = now.getFullYear().toString()
            const month = (now.getMonth() + 1).toString() // Month is 0-indexed

            // Get Firestore instance from fastify.firebase
            const db = fastify.firebase.firestore()

            // Reference to the specific click counter document
            const clickRef = db.collection('scopes').doc(scopeId).collection('clicks').doc(sponsorId)

            // Create a transaction to safely update the counters
            await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
                // Get the current document
                const clickDoc = await transaction.get(clickRef)

                if (!clickDoc.exists) {
                    // Initialize the document if it doesn't exist
                    const newData: ClickData = {
                        sponsorId,
                        scopeId,
                        totalClicks: 1,
                        aggregate: {
                            [year]: {
                                total: 1,
                                [month]: 1,
                            },
                        },
                        lastUpdated: FieldValue.serverTimestamp(),
                    }
                    transaction.set(clickRef, newData)
                } else {
                    // Update the existing document
                    transaction.update(clickRef, {
                        totalClicks: FieldValue.increment(1),
                        [`aggregate.${year}.total`]: FieldValue.increment(1),
                        [`aggregate.${year}.${month}`]: FieldValue.increment(1),
                        lastUpdated: FieldValue.serverTimestamp(),
                    })
                }
            })

            return { success: true, message: 'Click recorded' }
        } catch (error) {
            logger.error('Failed to track click:', error)
            return reply.status(500).send({ error: 'Failed to track click' })
        }
    })
}
