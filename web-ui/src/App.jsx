import React, { useState } from 'react'

const API_URL = 'http://localhost:8080/run' // Your agent endpoint

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg = { sender: 'You', text: input }
    setMessages([...messages, userMsg])
    setInput('')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      })
      const data = await res.json()
      const botMsg = { sender: 'AI', text: data.result || '(No response)' }
      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'Error', text: err.message }])
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>💻 AI Infra Chat</h2>
      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i}><b>{msg.sender}:</b> {msg.text}</div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          style={{ width: '80%' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

