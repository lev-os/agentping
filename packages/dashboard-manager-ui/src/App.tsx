import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { DashboardList } from './components/DashboardList'
import { DashboardDetail } from './components/DashboardDetail'
import './styles/theme-kingly.css'
import './styles/command-center.css'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardList />} />
        <Route path="/dashboard/:id" element={<DashboardDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
