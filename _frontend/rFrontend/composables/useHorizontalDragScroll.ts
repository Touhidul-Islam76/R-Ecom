import { onUnmounted } from 'vue'

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [contenteditable="true"]'

const canUseDesktopDrag = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(min-width: 992px) and (pointer: fine)').matches
}

export const useHorizontalDragScroll = () => {
  const cleanups: Array<() => void> = []

  const enableOnElement = (element: HTMLElement | null) => {
    if (!element || !canUseDesktopDrag()) return

    let isDragging = false
    let startX = 0
    let startScrollLeft = 0
    let moved = false

    const stopDragging = () => {
      if (!isDragging) return
      isDragging = false
      element.classList.remove('is-dragging')
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return

      const target = event.target as HTMLElement | null
      if (target?.closest(INTERACTIVE_SELECTOR)) return

      isDragging = true
      moved = false
      startX = event.pageX - element.offsetLeft
      startScrollLeft = element.scrollLeft
      element.classList.add('is-dragging')
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return
      event.preventDefault()

      const x = event.pageX - element.offsetLeft
      const walk = x - startX
      if (Math.abs(walk) > 3) moved = true
      element.scrollLeft = startScrollLeft - walk
    }

    const handleClickCapture = (event: MouseEvent) => {
      if (!moved) return

      const target = event.target as HTMLElement | null
      if (target?.closest('a, button')) {
        event.preventDefault()
        event.stopPropagation()
      }
      moved = false
    }

    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', stopDragging)
    element.addEventListener('mouseup', stopDragging)
    element.addEventListener('click', handleClickCapture, true)

    cleanups.push(() => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', stopDragging)
      element.removeEventListener('mouseup', stopDragging)
      element.removeEventListener('click', handleClickCapture, true)
      element.classList.remove('is-dragging')
    })
  }

  onUnmounted(() => {
    cleanups.forEach((cleanup) => cleanup())
    cleanups.length = 0
  })

  return {
    enableOnElement,
  }
}
