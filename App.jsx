import { useState } from 'react'
import { AppProvider } from './AppContext'
import Navigation from './Navigation'
import Robochito from './Robochito'
import ElRefugio from './ElRefugio'
import ElTaller from './ElTaller'
import LaBoveda from './LaBoveda'
import ElArchivo from './ElArchivo'
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
