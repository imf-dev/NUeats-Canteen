import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';

const EncoderDashboard = () => {
  const [encodingTasks, setEncodingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch encoding tasks
    const fetchEncodingTasks = async () => {
      try {
        console.log('Fetching encoding tasks...');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setEncodingTasks([
          { id: 1, name: 'Video File 1', status: 'pending', progress: 0 },
          { id: 2, name: 'Video File 2', status: 'encoding', progress: 45 },
          { id: 3, name: 'Video File 3', status: 'completed', progress: 100 }
        ]);
      } catch (error) {
        console.error('Error fetching encoding tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEncodingTasks();
  }, []);

  const startEncoding = (taskId) => {
    setEncodingTasks(tasks =>
      tasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'encoding', progress: 0 }
          : task
      )
    );
  };

  return (
    <Layout>
      <div className="encoder-dashboard">
        <h1>Encoder Dashboard</h1>
        
        <div className="encoding-controls">
          <button className="control-btn">Add New Task</button>
          <button className="control-btn">Pause All</button>
          <button className="control-btn">Resume All</button>
        </div>

        <div className="encoding-tasks">
          <h2>Encoding Tasks</h2>
          {isLoading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <div className="task-list">
              {encodingTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h3>{task.name}</h3>
                    <p>Status: {task.status}</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="task-actions">
                    {task.status === 'pending' && (
                      <button onClick={() => startEncoding(task.id)}>
                        Start
                      </button>
                    )}
                    <button>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EncoderDashboard;