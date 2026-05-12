import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SupervisorPage from './pages/SupervisorPage';
import RiderPage from './pages/RiderPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/supervisor" element={<SupervisorPage />} />
      <Route path="/rider" element={<RiderPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
