import { useState, useEffect } from 'react';
import { FloatButton, Modal, Form, Input, Select, DatePicker, Card, Tag, Typography, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Dashboard.css';

const { Title } = Typography;

const statusOptions = ['In Progress', 'Done', 'Paused', 'Revision'];

const DashboardPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [userId] = useState(localStorage.getItem('userId'));

  const statusColors = {
    'In Progress': 'blue',
    'Done': 'green',
    'Paused': 'orange',
    'Revision': 'red'
  };

  const categories = ['Trabajo', 'Personal', 'Estudio', 'Otros'];

  // Agrupar tareas por estado
  const groupTasksByStatus = () => {
    const grouped = {};
    statusOptions.forEach(status => {
      grouped[status] = tasks.filter(task => task.Status === status);
    });
    return grouped;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/getTasks/${userId}`);
        if (!response.ok) throw new Error('Error al cargar tareas');
        
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (userId) fetchTasks();
  }, [userId]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    try {
      await fetch(`http://localhost:3001/updateTaskStatus/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, Status: newStatus };
        }
        return task;
      });
      
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const handleFormSubmit = async (values) => {
    const newTask = {
      name: values.taskName,
      description: values.description,
      dueDate: values.dueDate.format('YYYY-MM-DD HH:mm'),
      status: values.status,
      category: values.category,
      userId: userId
    };

    try {
      const response = await fetch('http://localhost:3001/createTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) throw new Error('Error al crear tarea');
      
      const data = await response.json();
      const updatedResponse = await fetch(`http://localhost:3001/getTasks/${userId}`);
      const updatedData = await updatedResponse.json();
      setTasks(updatedData);

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Title level={3}>Panel de Tareas Kanban</Title>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Row gutter={16} className="kanban-board">
          {Object.entries(groupTasksByStatus()).map(([status, tasks]) => (
            <Col span={6} key={status}>
              <Card
                title={
                  <Tag color={statusColors[status]} style={{ fontSize: '1.1em' }}>
                    {status} ({tasks.length})
                  </Tag>
                }
                className="status-column"
              >
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="task-list"
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="task-card"
                            >
                              <Card
                                title={task["Name Task"]}
                                size="small"
                                style={{ marginBottom: 8 }}
                              >
                                <p><strong>Categoría:</strong> {task.Category}</p>
                                <p><strong>Fecha límite:</strong> {new Date(task.Dead_line).toLocaleDateString()}</p>
                                <p>{task.Description}</p>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>

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