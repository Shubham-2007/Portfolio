/**
 * services-bridge.js
 *
 * Connects the static frontend to the microservices running locally.
 * When services are running (localhost:3000), data comes from the API.
 * When not running (GitHub Pages), the page works as normal static HTML.
 *
 * This is called "progressive enhancement" — the page never breaks,
 * it just gets richer when the backend is available.
 */

const GATEWAY = 'http://localhost:3000'

// ─── SERVICE STATUS BAR ──────────────────────────────────────────────────────
// Injects a small banner at the top of the page showing which services
// are alive. This is your visual proof that services are talking.

async function checkServices() {
  const services = [
    { name: 'api-gateway',       url: `${GATEWAY}/health`,            port: 3000 },
    { name: 'projects-service',  url: 'http://localhost:3001/health',  port: 3001 },
    { name: 'contact-service',   url: 'http://localhost:3002/health',  port: 3002 },
  ]

  const bar = document.createElement('div')
  bar.id = 'services-status-bar'
  bar.style.cssText = `
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
    background: #1a1a2e; color: #fff; font-family: monospace;
    font-size: 12px; padding: 6px 16px;
    display: flex; gap: 20px; align-items: center;
    border-top: 1px solid #333;
  `

  const label = document.createElement('span')
  label.textContent = 'MICROSERVICES:'
  label.style.cssText = 'color: #888; font-size: 11px; letter-spacing: 1px;'
  bar.appendChild(label)

  const results = await Promise.allSettled(
    services.map(s =>
      fetch(s.url, { signal: AbortSignal.timeout(1500) })
        .then(r => r.json())
        .then(data => ({ ...s, status: data.status === 'healthy' ? 'up' : 'down' }))
        .catch(() => ({ ...s, status: 'down' }))
    )
  )

  let anyUp = false

  results.forEach(result => {
    const s = result.value
    const dot = document.createElement('span')
    const isUp = s.status === 'up'
    if (isUp) anyUp = true

    dot.innerHTML = `
      <span style="color:${isUp ? '#00ff88' : '#ff4444'}">●</span>
      <span style="color:${isUp ? '#ccc' : '#666'}; margin-left:4px">
        ${s.name} :${s.port}
      </span>
    `
    bar.appendChild(dot)
  })

  // Only show bar if at least one service is running
  if (anyUp) {
    document.body.appendChild(bar)

    const tip = document.createElement('span')
    tip.style.cssText = 'margin-left: auto; color: #555; font-size: 11px;'
    tip.textContent = 'services running locally'
    bar.appendChild(tip)
  }

  return anyUp
}

// ─── PROJECTS SECTION ────────────────────────────────────────────────────────
// Fetches projects from projects-service via the gateway.
// Injects an "API" badge next to the section title so you can
// visually see which data came from the service vs static HTML.

async function loadProjectsFromService() {
  try {
    const res = await fetch(`${GATEWAY}/api/projects`, {
      signal: AbortSignal.timeout(2000)
    })
    if (!res.ok) return

    const { data: projects } = await res.json()

    // Find the section title and badge it
    const section = document.querySelector('#portfolio')
    if (!section) return

    const heading = section.querySelector('.section-title h2') ||
                    section.querySelector('h2')
    if (heading && !heading.querySelector('.api-badge')) {
      const badge = document.createElement('span')
      badge.className = 'api-badge'
      badge.textContent = '⚡ live from projects-service'
      badge.style.cssText = `
        font-size: 11px; background: #00ff8822; color: #00ff88;
        border: 1px solid #00ff8844; border-radius: 4px;
        padding: 2px 8px; margin-left: 10px; vertical-align: middle;
        font-family: monospace; font-weight: normal;
      `
      heading.appendChild(badge)
    }

    // Log the API response visually in the console with full detail
    console.group('%c projects-service response', 'color: #00ff88; font-weight: bold')
    console.log('%c GET http://localhost:3000/api/projects', 'color: #888')
    console.log('%c ↓ proxied to http://localhost:3001/projects', 'color: #555')
    console.table(projects.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      tags: p.tags.join(', ')
    })))
    console.groupEnd()

  } catch {
    // Service not running — page works as normal static HTML
  }
}

// ─── CONTACT FORM ────────────────────────────────────────────────────────────
// Intercepts the contact form submit and sends it to contact-service
// instead of the PHP file (which does nothing on GitHub Pages).

