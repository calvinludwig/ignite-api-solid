import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface UseCaseRequest {
	userId: string
	page: number
}

interface UseCaseResponse {
	checkIns: CheckIn[]
}

export class ListUserCheckInsHistoryUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
	) {}

	async execute({ userId, page }: UseCaseRequest): Promise<UseCaseResponse> {
		const checkIns = await this.checkInsRepository.findManyByUser(userId, page)
		return { checkIns }
	}
}
