import { useState } from 'react'
import { Home, Wrench, Archive, BarChart3, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Navigation = ({ currentView, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    {
      id: 'refugio',
      label: 'El Refugio',
      icon: Home,
      description: 'Dashboard principal'
    },
    {
      id: 'taller',
      label: 'El Taller',
      icon: Wrench,
      description: 'Gestión de tareas'
    },
    {
      id: 'boveda',
      label: 'La Bóveda',
      icon: Archive,
      description: 'Galería de recompensas'
    },
    {
      id: 'archivo',
      label: 'El Archivo',
      icon: BarChart3,
      description: 'Estadísticas'
    }
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      {/* Navegación Desktop */}
      <nav className="hidden md:flex bg-mi-mundo-dark text-mi-mundo-light p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-mi-mundo-yellow rounded-lg flex items-center justify-center">
              <span className="text-mi-mundo-dark font-bold text-sm">MW</span>
            </div>
            <h1 className="text-xl font-bold">Mi Mundo</h1>
          </div>
          
          <div className="flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-mi-mundo-yellow text-mi-mundo-dark hover:bg-mi-mundo-yellow/90' 
                      : 'text-mi-mundo-light hover:bg-mi-mundo-light/10 hover:text-mi-mundo-yellow'
                  }`}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon size={18} />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Navegación Mobile */}
      <nav className="md:hidden bg-mi-mundo-dark text-mi-mundo-light">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-mi-mundo-yellow rounded-lg flex items-center justify-center">
              <span className="text-mi-mundo-dark font-bold text-sm">MW</span>
            </div>
            <h1 className="text-lg font-bold">Mi Mundo</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="text-mi-mundo-light hover:bg-mi-mundo-light/10"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Menu Mobile Desplegable */}
        {isMenuOpen && (
          <div className="bg-mi-mundo-dark border-t border-mi-mundo-yellow/20 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-mi-mundo-yellow text-mi-mundo-dark' 
                        : 'text-mi-mundo-light hover:bg-mi-mundo-light/10 hover:text-mi-mundo-yellow'
                    }`}
                    onClick={() => {
                      onViewChange(item.id)
                      setIsMenuOpen(false)
                    }}
                  >
                    <Icon size={20} />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navigation

