// projects-service
// Responsibility: ONE thing only — serve portfolio project data
// Other services never touch this data. They ask this service for it.

const http = require('http')

// In a real company this would be a database query.
// The data lives HERE, owned by this service — no other service
// has a copy. This is "single source of truth" per service.
const projects = [
  {
    id: 1,
    title: 'RAG Pipeline',
    category: 'AI/ML',
    description: 'LLM-powered retrieval system using vector embeddings',
    tags: ['Python', 'LangChain', 'OpenAI'],
  },
  {
    id: 2,
    title: 'Micro-Frontend Auth Layer',
    category: 'Frontend',
    description: 'Secure cross-origin communication between micro-frontends at HubSpot',
    tags: ['React', 'Redux', 'PostMessage API'],
  },
  {
    id: 3,
    title: 'Spring Boot Microservice',
    category: 'Backend',
    description: 'REST API with observability and performance optimization',
    tags: ['Java', 'Spring Boot', 'Prometheus'],
  },
]

const PORT = process.env.PORT || 3001

const server = http.createServer((req, res) => {
  // CORS header — allows the API gateway (different port) to call this service
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET' && req.url === '/projects') {
    res.writeHead(200)
    res.end(JSON.stringify({ status: 'ok', data: projects }))
    return
  }

  if (req.method === 'GET' && req.url === '/health') {
    // Health endpoint — the CI/CD pipeline and Kubernetes ping this
    // to know if the service is alive before routing traffic to it
    res.writeHead(200)
    res.end(JSON.stringify({ status: 'healthy', service: 'projects-service' }))
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(PORT, () => {
  console.log(`projects-service running on port ${PORT}`)
})
