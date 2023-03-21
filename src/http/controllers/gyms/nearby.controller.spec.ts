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

	it('should be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app, true)
		await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
			title: 'Near Gym',
			description: 'Some description',
			phone: '1999999',
			latitude: -29.4687237,
			longitude: -52.0851598,
		})
		await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
			title: 'Far Gym',
			description: 'Some description',
			phone: '1999999',
			latitude: -29.447603,
			longitude: -51.9627619,
		})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -29.4687237,
				longitude: -52.0851598,
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Near Gym',
			}),
		])
	})
})
