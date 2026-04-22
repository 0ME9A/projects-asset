import React from 'react';
export default function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' }}>
      <button style={{ 
        padding: '12px 24px', 
        borderRadius: '8px', 
        background: '#3b82f6', 
        color: 'white', 
        border: 'none', 
        fontWeight: 'bold', 
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        Click Me
      </button>
    </div>
  )
}
