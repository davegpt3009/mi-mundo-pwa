import { renderHook, waitFor } from '@testing-library/react'
import { useRobochito } from './useRobochito.js'

describe('useRobochito', () => {
  test('obtenerFraseAleatoria respeta la categoria solicitada', async () => {
    const { result } = renderHook(() => useRobochito())

    await waitFor(() => expect(result.current.todasLasFrases.length).toBeGreaterThan(0))

    const frase = result.current.obtenerFraseAleatoria('motivacion')
    expect(frase).not.toBeNull()
    expect(frase.categoria).toBe('motivacion')
  })

  test('formatearFrase formatea correctamente la salida', async () => {
    const { result } = renderHook(() => useRobochito())

    await waitFor(() => expect(result.current.todasLasFrases.length).toBeGreaterThan(0))

    const sample = { texto: 'Hola', emoji: '😀' }
    const formatted = result.current.formatearFrase(sample)
    expect(formatted).toBe('[ROBOCHITO_MSG]: Hola 😀')
  })
})
