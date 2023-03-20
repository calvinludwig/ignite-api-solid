import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Profile (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate', async () => {
		const { token } = await createAndAuthenticateUser(app, false)

		const response = await request(app.server)
			.get('/me')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.user).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				name: 'John Doe',
				email: 'johndoe@example.com',
				created_at: expect.any(String),
			}),
		)
	})
})
