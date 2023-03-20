import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { create } from './create.controller'
import { history } from './history.controller'
import { metrics } from './metrics.controller'
import { validate } from './validate.controller'

export async function checkInRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)

	app.post('/gyms/:gymId/check-ins', create)
	app.get('/check-ins/history', history)
	app.get('/check-ins/metrics', metrics)

	app.patch(
		'/check-ins/:id/validate',
		{ onRequest: [verifyUserRole('ADMIN')] },
		validate,
	)
}
