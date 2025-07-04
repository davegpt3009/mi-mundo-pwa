import { useState, useEffect } from 'react'
import { useRobochito } from './useRobochito'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Shuffle, X, Heart } from 'lucide-react'
import robochitoSprite from './robochito-sprite_5.png'

const Robochito = ({ 
  showFloating = true, 
  showInline = false, 
  size = 'default',
  autoShow = false 
}) => {
  const { fraseDelDia, obtenerFraseAleatoria, formatearFrase } = useRobochito()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fraseActual, setFraseActual] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const sizes = {
    small: 'w-12 h-12',
    default: 'w-16 h-16',
    large: 'w-24 h-24'
  }

  useEffect(() => {
    if (fraseDelDia) {
      setFraseActual(fraseDelDia)
    }
  }, [fraseDelDia])

  useEffect(() => {
    if (autoShow && fraseDelDia) {
      const timer = setTimeout(() => {
        setIsModalOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [autoShow, fraseDelDia])

  const handleNuevaFrase = () => {
    setIsAnimating(true)
    const nuevaFrase = obtenerFraseAleatoria()
    setTimeout(() => {
      setFraseActual(nuevaFrase)
      setIsAnimating(false)
    }, 300)
  }

  const handleFrasePorCategoria = (categoria) => {
    setIsAnimating(true)
    const nuevaFrase = obtenerFraseAleatoria(categoria)
    setTimeout(() => {
      setFraseActual(nuevaFrase)
      setIsAnimating(false)
    }, 300)
  }

  const RobochitoSprite = ({ className = '', onClick = null, animated = false }) => (
    <div 
      className={`${sizes[size]} ${className} ${animated ? 'animate-bounce' : ''} ${onClick ? 'cursor-pointer hover:scale-110' : ''} transition-transform duration-200`}
      onClick={onClick}
    >
      <img 
        src={robochitoSprite} 
        alt="Robochito" 
        className="w-full h-full object-contain pixelated"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )

  const ModalContent = () => (
    <DialogContent className="bg-mi-mundo-light border-mi-mundo-yellow max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-3 text-mi-mundo-dark">
          <RobochitoSprite size="small" animated={isAnimating} />
          <span>Mensaje de Robochito</span>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        {/* Frase actual */}
        <Card className="bg-mi-mundo-yellow/20 border-mi-mundo-yellow">
          <CardContent className="p-4">
            <div className={`font-mono text-mi-mundo-dark transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
              {fraseActual ? formatearFrase(fraseActual) : 'Cargando mensaje...'}
            </div>
            {fraseActual && (
              <div className="mt-3 flex items-center justify-between">
                <Badge className="bg-mi-mundo-green text-mi-mundo-dark">
                  {fraseActual.categoria}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-mi-mundo-dark/60">
                  <Heart size={12} className="text-red-500 fill-current" />
                  <span>Robochito</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controles */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Button
              onClick={handleNuevaFrase}
              disabled={isAnimating}
              className="flex-1 bg-mi-mundo-green hover:bg-mi-mundo-green/90 text-mi-mundo-dark"
              size="sm"
            >
              <Shuffle size={16} className="mr-2" />
              Nueva Frase
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => handleFrasePorCategoria('motivacion')}
              disabled={isAnimating}
              variant="outline"
              className="border-mi-mundo-yellow text-mi-mundo-dark hover:bg-mi-mundo-yellow/10"
              size="sm"
            >
              💪 Motivación
            </Button>
            <Button
              onClick={() => handleFrasePorCategoria('productividad')}
              disabled={isAnimating}
              variant="outline"
              className="border-mi-mundo-green text-mi-mundo-dark hover:bg-mi-mundo-green/10"
              size="sm"
            >
              🎯 Productividad
            </Button>
            <Button
              onClick={() => handleFrasePorCategoria('bienestar')}
              disabled={isAnimating}
              variant="outline"
              className="border-mi-mundo-dark text-mi-mundo-dark hover:bg-mi-mundo-dark/10"
              size="sm"
            >
              🌱 Bienestar
            </Button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-center text-xs text-mi-mundo-dark/60 border-t border-mi-mundo-dark/10 pt-3">
          <p>Robochito está aquí para motivarte en tu journey productivo</p>
          <p className="mt-1">¡Cada día trae un nuevo mensaje especial!</p>
        </div>
      </div>
    </DialogContent>
  )

  // Componente flotante
  if (showFloating) {
    return (
      <>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <div className="fixed bottom-6 right-6 z-50">
              <div className="relative">
                <RobochitoSprite 
                  className="bg-white rounded-full p-2 shadow-lg border-2 border-mi-mundo-yellow hover:shadow-xl"
                  onClick={() => setIsModalOpen(true)}
                  animated={false}
                />
                
                {/* Indicador de mensaje nuevo */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <MessageCircle size={10} className="text-white" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-mi-mundo-dark text-mi-mundo-light text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  ¡Haz clic para ver mi mensaje!
                </div>
              </div>
            </div>
          </DialogTrigger>
          <ModalContent />
        </Dialog>
      </>
    )
  }

  // Componente inline
  if (showInline) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 hover:bg-mi-mundo-yellow/10"
            onClick={() => setIsModalOpen(true)}
          >
            <RobochitoSprite />
            <span className="text-mi-mundo-dark">Hablar con Robochito</span>
          </Button>
        </DialogTrigger>
        <ModalContent />
      </Dialog>
    )
  }

  // Solo el sprite
  return <RobochitoSprite />
}

export default Robochito

