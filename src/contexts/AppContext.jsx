import { createContext, useContext, useReducer, useEffect } from 'react'

// Estado inicial
const initialState = {
  lumenes: 0,
  tareas: [],
  recompensas: [],
  estadisticas: {
    tareasCompletadasHoy: 0,
    tareasCompletadasSemana: 0,
    tareasCompletadasMes: 0,
    lumenesGanadosHoy: 0,
    lumenesGanadosSemana: 0,
    lumenesGanadosMes: 0
  },
  configuracion: {
    nombreUsuario: 'Usuario',
    temaOscuro: false,
    notificaciones: true
  }
}

// Tipos de acciones
const actionTypes = {
  SET_LUMENES: 'SET_LUMENES',
  ADD_LUMENES: 'ADD_LUMENES',
  SUBTRACT_LUMENES: 'SUBTRACT_LUMENES',
  ADD_TAREA: 'ADD_TAREA',
  UPDATE_TAREA: 'UPDATE_TAREA',
  DELETE_TAREA: 'DELETE_TAREA',
  COMPLETE_TAREA: 'COMPLETE_TAREA',
  ADD_RECOMPENSA: 'ADD_RECOMPENSA',
  CANJEAR_RECOMPENSA: 'CANJEAR_RECOMPENSA',
  UPDATE_ESTADISTICAS: 'UPDATE_ESTADISTICAS',
  UPDATE_CONFIGURACION: 'UPDATE_CONFIGURACION',
  LOAD_DATA: 'LOAD_DATA'
}

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LUMENES:
      return { ...state, lumenes: action.payload }
    
    case actionTypes.ADD_LUMENES:
      return { ...state, lumenes: state.lumenes + action.payload }
    
    case actionTypes.SUBTRACT_LUMENES:
      return { ...state, lumenes: Math.max(0, state.lumenes - action.payload) }
    
    case actionTypes.ADD_TAREA:
      return { 
        ...state, 
        tareas: [...state.tareas, { 
          ...action.payload, 
          id: Date.now(),
          fechaCreacion: new Date().toISOString(),
          completada: false
        }] 
      }
    
    case actionTypes.UPDATE_TAREA:
      return {
        ...state,
        tareas: state.tareas.map(tarea => 
          tarea.id === action.payload.id 
            ? { ...tarea, ...action.payload.updates }
            : tarea
        )
      }
    
    case actionTypes.DELETE_TAREA:
      return {
        ...state,
        tareas: state.tareas.filter(tarea => tarea.id !== action.payload)
      }
    
    case actionTypes.COMPLETE_TAREA:
      const tareaCompletada = state.tareas.find(t => t.id === action.payload.id)
      if (tareaCompletada && !tareaCompletada.completada) {
        return {
          ...state,
          tareas: state.tareas.map(tarea => 
            tarea.id === action.payload.id 
              ? { ...tarea, completada: true, fechaCompletada: new Date().toISOString() }
              : tarea
          ),
          lumenes: state.lumenes + (action.payload.lumenesRecompensa || 10),
          estadisticas: {
            ...state.estadisticas,
            tareasCompletadasHoy: state.estadisticas.tareasCompletadasHoy + 1,
            lumenesGanadosHoy: state.estadisticas.lumenesGanadosHoy + (action.payload.lumenesRecompensa || 10)
          }
        }
      }
      return state
    
    case actionTypes.ADD_RECOMPENSA:
      return {
        ...state,
        recompensas: [...state.recompensas, {
          ...action.payload,
          id: Date.now(),
          fechaCreacion: new Date().toISOString(),
          canjeada: false
        }]
      }
    
    case actionTypes.CANJEAR_RECOMPENSA:
      const recompensa = state.recompensas.find(r => r.id === action.payload.id)
      if (recompensa && !recompensa.canjeada && state.lumenes >= recompensa.costo) {
        return {
          ...state,
          lumenes: state.lumenes - recompensa.costo,
          recompensas: state.recompensas.map(r => 
            r.id === action.payload.id 
              ? { ...r, canjeada: true, fechaCanje: new Date().toISOString() }
              : r
          )
        }
      }
      return state
    
    case actionTypes.UPDATE_ESTADISTICAS:
      return {
        ...state,
        estadisticas: { ...state.estadisticas, ...action.payload }
      }
    
    case actionTypes.UPDATE_CONFIGURACION:
      return {
        ...state,
        configuracion: { ...state.configuracion, ...action.payload }
      }
    
    case actionTypes.LOAD_DATA:
      return { ...state, ...action.payload }
    
    default:
      return state
  }
}

// Contexto
const AppContext = createContext()

// Hook personalizado
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider')
  }
  return context
}

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('mi-mundo-data')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: actionTypes.LOAD_DATA, payload: parsedData })
      } catch (error) {
        console.error('Error al cargar datos guardados:', error)
      }
    }
  }, [])

  // Guardar datos en localStorage cuando el estado cambie
  useEffect(() => {
    localStorage.setItem('mi-mundo-data', JSON.stringify(state))
  }, [state])

  // Acciones
  const actions = {
    setLumenes: (cantidad) => dispatch({ type: actionTypes.SET_LUMENES, payload: cantidad }),
    addLumenes: (cantidad) => dispatch({ type: actionTypes.ADD_LUMENES, payload: cantidad }),
    subtractLumenes: (cantidad) => dispatch({ type: actionTypes.SUBTRACT_LUMENES, payload: cantidad }),
    
    addTarea: (tarea) => dispatch({ type: actionTypes.ADD_TAREA, payload: tarea }),
    updateTarea: (id, updates) => dispatch({ type: actionTypes.UPDATE_TAREA, payload: { id, updates } }),
    deleteTarea: (id) => dispatch({ type: actionTypes.DELETE_TAREA, payload: id }),
    completeTarea: (id, lumenesRecompensa) => dispatch({ 
      type: actionTypes.COMPLETE_TAREA, 
      payload: { id, lumenesRecompensa } 
    }),
    
    addRecompensa: (recompensa) => dispatch({ type: actionTypes.ADD_RECOMPENSA, payload: recompensa }),
    canjearRecompensa: (id) => dispatch({ type: actionTypes.CANJEAR_RECOMPENSA, payload: { id } }),
    
    updateEstadisticas: (estadisticas) => dispatch({ type: actionTypes.UPDATE_ESTADISTICAS, payload: estadisticas }),
    updateConfiguracion: (configuracion) => dispatch({ type: actionTypes.UPDATE_CONFIGURACION, payload: configuracion })
  }

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext

