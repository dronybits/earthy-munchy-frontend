import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// If the HTML has <div id="root">, this MUST say 'root'
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  // This will force an error message in the console if the ID is wrong
  console.error("Failed to find the root element. Check your index.html ID!");
}