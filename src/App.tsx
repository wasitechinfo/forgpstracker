import { useState, useEffect } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'

const client = generateClient<Schema>()

function App() {
  const { user, signOut } = useAuthenticator()
  const [devices, setDevices] = useState<Array<Schema["Device"]["type"]>>([])

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    const { data } = await client.models.Device.list()
    setDevices(data)
  }

  const createDevice = async () => {
    await client.models.Device.create({
      name: `GPS Device ${Math.floor(Math.random() * 1000)}`,
      imei: `IMEI${Math.floor(Math.random() * 1000000)}`,
      status: 'ACTIVE'
    })
    fetchDevices()
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>🚀 GPS Tracker Pro</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.signInDetails?.loginId}!</span>
          <button onClick={signOut} style={{ padding: '8px 16px' }}>Sign Out</button>
        </div>
      </header>

      <button 
        onClick={createDevice}
        style={{ 
          padding: '12px 24px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        ➕ Add Sample Device
      </button>

      <div>
        <h2>📱 Your Devices ({devices.length})</h2>
        {devices.length === 0 ? (
          <p>No devices yet. Click "Add Sample Device" to get started!</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {devices.map(device => (
              <div 
                key={device.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <h3>{device.name}</h3>
                <p><strong>IMEI:</strong> {device.imei}</p>
                <p><strong>Status:</strong> 
                  <span style={{ color: device.status === 'ACTIVE' ? 'green' : 'red', marginLeft: '5px' }}>
                    {device.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

