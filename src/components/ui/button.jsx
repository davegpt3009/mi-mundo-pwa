import React from 'react'
import clsx from 'clsx'

const variants = {
  default: 'bg-mi-mundo-yellow text-mi-mundo-dark hover:bg-mi-mundo-yellow/90',
  ghost: 'bg-transparent hover:bg-mi-mundo-light/10',
}

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'default', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx('px-4 py-2 rounded transition-colors', variants[variant], className)}
      {...props}
    />
  )
})
