export default defineNuxtPlugin(() => {
  const runLoader = () => {
    const loadingArea = document.getElementById('loading-area')
    if (!loadingArea) return

    // Show text (CSS: opacity 0 → 1, translateY -30 → 0)
    setTimeout(() => {
      loadingArea.classList.add('show')
    }, 500)

    // Slide panels away (CSS: height 100% → 0 on :before/:after) + hide text
    setTimeout(() => {
      loadingArea.classList.add('active')
    }, 1500)

    // Hide entire loader after CSS transition finishes (1.5s transition)
    setTimeout(() => {
      loadingArea.style.display = 'none'
    }, 3200)
  }

  // document.readyState may already be 'complete' in Nuxt hydration
  if (document.readyState === 'complete') {
    runLoader()
  } else {
    window.addEventListener('load', runLoader, { once: true })
  }
})
