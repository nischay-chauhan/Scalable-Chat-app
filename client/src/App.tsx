import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import './index.css';

import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Register />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}


export default App
