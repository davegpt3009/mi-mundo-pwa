import { useState } from 'react'
import { AppProvider } from './contexts/AppContext'
import Navigation from './components/Navigation'
import Robochito from './components/Robochito'
import ElRefugio from './layouts/ElRefugio'
import ElTaller from './layouts/ElTaller'
import LaBoveda from './layouts/LaBoveda'
import ElArchivo from './layouts/ElArchivo'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('refugio')

  const renderCurrentView = () => {
    switch (currentView) {
      case 'refugio':
        return <ElRefugio />
      case 'taller':
        return <ElTaller />
      case 'boveda':
        return <LaBoveda />
      case 'archivo':
        return <ElArchivo />
      default:
        return <ElRefugio />
    }
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-mi-mundo-light">
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        <main>
          {renderCurrentView()}
        </main>
        
        {/* Robochito flotante */}
        <Robochito showFloating={true} autoShow={currentView === 'refugio'} />
      </div>
    </AppProvider>
  )
}

export default App
