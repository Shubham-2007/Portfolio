/**
 * Hero typing effect (uses the global Typed library loaded via vendor script).
 */
import { select } from './helpers.js'

export function initTyped() {
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    })
  }
}
