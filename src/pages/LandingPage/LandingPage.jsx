import { Button, Card, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <Card className="landing-card">
        <Title level={2}>Task Manager</Title>
        <Paragraph>Organiza tus tareas</Paragraph>
        <Space>
        <Button type="primary" onClick={() => navigate('/login')}>
            Iniciar sesion
          </Button>
          <Button type="primary" onClick={() => navigate('/Registro')}>
            Registrate
          </Button>
        </Space>
      </Card>
    </div>
  );
};     

export default LandingPage;