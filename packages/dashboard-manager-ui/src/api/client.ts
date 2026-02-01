import type { Dashboard, CreateDashboardRequest, DashboardMetrics } from '../types/dashboard'

const API_BASE = '/api'

export class DashboardAPIClient {
  async listDashboards(): Promise<Dashboard[]> {
    const response = await fetch(`${API_BASE}/dashboards`)
    if (!response.ok) {
      throw new Error(`Failed to list dashboards: ${response.statusText}`)
    }
    return response.json()
  }

  async getDashboard(id: string): Promise<Dashboard> {
    const response = await fetch(`${API_BASE}/dashboards/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to get dashboard: ${response.statusText}`)
    }
    return response.json()
  }

  async createDashboard(request: CreateDashboardRequest): Promise<Dashboard> {
    const response = await fetch(`${API_BASE}/dashboards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    if (!response.ok) {
      throw new Error(`Failed to create dashboard: ${response.statusText}`)
    }
    return response.json()
  }

  async deleteDashboard(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/dashboards/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`Failed to delete dashboard: ${response.statusText}`)
    }
  }

  async getDashboardMetrics(id: string): Promise<DashboardMetrics> {
    const response = await fetch(`${API_BASE}/dashboards/${id}/metrics`)
    if (!response.ok) {
      throw new Error(`Failed to get metrics: ${response.statusText}`)
    }
    return response.json()
  }

  async restartDashboard(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/dashboards/${id}/restart`, {
      method: 'POST'
    })
    if (!response.ok) {
      throw new Error(`Failed to restart dashboard: ${response.statusText}`)
    }
  }
}

export const dashboardAPI = new DashboardAPIClient()
