import { useEffect, useState } from 'react'

const BACKEND_URL = 'http://localhost:5000'

function StatusBadge({ status }) {
  if (status === 'checking') {
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        Checking...
      </span>
    )
  }
  if (status === 'connected') {
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        Connected
      </span>
    )
  }
  return (
    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
      Failed
    </span>
  )
}

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [dbStatus, setDbStatus] = useState('checking')

  useEffect(() => {
    // Check backend health
    fetch(`${BACKEND_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.success ? 'connected' : 'failed')
      })
      .catch(() => {
        setBackendStatus('failed')
      })

    // Check database connectivity
    fetch(`${BACKEND_URL}/api/db-test`)
      .then((res) => res.json())
      .then((data) => {
        setDbStatus(data.success ? 'connected' : 'failed')
      })
      .catch(() => {
        setDbStatus('failed')
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Hospital Management System
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Phase 1 — System Status</p>
        </div>

        {/* Status Cards */}
        <div className="space-y-4">

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-700">Backend</p>
              <p className="text-xs text-gray-400">Express API on port 5000</p>
            </div>
            <StatusBadge status={backendStatus} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-700">Database</p>
              <p className="text-xs text-gray-400">MySQL — hospital_management_system</p>
            </div>
            <StatusBadge status={dbStatus} />
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          University Software Engineering Project
        </p>

      </div>
    </div>
  )
}

export default App
