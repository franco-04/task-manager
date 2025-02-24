import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const GroupCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:3001/createGroup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId // Header requerido por el backend
        },
        body: JSON.stringify({
          name: values.groupName // Solo enviamos el nombre
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      notification.success({
        message: '¡Grupo creado!',
        description: `El grupo "${values.groupName}" fue creado exitosamente`
      });
      
      navigate(`/groups`);

    } catch (error) {
      console.error('Error al crear grupo:', error);
      notification.error({
        message: 'Error al crear grupo',
        description: error.message || 'Por favor intenta nuevamente'
      });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Crear Nuevo Grupo</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="groupName"
          label="Nombre del Grupo"
          rules={[
            { required: true, message: '¡El nombre es requerido!' },
            { max: 50, message: 'Máximo 50 caracteres' }
          ]}
        >
          <Input 
            placeholder="Ej: Equipo de Desarrollo Frontend" 
            allowClear
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Crear Grupo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GroupCreate;