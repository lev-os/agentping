import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { DashboardList } from './components/DashboardList'
import { DashboardDetail } from './components/DashboardDetail'
import { ParityDetail } from './components/ParityDetail'
import { ProjectsView } from './components/ProjectsView'
import { ComponentRegistry } from './components/ComponentRegistry'
import { ComponentDetail } from './components/ComponentDetail'
import { ReviewQueue } from './components/ReviewQueue'
import './styles/theme-kingly.css'
import './styles/command-center.css'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardList />} />
        <Route path="/dashboard/:id" element={<DashboardDetail />} />
        <Route path="/parity/:id" element={<ParityDetail />} />
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/registry" element={<ComponentRegistry />} />
        <Route path="/registry/queue" element={<ReviewQueue />} />
        <Route path="/registry/:id" element={<ComponentDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
