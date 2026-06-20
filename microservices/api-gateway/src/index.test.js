const { describe, it } = require('node:test')
const assert = require('node:assert')

// Test routing logic in isolation
const ROUTES = {
  'GET /api/projects': 'projects-service',
  'POST /api/contact': 'contact-service',
}

function resolveRoute(method, url) {
  return ROUTES[`${method} ${url}`] || null
}

describe('api-gateway routing', () => {
  it('routes GET /api/projects to projects-service', () => {
    assert.strictEqual(resolveRoute('GET', '/api/projects'), 'projects-service')
  })

  it('routes POST /api/contact to contact-service', () => {
    assert.strictEqual(resolveRoute('POST', '/api/contact'), 'contact-service')
  })

  it('returns null for unknown routes', () => {
    assert.strictEqual(resolveRoute('GET', '/unknown'), null)
  })
})
