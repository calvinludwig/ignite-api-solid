import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ListUserCheckInsHistoryUseCase } from '../list-user-check-ins-history'

export function makeListUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  return new ListUserCheckInsHistoryUseCase(checkInsRepository)
}
