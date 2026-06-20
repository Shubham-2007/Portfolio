/**
 * Entry point — initialises each feature module.
 * Loaded as an ES module (<script type="module">), so it runs after the
 * document is parsed and after the vendor library scripts have executed.
 */
import { initNav } from './modules/nav.js'
import { initHeader } from './modules/header.js'
import { initTyped } from './modules/hero.js'
import { initSliders } from './modules/sliders.js'
import { initPortfolio } from './modules/portfolio.js'
import { initServicesBridge } from './modules/services-bridge.js'

initNav()
initHeader()
initTyped()
initSliders()
initPortfolio()
initServicesBridge()  // connects to microservices when running locally
