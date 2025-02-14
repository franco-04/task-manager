import { Typography } from 'antd';

const { Title } = Typography;

const DashboardPage = () => {
  return (
    <div>
      <Title level={3}>Panel Principal</Title>
      <p>Bienvenido al sistema de gestión de tareas</p>
    </div>
  );
};

export default DashboardPage;