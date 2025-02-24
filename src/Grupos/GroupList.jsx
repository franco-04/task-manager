import { useState, useEffect } from 'react';
import { Card, List, Button, Spin, Alert } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:3001/groups?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setGroups(data);
        
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [userId]);

  if (loading) {
    return <Spin tip="Cargando grupos..." style={{ display: 'block', margin: '20px auto' }} />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Card 
      title="Mis Grupos" 
      extra={<Button type="primary" href="/groups/create">Crear Grupo</Button>}
      style={{ margin: '20px' }}
    >
      <List
        dataSource={groups}
        renderItem={group => (
          <List.Item
            actions={[
              <a key="detail" href={`/groups/${group.id}`}>Ver detalle</a>,
              <a key="manage" href={`/groups/${group.id}/manage`}>Administrar</a>
            ]}
          >
            <List.Item.Meta
              avatar={<TeamOutlined style={{ fontSize: '24px' }} />}
              title={group.name}
              description={
                <>
                  <div>Administrador: {group.adminId === userId ? 'Tú' : group.adminId}</div>
                  <div>Miembros: {group.members?.length || 0}</div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default GroupList;