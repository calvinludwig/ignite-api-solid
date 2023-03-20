import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create.controller'
import { history } from './history.controller'
import { metrics } from './metrics.controller'
import { validate } from './validate.controller'

export async function checkInRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)

	app.post('/gyms/:gymId/check-ins', create)
	app.patch('/gyms/:gymId/check-ins', validate)
	app.get('/check-ins/history', history)
	app.get('/check-ins/metrics', metrics)
}
