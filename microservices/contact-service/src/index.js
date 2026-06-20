// contact-service
// Responsibility: ONE thing only — receive and validate contact form submissions
// Does not know about projects. Does not serve HTML.
// In production this would write to a database or send an email.

const http = require('http')

const PORT = process.env.PORT || 3002

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(body)) }
      catch { reject(new Error('invalid JSON')) }
    })
  })
}

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

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  // Preflight request — browser sends this before POST to check CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200)
    res.end(JSON.stringify({ status: 'healthy', service: 'contact-service' }))
    return
  }

  if (req.method === 'POST' && req.url === '/contact') {
    try {
      const body = await parseBody(req)
      const errors = validate(body)

      if (errors.length > 0) {
        res.writeHead(400)
        res.end(JSON.stringify({ status: 'error', errors }))
        return
      }

      // In production: send email via SendGrid, or write to database
      console.log('Contact form received:', { name: body.name, email: body.email })

      res.writeHead(200)
      res.end(JSON.stringify({ status: 'ok', message: 'Message received' }))
    } catch {
      res.writeHead(400)
      res.end(JSON.stringify({ status: 'error', errors: ['invalid request body'] }))
    }
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(PORT, () => {
  console.log(`contact-service running on port ${PORT}`)
})
