import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Far GYM',
			description: null,
			phone: null,
			latitude: -29.447603,
			longitude: -51.9627619,
		})
		await gymsRepository.create({
			title: 'Near GYM',
			description: null,
			phone: null,
			latitude: -29.4687237,
			longitude: -52.0851598,
		})

		const { gyms } = await sut.execute({
			userLatitude: -29.4648955,
			userLongitude: -52.0816416,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ title: 'Near GYM' })])
	})
})
