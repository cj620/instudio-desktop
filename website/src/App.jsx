import { LangProvider } from './LangContext.jsx'
import { DownloadProvider } from './DownloadContext.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Modes from './components/Modes.jsx'
import Paradigm from './components/Paradigm.jsx'
import Models from './components/Models.jsx'
import Why from './components/Why.jsx'
import Download from './components/Download.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <LangProvider>
      <DownloadProvider>
        <div className="relative min-h-screen overflow-x-hidden">
          <Nav />
          <main>
            <Hero />
            <Modes />
            <Paradigm />
            <Models />
            <Why />
            <Download />
          </main>
          <Footer />
        </div>
      </DownloadProvider>
    </LangProvider>
  )
}
