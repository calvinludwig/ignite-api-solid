import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms e2e', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to search for gyms by title', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

		await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
			title: 'JavaScript Gym',
			description: 'Some description',
			phone: '1999999',
			latitude: -29.447603,
			longitude: -51.9627619,
		})
		await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
			title: 'TypeScript Gym',
			description: 'Some description',
			phone: '1999999',
			latitude: -29.447603,
			longitude: -51.9627619,
		})
		const response = await request(app.server)
			.get('/gyms/search')
			.query({
				q: 'JavaScript',
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'JavaScript Gym',
			}),
		])
	})
})
