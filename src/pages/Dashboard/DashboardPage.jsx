import { useState } from 'react';
import { FloatButton, Modal, Form, Input, Select, DatePicker, Card, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './Dashboard.css'; 

const { Title } = Typography;

const DashboardPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);

  const statusColors = {
    'In Progress': 'blue',
    'Done': 'green',
    'Paused': 'orange',
    'Revision': 'red'
  };

  const categories = ['Trabajo', 'Personal', 'Estudio', 'Otros'];

  const handleFormSubmit = async (values) => {
    // Crear objeto con los datos de la tarea
    const newTask = {
      name: values.taskName,
      description: values.description,
      dueDate: values.dueDate.format('YYYY-MM-DD HH:mm'),
      status: values.status,
      category: values.category
    };
  
    try {
      // Enviar petición POST al backend
      const response = await fetch('http://localhost:3001/createTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });
  
      if (!response.ok) {
        throw new Error('Error al insertar la tarea en el backend');
      }
  
      const data = await response.json();
      console.log('Tarea insertada:', data);
  
      // Actualizar el estado local para reflejar la nueva tarea
      setTasks([...tasks, newTask]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="dashboard-container">
      <Title level={3}>Panel Principal</Title>
      <p>Bienvenido al sistema de gestión de tareas</p>

      <div className="tasks-grid">
        {tasks.map((task, index) => (
          <Card 
            key={index} 
            title={task.name} 
            style={{ width: 300, margin: '10px' }}
            extra={<Tag color={statusColors[task.status]}>{task.status}</Tag>}
          >
            <p><strong>Categoría:</strong> {task.category}</p>
            <p><strong>Fecha límite:</strong> {task.dueDate}</p>
            <p>{task.description}</p>
          </Card>
        ))}
      </div>

      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        style={{ right: 24 }}
        onClick={() => setIsModalVisible(true)}
      />

      <Modal
        title="Nueva Tarea"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="taskName"
            label="Nombre de la Tarea"
            rules={[{ required: true, message: 'Ingresa el nombre de la tarea!' }]}
          >
            <Input placeholder="Ej: Revisar documentación" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Fecha Límite"
            rules={[{ required: true, message: 'Selecciona una fecha!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Selecciona un estado!' }]}
          >
            <Select>
              <Select.Option value="In Progress">En Progreso</Select.Option>
              <Select.Option value="Done">Completado</Select.Option>
              <Select.Option value="Paused">Pausado</Select.Option>
              <Select.Option value="Revision">Revisión</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Categoría"
            rules={[{ required: true, message: 'Selecciona una categoría!' }]}
          >
            <Select>
              {categories.map(category => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardPage;