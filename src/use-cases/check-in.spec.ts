import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxNumberOfCheckInsError } from './errors/max-distance-error'
import { MaxDistanceError } from './errors/max-number-of-check-ins'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)
		vi.useFakeTimers()

		gymsRepository.create({
			id: 'b',
			title: 'Javascript GYM',
			description: '',
			phone: '',
			latitude: 0,
			longitude: 0,
		})
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'a',
			gymId: 'b',
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await sut.execute({
			userId: 'a',
			gymId: 'b',
			userLatitude: 0,
			userLongitude: 0,
		})

		await expect(() =>
			sut.execute({
				userId: 'a',
				gymId: 'b',
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})

	it('should be able to check in twice but int different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await sut.execute({
			userId: 'a',
			gymId: 'b',
			userLatitude: 0,
			userLongitude: 0,
		})

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

		const { checkIn } = await sut.execute({
			userId: 'a',
			gymId: 'b',
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gym', async () => {
		const gymId = randomUUID()

		gymsRepository.items.push({
			id: gymId,
			title: 'Javascript GYM',
			description: '',
			phone: '',
			latitude: new Decimal(-29.4692983),
			longitude: new Decimal(-52.0885952),
		})

		await expect(() =>
			sut.execute({
				userId: 'a',
				gymId,
				userLatitude: -29.4648955,
				userLongitude: -52.0816416,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})
