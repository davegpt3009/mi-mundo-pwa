import { useState } from 'react'
import { AppProvider } from './AppContext.jsx'
import Navigation from './Navigation.jsx'
import Robochito from './Robochito.jsx'
import ElRefugio from './ElRefugio.jsx'
import ElTaller from './ElTaller.jsx'
import LaBoveda from './LaBoveda.jsx'
import ElArchivo from './ElArchivo.jsx'
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
