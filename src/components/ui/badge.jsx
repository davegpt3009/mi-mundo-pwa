import React from 'react'

export const Badge = React.forwardRef(function Badge({ className = '', ...props }, ref) {
  return <span ref={ref} className={`px-2 py-1 rounded text-sm ${className}`} {...props} />
})
