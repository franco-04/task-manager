import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import './LoginPage.css';

const Credenciales = {
  email: "David@gmail.com",
  password: "123456"
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (values.email === Credenciales.email && 
          values.password === Credenciales.password) {
        navigate('/dashboard');
        message.success('Bienvenido!');
      } else {
        message.error('Credenciales incorrectas');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        >
        <h2>Iniciar Sesión</h2>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Ingresa tu email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Ingresa tu contraseña!' }]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
          >
            Ingresar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;