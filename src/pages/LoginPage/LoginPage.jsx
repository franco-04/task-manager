import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';



const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {


    if (values.username.trim() === '' || values.password.trim() === '') {
      message.error('No se permiten espacios vacíos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/iniciarsesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          username: values.username.trim(),
          password: values.password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('inicio exitoso!');
        localStorage.setItem('userId', data.userId);
        navigate('/dashboard'); 
      } else {
        message.error(data.error || 'Error al iniciar sesion');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      message.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h2>Iniciar sesion</h2>

        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Ingresa tu nombre de usuario!' },
            { whitespace: true, message: 'El nombre de usuario no puede estar vacío' },
          ]}
        >
          <Input placeholder="Nombre de usuario" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Ingresa tu contraseña!' },
            { whitespace: true, message: 'La contraseña no puede estar vacía' },
          ]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block>
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
