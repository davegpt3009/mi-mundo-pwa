import React from 'react'

export const Card = React.forwardRef(function Card({ className = '', ...props }, ref) {
  return <div ref={ref} className={`rounded-lg shadow ${className}`} {...props} />
})

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`border-b p-2 ${className}`} {...props} />
)

export const CardTitle = ({ className = '', ...props }) => (
  <h3 className={`font-bold text-lg ${className}`} {...props} />
)

export const CardContent = ({ className = '', ...props }) => (
  <div className={`p-2 ${className}`} {...props} />
)
