import './App.css'
import { ParticleSystem } from './components/ParticleSystem'
import { HeroTerminal } from './components/HeroTerminal'
import { ArchitectureDiagram } from './components/ArchitectureDiagram'
import { ExecutionTimeline } from './components/ExecutionTimeline'
import { PrivacyGuard } from './components/PrivacyGuard'

function App() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <ParticleSystem />
      
      <main className="relative z-10">
        <HeroTerminal />
        <ArchitectureDiagram />
        <ExecutionTimeline />
        <PrivacyGuard />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/30 py-8 text-center font-mono text-sm text-white/60">
        <p>© 2025 TRINETRA.SYS | The Autonomous Verification System</p>
        <p className="text-primary mt-2">// TRUSTLESS_ACTION.ENABLED</p>
      </footer>
    </div>
  )
}

export default App