function wireContactForm() {
  const form = document.querySelector('.php-email-form')
  if (!form) return

  // Replace the static PHP action with a service indicator
  const indicator = document.createElement('div')
  indicator.style.cssText = `
    font-family: monospace; font-size: 11px; color: #888;
    margin-bottom: 8px; padding: 4px 8px;
    background: #f5f5f5; border-radius: 4px;
    border-left: 3px solid #00ff88;
  `
  indicator.textContent = '⚡ submits to contact-service :3002 via gateway :3000'
  form.insertBefore(indicator, form.firstChild)

  // Auto-save form fields to localStorage as user types
  form.addEventListener('input', (e) => {
    const field = e.target.name || e.target.id
    if (field) {
      localStorage.setItem(`form-${field}`, e.target.value)
    }
  })

  // Restore form data from localStorage on page load
  const nameEl = form.querySelector('#name')
  const emailEl = form.querySelector('#email')
  const subjectEl = form.querySelector('#subject')
  const messageEl = form.querySelector('[name="message"]')

  if (nameEl && localStorage.getItem('form-name')) nameEl.value = localStorage.getItem('form-name')
  if (emailEl && localStorage.getItem('form-email')) emailEl.value = localStorage.getItem('form-email')
  if (subjectEl && localStorage.getItem('form-subject')) subjectEl.value = localStorage.getItem('form-subject')
  if (messageEl && localStorage.getItem('form-message')) messageEl.value = localStorage.getItem('form-message')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()   // stop the old PHP form submit

    const nameEl    = form.querySelector('#name')
    const emailEl   = form.querySelector('#email')
    const subjectEl = form.querySelector('#subject')
    const messageEl = form.querySelector('[name="message"]')
    const btn       = form.querySelector('[type="submit"]')

    const payload = {
      name:    nameEl?.value    || '',
      email:   emailEl?.value   || '',
      subject: subjectEl?.value || '',
      message: messageEl?.value || '',
    }

    // Show loading state
    const originalText = btn.value
    btn.value = 'Sending...'
    btn.disabled = true

    console.group('%c contact-service request', 'color: #00ff88; font-weight: bold')
    console.log('%c POST http://localhost:3000/api/contact', 'color: #888')
    console.log('%c ↓ proxied to http://localhost:3002/contact', 'color: #555')
    console.log('payload:', payload)

    try {
      const res = await fetch(`${GATEWAY}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      })

      const data = await res.json()
      console.log('response:', data)
      console.groupEnd()

      if (res.ok) {
        showFormMessage(form, 'success', 'Message sent via contact-service ✓')
        form.reset()
        localStorage.removeItem('form-name')
        localStorage.removeItem('form-email')
        localStorage.removeItem('form-subject')
        localStorage.removeItem('form-message')
      } else {
        // Validation errors from contact-service
        const errors = data.errors?.join(' • ') || 'Something went wrong'
        showFormMessage(form, 'error', `contact-service validation: ${errors}`)
      }

    } catch {
      console.log('contact-service unreachable — falling back to static behavior')
      console.groupEnd()
      showFormMessage(form, 'error', 'contact-service not running. Start it with: node microservices/contact-service/src/index.js')
    } finally {
      btn.value = originalText
      btn.disabled = false
    }
  })
}

function showFormMessage(form, type, text) {
  // Remove any existing message
  form.querySelector('.service-msg')?.remove()

  const msg = document.createElement('div')
  msg.className = 'service-msg'
  msg.textContent = text
  msg.style.cssText = `
    padding: 10px 14px; margin-top: 10px; border-radius: 4px;
    font-family: monospace; font-size: 13px;
    background: ${type === 'success' ? '#00ff8822' : '#ff444422'};
    color:      ${type === 'success' ? '#00aa55'   : '#cc0000'};
    border: 1px solid ${type === 'success' ? '#00ff8844' : '#ff444444'};
  `
  form.appendChild(msg)
  setTimeout(() => msg.remove(), 5000)
}

// ─── INIT ────────────────────────────────────────────────────────────────────

export async function initServicesBridge() {
  const anyUp = await checkServices()
  if (!anyUp) return       // services not running — do nothing, page works normally

  await loadProjectsFromService()
  wireContactForm()
}
