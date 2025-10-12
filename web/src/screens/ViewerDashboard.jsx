import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';

const ViewerDashboard = () => {
  const [viewerData, setViewerData] = useState({
    totalViews: 0,
    activeStreams: 0,
    popularContent: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch viewer analytics data
    const fetchViewerData = async () => {
      try {
        console.log('Fetching viewer data...');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setViewerData({
          totalViews: 15420,
          activeStreams: 23,
          popularContent: [
            { id: 1, title: 'Content Item 1', views: 1250, duration: '15:30' },
            { id: 2, title: 'Content Item 2', views: 980, duration: '22:45' },
            { id: 3, title: 'Content Item 3', views: 756, duration: '08:12' }
          ]
        });
      } catch (error) {
        console.error('Error fetching viewer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewerData();
  }, []);

  return (
    <Layout>
      <div className="viewer-dashboard">
        <h1>Viewer Dashboard</h1>
        
        <div className="viewer-stats">
          <div className="stat-card">
            <h3>Total Views</h3>
            <p>{viewerData.totalViews.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Active Streams</h3>
            <p>{viewerData.activeStreams}</p>
          </div>
        </div>

        <div className="content-section">
          <h2>Popular Content</h2>
          {isLoading ? (
            <div className="loading">Loading content...</div>
          ) : (
            <div className="content-list">
              {viewerData.popularContent.map(item => (
                <div key={item.id} className="content-item">
                  <div className="content-info">
                    <h3>{item.title}</h3>
                    <p>Views: {item.views.toLocaleString()}</p>
                    <p>Duration: {item.duration}</p>
                  </div>
                  <div className="content-actions">
                    <button>View Details</button>
                    <button>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="viewer-controls">
          <button className="control-btn">Analytics Report</button>
          <button className="control-btn">Content Management</button>
          <button className="control-btn">Stream Settings</button>
        </div>
      </div>
    </Layout>
  );
};

export default ViewerDashboard;