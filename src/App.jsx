import { Routes, Route } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<MainLayout />} />
    </Routes>
  )
}

export default App