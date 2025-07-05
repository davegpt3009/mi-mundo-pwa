import React from 'react'

export const Textarea = React.forwardRef(function Textarea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={`border rounded px-2 py-1 ${className}`} {...props} />
})
