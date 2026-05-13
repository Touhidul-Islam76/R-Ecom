import Toastify, { type ToastifyOptions } from 'toastify-js'

type ToastType = 'success' | 'error' | 'info' | 'warning'
type ToastInputOptions = Omit<ToastifyOptions, 'text'>

const toastStyles: Record<ToastType, Record<string, string>> = {
  success: { background: 'linear-gradient(135deg, #1f8f4b, #2cbf6a)' },
  error: { background: 'linear-gradient(135deg, #b23b3b, #de5d5d)' },
  info: { background: 'linear-gradient(135deg, #2a6fba, #4f8fd7)' },
  warning: { background: 'linear-gradient(135deg, #b3872f, #d8a94d)' },
}

const baseOptions: ToastInputOptions = {
  duration: 3500,
  close: true,
  gravity: 'top',
  position: 'right',
  stopOnFocus: true,
}

export const useToast = () => {
  const show = (message: string, type: ToastType = 'info', options: ToastInputOptions = {}) => {
    if (process.server) return

    Toastify({
      ...baseOptions,
      ...options,
      text: message,
      style: {
        ...toastStyles[type],
        ...(options.style || {}),
      },
    }).showToast()
  }

  return {
    show,
    success: (message: string, options: ToastInputOptions = {}) => show(message, 'success', options),
    error: (message: string, options: ToastInputOptions = {}) => show(message, 'error', options),
    info: (message: string, options: ToastInputOptions = {}) => show(message, 'info', options),
    warning: (message: string, options: ToastInputOptions = {}) => show(message, 'warning', options),
  }
}
