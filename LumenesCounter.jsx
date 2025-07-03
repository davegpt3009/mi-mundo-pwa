import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'

const LumenesCounter = ({ lumenes, showAnimation = false, size = 'default' }) => {
  const [displayLumenes, setDisplayLumenes] = useState(lumenes)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (showAnimation && lumenes !== displayLumenes) {
      setIsAnimating(true)
      
      // Animación de conteo
      const difference = lumenes - displayLumenes
      const steps = Math.min(Math.abs(difference), 20)
      const stepValue = difference / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setDisplayLumenes(prev => Math.round(prev + stepValue))
        } else {
          setDisplayLumenes(lumenes)
          setIsAnimating(false)
          clearInterval(interval)
        }
      }, 50)

      return () => clearInterval(interval)
    } else {
      setDisplayLumenes(lumenes)
    }
  }, [lumenes, showAnimation])

  const sizeClasses = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-2xl',
    xl: 'text-4xl'
  }

  const iconSizes = {
    small: 16,
    default: 20,
    large: 24,
    xl: 32
  }

  return (
    <div className={`flex items-center space-x-2 ${isAnimating ? 'animate-pulse' : ''}`}>
      <div className={`flex items-center justify-center w-8 h-8 bg-mi-mundo-yellow rounded-full ${isAnimating ? 'animate-bounce' : ''}`}>
        <Zap 
          size={iconSizes[size]} 
          className="text-mi-mundo-dark fill-current" 
        />
      </div>
      <span className={`font-bold text-mi-mundo-dark font-mono ${sizeClasses[size]} ${isAnimating ? 'text-mi-mundo-yellow' : ''}`}>
        {displayLumenes.toLocaleString()}
      </span>
      <span className={`text-mi-mundo-dark/70 ${sizeClasses[size]}`}>
        Lúmenes
      </span>
    </div>
  )
}

export default LumenesCounter

