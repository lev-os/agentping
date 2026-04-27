import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { DashboardList } from './components/DashboardList'
import { DashboardDetail } from './components/DashboardDetail'
import { ParityDetail } from './components/ParityDetail'
import { WorkflowDetail } from './components/WorkflowDetail'
import { ProjectsView } from './components/ProjectsView'
import { ComponentRegistry } from './components/ComponentRegistry'
import { ComponentDetail } from './components/ComponentDetail'
import { ClusterList } from './components/ClusterList'
import { ClusterReview } from './components/ClusterReview'
import './styles/theme-kingly.css'
import './styles/command-center.css'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardList />} />
        <Route path="/dashboard/:id" element={<DashboardDetail />} />
        <Route path="/parity/:id" element={<ParityDetail />} />
        <Route path="/workflow/:id" element={<WorkflowDetail />} />
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/registry" element={<ComponentRegistry />} />
        {/* Stage 3: batch review — per-component queue redirects to cluster list */}
        <Route path="/registry/queue" element={<Navigate to="/registry/clusters" replace />} />
        <Route path="/registry/clusters" element={<ClusterList />} />
        <Route path="/registry/cluster/:id" element={<ClusterReview />} />
        <Route path="/registry/:id" element={<ComponentDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
