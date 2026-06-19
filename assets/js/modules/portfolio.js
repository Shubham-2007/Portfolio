/**
 * Portfolio: Isotope grid filtering and GLightbox image previews
 * (both rely on globals loaded via vendor scripts).
 */
import { select, on } from './helpers.js'

export function initPortfolio() {
  /* Isotope layout and filter buttons */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container')
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      })

      let portfolioFilters = select('#portfolio-flters li', true)

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault()
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active')
        })
        this.classList.add('filter-active')

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        })
      }, true)
    }
  })

  /* Image lightbox */
  GLightbox({
    selector: '.portfolio-lightbox'
  })
}
