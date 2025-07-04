import { useState } from 'react'
import { useApp } from './AppContext'
import LumenesCounter from './LumenesCounter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Gift, 
  Plus, 
  Zap, 
  Coffee, 
  Gamepad2, 
  Music, 
  ShoppingBag,
  Star,
  Check,
  X
} from 'lucide-react'

const LaBoveda = () => {
  const { state, actions } = useApp()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevaRecompensa, setNuevaRecompensa] = useState({
    titulo: '',
    descripcion: '',
    costo: 50,
    categoria: 'personal',
    icono: 'Gift'
  })

  const iconos = {
    Gift: Gift,
    Coffee: Coffee,
    Gamepad2: Gamepad2,
    Music: Music,
    ShoppingBag: ShoppingBag,
    Star: Star
  }

  const categorias = {
    personal: { label: 'Personal', color: 'bg-mi-mundo-green' },
    entretenimiento: { label: 'Entretenimiento', color: 'bg-mi-mundo-yellow' },
    compras: { label: 'Compras', color: 'bg-purple-500' },
    experiencias: { label: 'Experiencias', color: 'bg-blue-500' }
  }

  const recompensasPredefinidas = [
    {
      id: 'coffee-break',
      titulo: '☕ Pausa para Café',
      descripcion: 'Disfruta de 15 minutos de descanso con tu bebida favorita',
      costo: 25,
      categoria: 'personal',
      icono: 'Coffee',
      predefinida: true
    },
    {
      id: 'gaming-time',
      titulo: '🎮 Tiempo de Juego',
      descripcion: '30 minutos de videojuegos sin culpa',
      costo: 50,
      categoria: 'entretenimiento',
      icono: 'Gamepad2',
      predefinida: true
    },
    {
      id: 'music-session',
      titulo: '🎵 Sesión Musical',
      descripcion: 'Escucha tu álbum favorito completo',
      costo: 30,
      categoria: 'entretenimiento',
      icono: 'Music',
      predefinida: true
    },
    {
      id: 'treat-yourself',
      titulo: '🛍️ Pequeño Capricho',
      descripcion: 'Compra algo pequeño que te haga feliz',
      costo: 100,
      categoria: 'compras',
      icono: 'ShoppingBag',
      predefinida: true
    },
    {
      id: 'movie-night',
      titulo: '🎬 Noche de Película',
      descripcion: 'Una película completa con snacks incluidos',
      costo: 75,
      categoria: 'entretenimiento',
      icono: 'Star',
      predefinida: true
    },
    {
      id: 'special-meal',
      titulo: '🍽️ Comida Especial',
      descripcion: 'Ordena tu comida favorita o cocina algo especial',
      costo: 150,
      categoria: 'experiencias',
      icono: 'Gift',
      predefinida: true
    }
  ]

  const todasLasRecompensas = [
    ...recompensasPredefinidas.filter(r => !state.recompensas.some(sr => sr.id === r.id)),
    ...state.recompensas
  ]

  const recompensasDisponibles = todasLasRecompensas.filter(r => !r.canjeada)
  const recompensasCanjeadas = todasLasRecompensas.filter(r => r.canjeada)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nuevaRecompensa.titulo.trim()) return

    actions.addRecompensa(nuevaRecompensa)
    setNuevaRecompensa({
      titulo: '',
      descripcion: '',
      costo: 50,
      categoria: 'personal',
      icono: 'Gift'
    })
    setMostrarFormulario(false)
  }

  const handleCanjear = (recompensa) => {
    if (state.lumenes >= recompensa.costo) {
      if (recompensa.predefinida) {
        // Para recompensas predefinidas, las agregamos al estado como canjeadas
        const recompensaCanjeada = {
          ...recompensa,
          id: Date.now(),
          predefinida: false
        }
        actions.addRecompensa(recompensaCanjeada)
        actions.canjearRecompensa(recompensaCanjeada.id)
      } else {
        actions.canjearRecompensa(recompensa.id)
      }
    }
  }

  const puedePermitirse = (costo) => state.lumenes >= costo

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mi-mundo-light to-purple-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Gift className="text-mi-mundo-dark" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-mi-mundo-dark">
              La Bóveda
            </h1>
          </div>
          <p className="text-lg text-mi-mundo-dark/70">
            Canjea tus Lúmenes por recompensas que te motiven
          </p>
        </div>

        {/* Contador de Lúmenes */}
        <Card className="bg-white/80 backdrop-blur-sm border-mi-mundo-yellow/30">
          <CardContent className="p-6">
            <div className="flex justify-center">
              <LumenesCounter 
                lumenes={state.lumenes} 
                size="large" 
                showAnimation={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botón para nueva recompensa */}
        {!mostrarFormulario && (
          <div className="text-center">
            <Button
              onClick={() => setMostrarFormulario(true)}
              className="bg-mi-mundo-yellow hover:bg-mi-mundo-yellow/90 text-mi-mundo-dark"
              size="lg"
            >
              <Plus size={20} className="mr-2" />
              Crear Recompensa Personalizada
            </Button>
          </div>
        )}

        {/* Formulario de nueva recompensa */}
        {mostrarFormulario && (
          <Card className="bg-white/90 backdrop-blur-sm border-mi-mundo-yellow">
            <CardHeader>
              <CardTitle className="text-mi-mundo-dark">Nueva Recompensa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Título de la recompensa"
                    value={nuevaRecompensa.titulo}
                    onChange={(e) => setNuevaRecompensa({...nuevaRecompensa, titulo: e.target.value})}
                    className="border-mi-mundo-dark/20 focus:border-mi-mundo-yellow"
                    required
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder="Descripción de la recompensa"
                    value={nuevaRecompensa.descripcion}
                    onChange={(e) => setNuevaRecompensa({...nuevaRecompensa, descripcion: e.target.value})}
                    className="border-mi-mundo-dark/20 focus:border-mi-mundo-yellow"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mi-mundo-dark mb-2">
                      Costo en Lúmenes
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={nuevaRecompensa.costo}
                      onChange={(e) => setNuevaRecompensa({...nuevaRecompensa, costo: parseInt(e.target.value)})}
                      className="border-mi-mundo-dark/20 focus:border-mi-mundo-yellow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mi-mundo-dark mb-2">
                      Categoría
                    </label>
                    <select
                      value={nuevaRecompensa.categoria}
                      onChange={(e) => setNuevaRecompensa({...nuevaRecompensa, categoria: e.target.value})}
                      className="w-full p-2 border border-mi-mundo-dark/20 rounded-md focus:border-mi-mundo-yellow focus:outline-none"
                    >
                      {Object.entries(categorias).map(([key, categoria]) => (
                        <option key={key} value={key}>{categoria.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="bg-mi-mundo-yellow hover:bg-mi-mundo-yellow/90 text-mi-mundo-dark"
                  >
                    Crear Recompensa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMostrarFormulario(false)}
                    className="border-mi-mundo-dark/20 text-mi-mundo-dark hover:bg-mi-mundo-light"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Galería de recompensas disponibles */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-mi-mundo-dark">Recompensas Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recompensasDisponibles.map((recompensa) => {
                const IconoRecompensa = iconos[recompensa.icono] || Gift
                const puedeComprar = puedePermitirse(recompensa.costo)
                
                return (
                  <div
                    key={recompensa.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      puedeComprar 
                        ? 'border-mi-mundo-green bg-white hover:shadow-lg hover:scale-105' 
                        : 'border-gray-300 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="text-center space-y-3">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                        puedeComprar ? 'bg-mi-mundo-yellow' : 'bg-gray-300'
                      }`}>
                        <IconoRecompensa 
                          size={24} 
                          className={puedeComprar ? 'text-mi-mundo-dark' : 'text-gray-500'} 
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-mi-mundo-dark">
                          {recompensa.titulo}
                        </h3>
                        <p className="text-sm text-mi-mundo-dark/60 mt-1">
                          {recompensa.descripcion}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Badge className={categorias[recompensa.categoria].color}>
                          {categorias[recompensa.categoria].label}
                        </Badge>
                        
                        <div className="flex items-center justify-center space-x-1">
                          <Zap size={16} className="text-mi-mundo-yellow fill-current" />
                          <span className="font-bold text-mi-mundo-dark">
                            {recompensa.costo}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleCanjear(recompensa)}
                        disabled={!puedeComprar}
                        className={`w-full ${
                          puedeComprar
                            ? 'bg-mi-mundo-green hover:bg-mi-mundo-green/90 text-mi-mundo-dark'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {puedeComprar ? 'Canjear' : 'Insuficientes Lúmenes'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {recompensasDisponibles.length === 0 && (
              <div className="text-center py-8">
                <Gift className="mx-auto text-mi-mundo-dark/30 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-mi-mundo-dark mb-2">
                  ¡Crea tu primera recompensa!
                </h3>
                <p className="text-mi-mundo-dark/60">
                  Define qué te motiva y establece el costo en Lúmenes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historial de recompensas canjeadas */}
        {recompensasCanjeadas.length > 0 && (
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-mi-mundo-dark/70">Recompensas Canjeadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recompensasCanjeadas.slice(0, 5).map((recompensa) => {
                  const IconoRecompensa = iconos[recompensa.icono] || Gift
                  
                  return (
                    <div
                      key={recompensa.id}
                      className="flex items-center space-x-3 p-3 bg-mi-mundo-green/10 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-mi-mundo-green/20 rounded-full flex items-center justify-center">
                        <IconoRecompensa size={16} className="text-mi-mundo-green" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-mi-mundo-dark/70">
                          {recompensa.titulo}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-mi-mundo-dark/50">
                            <Zap size={12} className="text-mi-mundo-yellow fill-current" />
                            <span>-{recompensa.costo}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-mi-mundo-dark/50">
                            <Check size={12} className="text-mi-mundo-green" />
                            <span>{formatearFecha(recompensa.fechaCanje)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {recompensasCanjeadas.length > 5 && (
                  <p className="text-center text-sm text-mi-mundo-dark/60 pt-2">
                    Y {recompensasCanjeadas.length - 5} recompensas más canjeadas...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default LaBoveda

