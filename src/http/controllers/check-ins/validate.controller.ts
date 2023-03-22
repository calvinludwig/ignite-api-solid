import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
	const validateCheckInParamSchema = z.object({
		id: z.string().uuid(),
	})
	const { id } = validateCheckInParamSchema.parse(request.params)
	const validateCheckInUseCase = makeValidateCheckInUseCase()
	await validateCheckInUseCase.execute({
		checkInId: id,
	})
	return reply.status(204).send()
}
