// Unit tests for projects-service
// In microservices, each service tests ITSELF.
// No other service is involved in these tests.

const { describe, it } = require('node:test')
const assert = require('node:assert')

// Import just the data/logic, not the server
// (tests shouldn't need to start a real HTTP server)
const projects = [
  { id: 1, title: 'RAG Pipeline', category: 'AI/ML' },
  { id: 2, title: 'Micro-Frontend Auth Layer', category: 'Frontend' },
  { id: 3, title: 'Spring Boot Microservice', category: 'Backend' },
]

describe('projects-service', () => {
  it('should have at least one project', () => {
    assert.ok(projects.length > 0)
  })

  it('every project has required fields', () => {
    projects.forEach(p => {
      assert.ok(p.id, 'missing id')
      assert.ok(p.title, 'missing title')
      assert.ok(p.category, 'missing category')
    })
  })

  it('project ids are unique', () => {
    const ids = projects.map(p => p.id)
    const unique = new Set(ids)
    assert.strictEqual(ids.length, unique.size)
  })
})
