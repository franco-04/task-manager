import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, theme } from 'antd';
import { 
  DashboardOutlined, 
  UnorderedListOutlined, 
  UserOutlined,
  LogoutOutlined,
  TeamOutlined 
} from '@ant-design/icons';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Manejar la navegación del menú
  const handleNavigation = ({ key }) => {
    switch(key) {
      case '1':
        navigate('/dashboard');
        break;
      case '2':
        navigate('/tasks');
        break;
      case '3':
        navigate('/groups'); // Nueva ruta para grupos
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ minHeight: '100vh' }}
      >
        <div className="logo">Gestor de Tareas</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onSelect={handleNavigation}
          items={[
            { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: '2', icon: <UnorderedListOutlined />, label: 'Tareas' },
            { key: '3', icon: <TeamOutlined />, label: 'Grupos' }, // Nuevo ítem
            { key: '4', icon: <UserOutlined />, label: 'Perfil' },
          ]}
        />
      </Sider>
      <Layout>
        <Header 
          style={{ 
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Button 
            type="primary" 
            onClick={() => navigate('/groups/create')} // Botón rápido para crear grupo
          >
            <TeamOutlined /> Nuevo Grupo
          </Button>
          
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360, 
            background: colorBgContainer 
          }}>
            <Outlet /> {/* Aquí se renderizarán las vistas de grupos */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;