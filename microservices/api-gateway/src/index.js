// api-gateway
// Responsibility: single entry point for all client requests.
// The browser talks ONLY to this service.
// This service routes requests to the correct downstream service.
//
// Pattern: the browser doesn't know projects-service or contact-service
// even exist. It just calls /api/projects and /api/contact.
// The gateway translates those into calls to the right service.
//
// This is called the "API Gateway pattern" — used by Netflix, Amazon,
// HubSpot. It also handles auth, rate limiting, and logging centrally.

const http = require('http')

const PORT = process.env.PORT || 3000

// Service registry — in production this would come from Kubernetes
// service discovery or a config file, not hardcoded here.
const SERVICES = {
  projects: process.env.PROJECTS_SERVICE_URL || 'http://localhost:3001',
  contact:  process.env.CONTACT_SERVICE_URL  || 'http://localhost:3002',
}

// Forward a request to a downstream service and pipe the response back
function proxy(targetUrl, req, res) {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl)
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    }

    const proxyReq = http.request(options, proxyRes => {
      res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' })
      proxyRes.pipe(res)
      resolve()
    })

    proxyReq.on('error', reject)

    // Forward request body (for POST)
    req.pipe(proxyReq)
  })
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  console.log(`[gateway] ${req.method} ${req.url}`)

  try {
    // Route: GET /api/projects → projects-service
    if (req.method === 'GET' && req.url === '/api/projects') {
      await proxy(`${SERVICES.projects}/projects`, req, res)
      return
    }

    // Route: POST /api/contact → contact-service
    if (req.method === 'POST' && req.url === '/api/contact') {
      await proxy(`${SERVICES.contact}/contact`, req, res)
      return
    }

    // Health check — lets the pipeline verify the gateway itself is alive
    if (req.url === '/health') {
      res.writeHead(200)
      res.end(JSON.stringify({ status: 'healthy', service: 'api-gateway' }))
      return
    }

    res.writeHead(404)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'route not found' }))

  } catch (err) {
    // Downstream service is unreachable
    console.error('[gateway] upstream error:', err.message)
    res.writeHead(502)
    res.end(JSON.stringify({ error: 'upstream service unavailable' }))
  }
})

server.listen(PORT, () => {
  console.log(`api-gateway running on port ${PORT}`)
  console.log(`  → /api/projects  proxies to ${SERVICES.projects}`)
  console.log(`  → /api/contact   proxies to ${SERVICES.contact}`)
})
