declare module 'toastify-js' {
  export type ToastifyGravity = 'top' | 'bottom'
  export type ToastifyPosition = 'left' | 'center' | 'right'

  export interface ToastifyOptions {
    text?: string
    node?: Node
    duration?: number
    close?: boolean
    gravity?: ToastifyGravity
    position?: ToastifyPosition
    stopOnFocus?: boolean
    className?: string
    style?: Record<string, string>
    offset?: {
      x?: number | string
      y?: number | string
    }
    destination?: string
    newWindow?: boolean
    avatar?: string
    oldestFirst?: boolean
    onClick?: () => void
    callback?: () => void
    escapeMarkup?: boolean
    ariaLive?: 'off' | 'polite' | 'assertive'
  }

  export interface ToastifyInstance {
    showToast: () => void
    hideToast: () => void
  }

  export default function Toastify(options: ToastifyOptions): ToastifyInstance
}
