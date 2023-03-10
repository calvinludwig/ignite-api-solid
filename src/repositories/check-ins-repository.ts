import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
	findManyByUser(userId: string, page: number): Promise<CheckIn[]>
}
