import { useState, useEffect } from 'react'
import { useApp } from './AppContext'
import { useRobochito } from './useRobochito'
import LumenesCounter from './LumenesCounter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sun, Moon, Calendar, TrendingUp, CheckCircle, Star } from 'lucide-react'

const ElRefugio = () => {
  const { state } = useApp()
  const { fraseDelDia, formatearFrase } = useRobochito()
  const [saludo, setSaludo] = useState('')
  const [horaActual, setHoraActual] = useState(new Date())

  useEffect(() => {
    // Actualizar hora cada minuto
    const interval = setInterval(() => {
      setHoraActual(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Determinar saludo basado en la hora
    const hora = horaActual.getHours()
    let nuevoSaludo = ''
    
    if (hora >= 5 && hora < 12) {
      nuevoSaludo = '¡Buenos días!'
    } else if (hora >= 12 && hora < 18) {
      nuevoSaludo = '¡Buenas tardes!'
    } else {
      nuevoSaludo = '¡Buenas noches!'
    }
    
    setSaludo(`${nuevoSaludo}, ${state.configuracion.nombreUsuario}!`)
  }, [horaActual, state.configuracion.nombreUsuario])

  const obtenerIconoHora = () => {
    const hora = horaActual.getHours()
    return hora >= 6 && hora < 18 ? Sun : Moon
  }

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const tareasHoy = state.tareas.filter(tarea => {
    const fechaTarea = new Date(tarea.fechaCreacion)
    const hoy = new Date()
    return fechaTarea.toDateString() === hoy.toDateString()
  })

  const tareasCompletadasHoy = tareasHoy.filter(tarea => tarea.completada)

  const IconoHora = obtenerIconoHora()

  return (
    <div className="min-h-screen bg-gradient-to-br from-mi-mundo-light to-mi-mundo-green/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header con saludo y fecha */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <IconoHora className="text-mi-mundo-yellow" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-mi-mundo-dark">
              {saludo}
            </h1>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-mi-mundo-dark/70">
            <Calendar size={20} />
            <p className="text-lg capitalize">
              {formatearFecha(horaActual)}
            </p>
          </div>
        </div>

        {/* Contador de Lúmenes Principal */}
        <Card className="bg-white/80 backdrop-blur-sm border-mi-mundo-yellow/30 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-mi-mundo-dark">
                Tu Energía Actual
              </h2>
              <div className="flex justify-center">
                <LumenesCounter 
                  lumenes={state.lumenes} 
                  size="xl" 
                  showAnimation={true}
                />
              </div>
              <p className="text-mi-mundo-dark/60 max-w-md mx-auto">
                Los Lúmenes representan tu energía productiva. ¡Completa tareas para ganar más!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Frase de Robochito */}
        {fraseDelDia && (
          <Card className="bg-mi-mundo-yellow/20 border-mi-mundo-yellow shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-mi-mundo-dark">
                <div className="w-8 h-8 bg-mi-mundo-yellow rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">🤖</span>
                </div>
                <span>Mensaje de Robochito</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 rounded-lg p-4 font-mono text-mi-mundo-dark">
                {formatearFrase(fraseDelDia)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumen del día */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tareas de hoy */}
          <Card className="bg-white/80 backdrop-blur-sm border-mi-mundo-green/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-mi-mundo-dark">
                <CheckCircle className="text-mi-mundo-green" size={20} />
                <span>Tareas de Hoy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-mi-mundo-dark">
                  {tareasCompletadasHoy.length}/{tareasHoy.length}
                </div>
                <p className="text-mi-mundo-dark/60">
                  {tareasHoy.length === 0 
                    ? 'No hay tareas programadas'
                    : `${tareasCompletadasHoy.length} completadas de ${tareasHoy.length}`
                  }
                </p>
                {tareasHoy.length > 0 && (
                  <div className="w-full bg-mi-mundo-light rounded-full h-2">
                    <div 
                      className="bg-mi-mundo-green h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(tareasCompletadasHoy.length / tareasHoy.length) * 100}%` 
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lúmenes ganados hoy */}
          <Card className="bg-white/80 backdrop-blur-sm border-mi-mundo-yellow/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-mi-mundo-dark">
                <TrendingUp className="text-mi-mundo-yellow" size={20} />
                <span>Progreso Hoy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-mi-mundo-dark">
                  +{state.estadisticas.lumenesGanadosHoy}
                </div>
                <p className="text-mi-mundo-dark/60">
                  Lúmenes ganados hoy
                </p>
                <div className="flex items-center space-x-1">
                  <Star className="text-mi-mundo-yellow fill-current" size={16} />
                  <span className="text-sm text-mi-mundo-dark/60">
                    ¡Sigue así!
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Racha de días */}
          <Card className="bg-white/80 backdrop-blur-sm border-mi-mundo-dark/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-mi-mundo-dark">
                <Star className="text-mi-mundo-dark" size={20} />
                <span>Racha Actual</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-mi-mundo-dark">
                  {state.rachaActual}
                </div>
                <p className="text-mi-mundo-dark/60">
                  Días consecutivos
                </p>
                <p className="text-xs text-mi-mundo-dark/50">
                  Completa al menos una tarea diaria para mantener tu racha
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-mi-mundo-dark">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="bg-mi-mundo-green hover:bg-mi-mundo-green/90 text-mi-mundo-dark"
                size="lg"
              >
                Nueva Tarea
              </Button>
              <Button 
                variant="outline" 
                className="border-mi-mundo-yellow text-mi-mundo-dark hover:bg-mi-mundo-yellow/10"
                size="lg"
              >
                Ver Tareas
              </Button>
              <Button 
                variant="outline" 
                className="border-mi-mundo-dark text-mi-mundo-dark hover:bg-mi-mundo-dark/10"
                size="lg"
              >
                Recompensas
              </Button>
              <Button 
                variant="outline" 
                className="border-mi-mundo-green text-mi-mundo-dark hover:bg-mi-mundo-green/10"
                size="lg"
              >
                Estadísticas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ElRefugio

