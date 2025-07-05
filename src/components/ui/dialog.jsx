import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export const DialogContent = React.forwardRef(function DialogContent(
  { className = '', ...props },
  ref
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
      <DialogPrimitive.Content
        ref={ref}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow ${className}`}
        {...props}
      />
    </DialogPrimitive.Portal>
  )
})

export const DialogHeader = ({ className = '', ...props }) => (
  <div className={`mb-2 ${className}`} {...props} />
)

export const DialogTitle = ({ className = '', ...props }) => (
  <DialogPrimitive.Title className={`font-bold text-lg ${className}`} {...props} />
)
