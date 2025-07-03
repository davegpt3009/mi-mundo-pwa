import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Clock, 
  Zap,
  Target,
  Calendar
} from 'lucide-react'

const ElTaller = () => {
  const { state, actions } = useApp()
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    lumenesRecompensa: 10
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [tareaEditando, setTareaEditando] = useState(null)

  const prioridades = {
    baja: { color: 'bg-mi-mundo-green', label: 'Baja', lumenes: 5 },
    media: { color: 'bg-mi-mundo-yellow', label: 'Media', lumenes: 10 },
    alta: { color: 'bg-red-500', label: 'Alta', lumenes: 20 }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nuevaTarea.titulo.trim()) return

    const tarea = {
      ...nuevaTarea,
      lumenesRecompensa: prioridades[nuevaTarea.prioridad].lumenes
    }

    if (tareaEditando) {
      actions.updateTarea(tareaEditando.id, tarea)
      setTareaEditando(null)
    } else {
      actions.addTarea(tarea)
    }

    setNuevaTarea({
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      lumenesRecompensa: 10
    })
    setMostrarFormulario(false)
  }

  const handleCompletarTarea = (tarea) => {
    actions.completeTarea(tarea.id, tarea.lumenesRecompensa)
  }

  const handleEditarTarea = (tarea) => {
    setNuevaTarea({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      lumenesRecompensa: tarea.lumenesRecompensa
    })
    setTareaEditando(tarea)
    setMostrarFormulario(true)
  }

  const cancelarEdicion = () => {
    setTareaEditando(null)
    setNuevaTarea({
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      lumenesRecompensa: 10
    })
    setMostrarFormulario(false)
  }

  const tareasPendientes = state.tareas.filter(tarea => !tarea.completada)
  const tareasCompletadas = state.tareas.filter(tarea => tarea.completada)

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
    <div className="min-h-screen bg-gradient-to-br from-mi-mundo-light to-mi-mundo-yellow/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Target className="text-mi-mundo-dark" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-mi-mundo-dark">
              El Taller
            </h1>
          </div>
          <p className="text-lg text-mi-mundo-dark/70">
            Gestiona tus tareas y gana Lúmenes por cada logro
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Circle className="text-mi-mundo-yellow" size={24} />
                <div>
                  <div className="text-2xl font-bold text-mi-mundo-dark">
                    {tareasPendientes.length}
                  </div>
                  <div className="text-sm text-mi-mundo-dark/60">
                    Tareas pendientes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="text-mi-mundo-green" size={24} />
                <div>
                  <div className="text-2xl font-bold text-mi-mundo-dark">
                    {tareasCompletadas.length}
                  </div>
                  <div className="text-sm text-mi-mundo-dark/60">
                    Tareas completadas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Zap className="text-mi-mundo-yellow fill-current" size={24} />
                <div>
                  <div className="text-2xl font-bold text-mi-mundo-dark">
                    {tareasPendientes.reduce((total, tarea) => total + tarea.lumenesRecompensa, 0)}
                  </div>
                  <div className="text-sm text-mi-mundo-dark/60">
                    Lúmenes disponibles
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón para nueva tarea */}
        {!mostrarFormulario && (
          <div className="text-center">
            <Button
              onClick={() => setMostrarFormulario(true)}
              className="bg-mi-mundo-green hover:bg-mi-mundo-green/90 text-mi-mundo-dark"
              size="lg"
            >
              <Plus size={20} className="mr-2" />
              Nueva Tarea
            </Button>
          </div>
        )}

        {/* Formulario de nueva tarea */}
        {mostrarFormulario && (
          <Card className="bg-white/90 backdrop-blur-sm border-mi-mundo-green">
            <CardHeader>
              <CardTitle className="text-mi-mundo-dark">
                {tareaEditando ? 'Editar Tarea' : 'Nueva Tarea'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Título de la tarea"
                    value={nuevaTarea.titulo}
                    onChange={(e) => setNuevaTarea({...nuevaTarea, titulo: e.target.value})}
                    className="border-mi-mundo-dark/20 focus:border-mi-mundo-green"
                    required
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder="Descripción (opcional)"
                    value={nuevaTarea.descripcion}
                    onChange={(e) => setNuevaTarea({...nuevaTarea, descripcion: e.target.value})}
                    className="border-mi-mundo-dark/20 focus:border-mi-mundo-green"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mi-mundo-dark mb-2">
                    Prioridad
                  </label>
                  <div className="flex space-x-2">
                    {Object.entries(prioridades).map(([key, prioridad]) => (
                      <Button
                        key={key}
                        type="button"
                        variant={nuevaTarea.prioridad === key ? "default" : "outline"}
                        className={`${
                          nuevaTarea.prioridad === key 
                            ? `${prioridad.color} text-white` 
                            : 'border-mi-mundo-dark/20 text-mi-mundo-dark hover:bg-mi-mundo-light'
                        }`}
                        onClick={() => setNuevaTarea({...nuevaTarea, prioridad: key})}
                      >
                        {prioridad.label} (+{prioridad.lumenes} ⚡)
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="bg-mi-mundo-green hover:bg-mi-mundo-green/90 text-mi-mundo-dark"
                  >
                    {tareaEditando ? 'Actualizar' : 'Crear'} Tarea
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelarEdicion}
                    className="border-mi-mundo-dark/20 text-mi-mundo-dark hover:bg-mi-mundo-light"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de tareas pendientes */}
        {tareasPendientes.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-mi-mundo-dark">Tareas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tareasPendientes.map((tarea) => (
                  <div
                    key={tarea.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-mi-mundo-dark/10 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompletarTarea(tarea)}
                        className="text-mi-mundo-green hover:bg-mi-mundo-green/10 p-1"
                      >
                        <Circle size={20} />
                      </Button>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-mi-mundo-dark">{tarea.titulo}</h3>
                        {tarea.descripcion && (
                          <p className="text-sm text-mi-mundo-dark/60 mt-1">
                            {tarea.descripcion}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={`${prioridades[tarea.prioridad].color} text-white`}>
                            {prioridades[tarea.prioridad].label}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-mi-mundo-dark/60">
                            <Zap size={12} className="text-mi-mundo-yellow fill-current" />
                            <span>+{tarea.lumenesRecompensa}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-mi-mundo-dark/60">
                            <Calendar size={12} />
                            <span>{formatearFecha(tarea.fechaCreacion)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarTarea(tarea)}
                        className="text-mi-mundo-dark hover:bg-mi-mundo-yellow/10 p-2"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => actions.deleteTarea(tarea.id)}
                        className="text-red-500 hover:bg-red-50 p-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de tareas completadas */}
        {tareasCompletadas.length > 0 && (
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-mi-mundo-dark/70">Tareas Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tareasCompletadas.slice(0, 5).map((tarea) => (
                  <div
                    key={tarea.id}
                    className="flex items-center space-x-3 p-3 bg-mi-mundo-green/10 rounded-lg"
                  >
                    <CheckCircle2 className="text-mi-mundo-green" size={20} />
                    <div className="flex-1">
                      <h3 className="font-medium text-mi-mundo-dark/70 line-through">
                        {tarea.titulo}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-mi-mundo-dark/50">
                          <Zap size={12} className="text-mi-mundo-yellow fill-current" />
                          <span>+{tarea.lumenesRecompensa}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-mi-mundo-dark/50">
                          <Clock size={12} />
                          <span>{formatearFecha(tarea.fechaCompletada)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {tareasCompletadas.length > 5 && (
                  <p className="text-center text-sm text-mi-mundo-dark/60 pt-2">
                    Y {tareasCompletadas.length - 5} tareas más completadas...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado vacío */}
        {state.tareas.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Target className="mx-auto text-mi-mundo-dark/30 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-mi-mundo-dark mb-2">
                ¡Comienza tu productividad!
              </h3>
              <p className="text-mi-mundo-dark/60 mb-4">
                Crea tu primera tarea y comienza a ganar Lúmenes
              </p>
              <Button
                onClick={() => setMostrarFormulario(true)}
                className="bg-mi-mundo-green hover:bg-mi-mundo-green/90 text-mi-mundo-dark"
              >
                <Plus size={20} className="mr-2" />
                Crear Primera Tarea
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ElTaller

