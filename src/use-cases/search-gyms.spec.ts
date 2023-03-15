import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {

	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymsUseCase(gymsRepository)
	})

	it('should be able to search for gyms', async () => {

		await gymsRepository.create({
			title: 'JavaScript GYM',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		})
		await gymsRepository.create({
			title: 'TypeScript GYM',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		})

		const { gyms } = await sut.execute({
			query: 'JavaScript',
			page: 1,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({title: 'JavaScript GYM'})
		])
	})
	
	it('should be able to fetch paginated gyms search', async () => {

		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `JavaScript GYM ${i}`,
				description: null,
				phone: null,
				latitude: 0,
				longitude: 0,
			})
		}

		const { gyms } = await sut.execute({
			query: 'JavaScript',
			page: 2,
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({title: 'JavaScript GYM 21'}),
			expect.objectContaining({title: 'JavaScript GYM 22'})
		])
	})
})