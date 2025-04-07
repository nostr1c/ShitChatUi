import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './scss/index.scss'
import App from './App.jsx'
import store from './stores/store.js'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  // </StrictMode>,
)