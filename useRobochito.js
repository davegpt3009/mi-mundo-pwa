import { useState, useEffect } from 'react'
import frasesData from './robochito-frases.json'

export const useRobochito = () => {
  const [fraseDelDia, setFraseDelDia] = useState(null)
  const [todasLasFrases, setTodasLasFrases] = useState([])

  useEffect(() => {
    // Cargar todas las frases
    setTodasLasFrases(frasesData.frases)

    // Obtener frase del día basada en la fecha
    const obtenerFraseDelDia = () => {
      const hoy = new Date()
      const diaDelAno = Math.floor((hoy - new Date(hoy.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
      const indice = diaDelAno % frasesData.frases.length
      return frasesData.frases[indice]
    }

    setFraseDelDia(obtenerFraseDelDia())
  }, [])

  // Obtener frase aleatoria
  const obtenerFraseAleatoria = (categoria = null) => {
    let frasesFiltradas = todasLasFrases
    
    if (categoria) {
      frasesFiltradas = todasLasFrases.filter(frase => frase.categoria === categoria)
    }
    
    if (frasesFiltradas.length === 0) return null
    
    const indiceAleatorio = Math.floor(Math.random() * frasesFiltradas.length)
    return frasesFiltradas[indiceAleatorio]
  }

  // Obtener frases por categoría
  const obtenerFrasesPorCategoria = (categoria) => {
    return todasLasFrases.filter(frase => frase.categoria === categoria)
  }

  // Formatear frase para mostrar
  const formatearFrase = (frase) => {
    if (!frase) return ''
    return `[ROBOCHITO_MSG]: ${frase.texto} ${frase.emoji}`
  }

  return {
    fraseDelDia,
    todasLasFrases,
    obtenerFraseAleatoria,
    obtenerFrasesPorCategoria,
    formatearFrase
  }
}

