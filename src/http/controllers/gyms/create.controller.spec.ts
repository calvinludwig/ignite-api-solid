import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym e2e', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a gym', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const response = await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
			title: 'Javascript Gym',
			description: 'Some description',
			phone: '1999999',
			latitude: -29.447603,
			longitude: -51.9627619,
		})

		expect(response.statusCode).toEqual(201)
	})
})
