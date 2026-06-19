/**
 * DOM helper utilities shared across modules.
 */

/**
 * Easy selector helper.
 * @param {string} el - CSS selector
 * @param {boolean} all - return all matches as an array
 */
export const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

/**
 * Easy event listener helper.
 */
export const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all)
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener))
    } else {
      selectEl.addEventListener(type, listener)
    }
  }
}

/**
 * Easy scroll event listener helper.
 */
export const onscroll = (el, listener) => {
  el.addEventListener('scroll', listener)
}
