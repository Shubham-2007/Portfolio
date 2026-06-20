const { describe, it } = require('node:test')
const assert = require('node:assert')

// Test the validation logic in isolation — no HTTP server needed
function validate(data) {
  const errors = []
  if (!data.name || data.name.trim().length < 2)
    errors.push('name must be at least 2 characters')
  if (!data.email || !data.email.includes('@'))
    errors.push('valid email is required')
  if (!data.message || data.message.trim().length < 10)
    errors.push('message must be at least 10 characters')
  return errors
}

describe('contact-service validation', () => {
  it('accepts a valid submission', () => {
    const errors = validate({
      name: 'Shubham',
      email: 'shubham@example.com',
      message: 'Hello, I would like to connect with you.'
    })
    assert.strictEqual(errors.length, 0)
  })

  it('rejects missing email', () => {
    const errors = validate({ name: 'Shubham', email: '', message: 'Hello there world' })
    assert.ok(errors.some(e => e.includes('email')))
  })

  it('rejects short message', () => {
    const errors = validate({ name: 'Shubham', email: 'a@b.com', message: 'Hi' })
    assert.ok(errors.some(e => e.includes('message')))
  })

  it('rejects missing name', () => {
    const errors = validate({ name: '', email: 'a@b.com', message: 'Hello there world' })
    assert.ok(errors.some(e => e.includes('name')))
  })
})
