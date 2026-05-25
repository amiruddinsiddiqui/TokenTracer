import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AuditPage from './pages/AuditPage'
import SharePage from './pages/SharePage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/audit/:id" element={<AuditPage />} />
        <Route path="/share/:publicId" element={<SharePage />} />
      </Routes>
    </Layout>
  )
}
