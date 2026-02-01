import { useState } from 'react'
import { X } from 'lucide-react'
import { dashboardAPI } from '../api/client'
import type { DashboardConfig } from '../types/dashboard'
import './CreateDashboardModal.css'

interface CreateDashboardModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreateDashboardModal({ onClose, onSuccess }: CreateDashboardModalProps) {
  const [formData, setFormData] = useState<DashboardConfig>({
    id: '',
    name: '',
    command: '',
    cwd: process.cwd(),
    port_range: [3000, 3100]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await dashboardAPI.createDashboard({ config: formData })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dashboard')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Dashboard</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="form-group">
            <label htmlFor="id">ID *</label>
            <input
              id="id"
              type="text"
              required
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              placeholder="grafana"
            />
            <span className="form-hint">Unique identifier (alphanumeric + hyphens)</span>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Grafana Dashboard"
            />
          </div>

          <div className="form-group">
            <label htmlFor="command">Command *</label>
            <input
              id="command"
              type="text"
              required
              value={formData.command}
              onChange={e => setFormData({ ...formData, command: e.target.value })}
              placeholder="npm start"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cwd">Working Directory *</label>
            <input
              id="cwd"
              type="text"
              required
              value={formData.cwd}
              onChange={e => setFormData({ ...formData, cwd: e.target.value })}
              placeholder="/path/to/dashboard"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="portMin">Port Range Min *</label>
              <input
                id="portMin"
                type="number"
                required
                min={1024}
                max={65535}
                value={formData.port_range[0]}
                onChange={e =>
                  setFormData({
                    ...formData,
                    port_range: [parseInt(e.target.value), formData.port_range[1]]
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="portMax">Port Range Max *</label>
              <input
                id="portMax"
                type="number"
                required
                min={1024}
                max={65535}
                value={formData.port_range[1]}
                onChange={e =>
                  setFormData({
                    ...formData,
                    port_range: [formData.port_range[0], parseInt(e.target.value)]
                  })
                }
              />
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
