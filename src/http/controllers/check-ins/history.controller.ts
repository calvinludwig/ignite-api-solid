import { makeListUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-list-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
	const createCheckInQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	})
	const { page } = createCheckInQuerySchema.parse(request.query)
	const useCase = makeListUserCheckInsHistoryUseCase()
	const { checkIns } = await useCase.execute({
		userId: request.user.sub,
		page,
	})

	return reply.status(200).send({ checkIns })
}
