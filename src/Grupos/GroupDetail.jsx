import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, List, Button, Select, Form, Input, DatePicker, Tag, Modal, Spin, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const GroupDetail = () => {
  const { groupId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener grupo
        const groupRes = await fetch(`http://localhost:3001/groups/${groupId}`);
        const groupData = await groupRes.json();
        if (!groupRes.ok) throw new Error(groupData.error || 'Error al cargar grupo');
        setGroup(groupData);

        // Obtener tareas del grupo
        const tasksRes = await fetch(`http://localhost:3001/getGroupTasks/${groupId}/${userId}`);
        const tasksData = await tasksRes.json();
        if (!tasksRes.ok) throw new Error(tasksData.error || 'Error al cargar tareas');
        setTasks(tasksData);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId, userId]);

  const handleCreateTask = async (values) => {
    try {
      const response = await fetch('http://localhost:3001/createGroupTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskData: {
            ...values,
            dueDate: values.dueDate.format('YYYY-MM-DD HH:mm'),
            assignedTo: values.assignedTo,
            status: 'In Progress',
          },
          groupId,
          adminId: userId,
        }),
      });
      if (!response.ok) throw new Error('Error al crear tarea');
      setIsModalVisible(false);
      form.resetFields();
      // Recargar tareas-
      const tasksRes = await fetch(`http://localhost:3001/getGroupTasks/${groupId}/${userId}`);
      const tasksData = await tasksRes.json();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  if (loading) return <Spin tip="Cargando..." />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={group.name}
        extra={
          group.adminId === userId && (
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              <PlusOutlined /> Nueva Tarea
            </Button>
          )
        }
      >
        <List
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item
              actions={[
                <Select
                  defaultValue={task.status}
                  onChange={(value) => {
                    fetch(`http://localhost:3001/updateTaskStatus/${task.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: value, userId }),
                    }).then(() => {
                      const updatedTasks = tasks.map((t) =>
                        t.id === task.id ? { ...t, status: value } : t
                      );
                      setTasks(updatedTasks);
                    });
                  }}
                >
                  <Select.Option value="In Progress">En Progreso</Select.Option>
                  <Select.Option value="Done">Completado</Select.Option>
                  <Select.Option value="Paused">Pausado</Select.Option>
                  <Select.Option value="Revision">Revisión</Select.Option>
                </Select>,
              ]}
            >
              <List.Item.Meta
                title={task.name}
                description={
                  <>
                    <p>{task.description}</p>
                    <Tag color="blue">Asignado a: {task.assignedTo}</Tag>
                    <Tag color="gray">Fecha: {new Date(task.dueDate).toLocaleDateString()}</Tag>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Crear Tarea Grupal"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTask}>
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="assignedTo" label="Asignar a" rules={[{ required: true }]}>
            <Select>
              {group.members.map((memberId) => (
                <Select.Option key={memberId} value={memberId}>
                  {memberId === userId ? 'Tú' : memberId}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="dueDate" label="Fecha Límite" rules={[{ required: true }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupDetail;