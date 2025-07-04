import { useState, useMemo } from 'react'
import { useApp } from './AppContext.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Zap, 
  Target, 
  Award,
  Clock,
  CheckCircle2
} from 'lucide-react'

const ElArchivo = () => {
  const { state } = useApp()
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('semana')

  const periodos = {
    semana: { label: 'Esta Semana', dias: 7 },
    mes: { label: 'Este Mes', dias: 30 },
    trimestre: { label: 'Último Trimestre', dias: 90 }
  }

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const ahora = new Date()
    const diasAtras = periodos[periodoSeleccionado].dias
    const fechaInicio = new Date(ahora.getTime() - (diasAtras * 24 * 60 * 60 * 1000))

    const tareasEnPeriodo = state.tareas.filter(tarea => {
      const fechaTarea = new Date(tarea.fechaCreacion)
      return fechaTarea >= fechaInicio
    })

    const tareasCompletadasEnPeriodo = tareasEnPeriodo.filter(tarea => tarea.completada)
    const lumenesGanados = tareasCompletadasEnPeriodo.reduce((total, tarea) => total + tarea.lumenesRecompensa, 0)
    const lumenesGastados = state.recompensas
      .filter(r => r.canjeada && new Date(r.fechaCanje) >= fechaInicio)
      .reduce((total, r) => total + r.costo, 0)

    return {
      tareasCreadas: tareasEnPeriodo.length,
      tareasCompletadas: tareasCompletadasEnPeriodo.length,
      tasaCompletacion: tareasEnPeriodo.length > 0 ? (tareasCompletadasEnPeriodo.length / tareasEnPeriodo.length) * 100 : 0,
      lumenesGanados,
      lumenesGastados,
      balanceLumenes: lumenesGanados - lumenesGastados,
      promedioTareasPorDia: tareasCompletadasEnPeriodo.length / diasAtras
    }
  }, [state.tareas, state.recompensas, periodoSeleccionado])

  // Datos para gráficos
  const datosBarras = useMemo(() => {
    const datos = []
    const diasAtras = periodos[periodoSeleccionado].dias
    
    for (let i = diasAtras - 1; i >= 0; i--) {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - i)
      const fechaStr = fecha.toISOString().split('T')[0]
      
      const tareasDelDia = state.tareas.filter(tarea => {
        const fechaTarea = new Date(tarea.fechaCreacion).toISOString().split('T')[0]
        return fechaTarea === fechaStr && tarea.completada
      })

      const lumenesDelDia = tareasDelDia.reduce((total, tarea) => total + tarea.lumenesRecompensa, 0)

      datos.push({
        fecha: fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        tareas: tareasDelDia.length,
        lumenes: lumenesDelDia
      })
    }
    
    return datos
  }, [state.tareas, periodoSeleccionado])

  const datosPrioridades = useMemo(() => {
    const prioridades = { baja: 0, media: 0, alta: 0 }
    
    state.tareas
      .filter(tarea => tarea.completada)
      .forEach(tarea => {
        prioridades[tarea.prioridad]++
      })

    return [
      { name: 'Baja', value: prioridades.baja, color: '#A4E8AF' },
      { name: 'Media', value: prioridades.media, color: '#FFC700' },
      { name: 'Alta', value: prioridades.alta, color: '#ef4444' }
    ]
  }, [state.tareas])

  const coloresPie = ['#A4E8AF', '#FFC700', '#ef4444']

  return (
    <div className="min-h-screen bg-gradient-to-br from-mi-mundo-light to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BarChart3 className="text-mi-mundo-dark" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-mi-mundo-dark">
              El Archivo
            </h1>
          </div>
          <p className="text-lg text-mi-mundo-dark/70">
            Analiza tu progreso y celebra tus logros
          </p>
        </div>

        {/* Selector de período */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex justify-center space-x-2">
              {Object.entries(periodos).map(([key, periodo]) => (
                <Button
                  key={key}
                  variant={periodoSeleccionado === key ? "default" : "outline"}
                  className={`${
                    periodoSeleccionado === key 
                      ? 'bg-mi-mundo-dark text-mi-mundo-light' 
                      : 'border-mi-mundo-dark/20 text-mi-mundo-dark hover:bg-mi-mundo-light'
                  }`}
                  onClick={() => setPeriodoSeleccionado(key)}
                >
                  {periodo.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-mi-mundo-green/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-mi-mundo-green" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-mi-mundo-dark">
                    {estadisticas.tareasCompletadas}
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
                <div className="w-10 h-10 bg-mi-mundo-yellow/20 rounded-lg flex items-center justify-center">
                  <Zap className="text-mi-mundo-yellow fill-current" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-mi-mundo-dark">
                    {estadisticas.lumenesGanados}
                  </div>
                  <div className="text-sm text-mi-mundo-dark/60">
                    Lúmenes ganados
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-mi-mundo-dark">
                    {estadisticas.tasaCompletacion.toFixed(1)}%
                  </div>
                  <div className="text-sm text-mi-mundo-dark/60">
                    Tasa de completación
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="text-purple-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-mi-mundo-dark">
                    {estadisticas.promedioTareasPorDia.toFixed(1)}
                  </div>
                  <div className="text-sm text-mi-mundo-dark/60">
                    Tareas por día
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de barras - Actividad diaria */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-mi-mundo-dark">Actividad Diaria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosBarras}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#12182B20" />
                  <XAxis 
                    dataKey="fecha" 
                    stroke="#12182B" 
                    fontSize={12}
                  />
                  <YAxis stroke="#12182B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#F0EBE3', 
                      border: '1px solid #12182B',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="tareas" 
                    fill="#A4E8AF" 
                    name="Tareas completadas"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico de líneas - Lúmenes */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-mi-mundo-dark">Lúmenes Ganados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosBarras}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#12182B20" />
                    <XAxis 
                      dataKey="fecha" 
                      stroke="#12182B" 
                      fontSize={12}
                    />
                    <YAxis stroke="#12182B" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#F0EBE3', 
                        border: '1px solid #12182B',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lumenes" 
                      stroke="#FFC700" 
                      strokeWidth={3}
                      dot={{ fill: '#FFC700', strokeWidth: 2, r: 4 }}
                      name="Lúmenes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de pastel - Distribución por prioridad */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-mi-mundo-dark">Tareas por Prioridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosPrioridades}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datosPrioridades.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de balance */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-mi-mundo-dark">Balance de Lúmenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-mi-mundo-green/10 rounded-lg">
                <div className="text-2xl font-bold text-mi-mundo-green">
                  +{estadisticas.lumenesGanados}
                </div>
                <div className="text-sm text-mi-mundo-dark/60">
                  Lúmenes ganados
                </div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  -{estadisticas.lumenesGastados}
                </div>
                <div className="text-sm text-mi-mundo-dark/60">
                  Lúmenes gastados
                </div>
              </div>
              
              <div className="text-center p-4 bg-mi-mundo-yellow/10 rounded-lg">
                <div className={`text-2xl font-bold ${
                  estadisticas.balanceLumenes >= 0 ? 'text-mi-mundo-green' : 'text-red-600'
                }`}>
                  {estadisticas.balanceLumenes >= 0 ? '+' : ''}{estadisticas.balanceLumenes}
                </div>
                <div className="text-sm text-mi-mundo-dark/60">
                  Balance neto
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logros y badges */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-mi-mundo-dark">
              <Award className="text-mi-mundo-yellow" size={20} />
              <span>Logros Desbloqueados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {estadisticas.tareasCompletadas >= 1 && (
                <div className="text-center p-3 bg-mi-mundo-green/10 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold text-mi-mundo-dark text-sm">
                    Primera Tarea
                  </div>
                  <div className="text-xs text-mi-mundo-dark/60">
                    Completaste tu primera tarea
                  </div>
                </div>
              )}

              {estadisticas.tareasCompletadas >= 10 && (
                <div className="text-center p-3 bg-mi-mundo-yellow/10 rounded-lg">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-semibold text-mi-mundo-dark text-sm">
                    En Racha
                  </div>
                  <div className="text-xs text-mi-mundo-dark/60">
                    10 tareas completadas
                  </div>
                </div>
              )}

              {estadisticas.lumenesGanados >= 100 && (
                <div className="text-center p-3 bg-purple-100 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold text-mi-mundo-dark text-sm">
                    Energético
                  </div>
                  <div className="text-xs text-mi-mundo-dark/60">
                    100+ Lúmenes ganados
                  </div>
                </div>
              )}

              {estadisticas.tasaCompletacion >= 80 && (
                <div className="text-center p-3 bg-blue-100 rounded-lg">
                  <div className="text-2xl mb-2">🎖️</div>
                  <div className="font-semibold text-mi-mundo-dark text-sm">
                    Eficiente
                  </div>
                  <div className="text-xs text-mi-mundo-dark/60">
                    +80% de completación
                  </div>
                </div>
              )}
            </div>

            {estadisticas.tareasCompletadas === 0 && (
              <div className="text-center py-8">
                <Award className="mx-auto text-mi-mundo-dark/30 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-mi-mundo-dark mb-2">
                  ¡Comienza a desbloquear logros!
                </h3>
                <p className="text-mi-mundo-dark/60">
                  Completa tareas para ganar badges y reconocimientos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ElArchivo

