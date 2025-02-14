import { Outlet } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { DashboardOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ minHeight: '100vh' }}
      >
        <div className="logo">Hola :) </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            { key: '1', icon: <DashboardOutlined />, label: 'opcion 1' },
            { key: '2', icon: <UnorderedListOutlined />, label: 'opcion 2' },
            { key: '3', icon: <UserOutlined />, label: 'opcion 3' },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;