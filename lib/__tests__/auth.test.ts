import { describe, it, expect, beforeAll } from 'vitest'
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from '../auth'

describe('auth', () => {
  beforeAll(() => {
    process.env.SESSION_SECRET = 'test-secret-must-be-at-least-32-characters-long'
  })

  it('hashes and verifies passwords', async () => {
    const hash = await hashPassword('my-password')
    expect(hash).not.toBe('my-password')
    expect(await verifyPassword('my-password', hash)).toBe(true)
    expect(await verifyPassword('wrong-password', hash)).toBe(false)
  })

  it('creates and verifies session tokens', async () => {
    const user = { userId: 1, email: 'test@example.com', role: 'user' as const }
    const token = await createSessionToken(user)
    const verified = await verifySessionToken(token)
    expect(verified).toEqual(user)
  })

  it('rejects tampered tokens', async () => {
    const verified = await verifySessionToken('invalid-token')
    expect(verified).toBeNull()
  })
})
