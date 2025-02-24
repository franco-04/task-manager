import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import RegisPage from './pages/RegisPage/RegisPage';
import GroupList from './Grupos/GroupList';
import GroupCreate from './Grupos/GroupCreate';
import GroupDetail from './Grupos/GroupDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/Registro" element={<RegisPage />} />
        <Route path="groups" element={<GroupList />} />
        <Route path="groups/create" element={<GroupCreate />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;