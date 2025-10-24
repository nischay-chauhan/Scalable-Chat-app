import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import './index.css';

import Register from './pages/Register';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}


export default App
