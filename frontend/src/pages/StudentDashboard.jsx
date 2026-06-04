import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, ProgressBar, Alert } from 'react-bootstrap';
import { BookOpen, UserCircle, TrendingUp } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

// My Courses Sub-page
const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/enrollments/my-courses');
        setEnrollments(data);
      } catch (err) {
        setError('Failed to fetch enrolled courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4">My Courses</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {enrollments.length === 0 ? (
        <Alert variant="info">You haven't enrolled in any courses yet.</Alert>
      ) : (
        <Row className="g-4">
          {enrollments.map((enrollment) => (
            <Col key={enrollment._id} md={6}>
              <Card className="glass-card p-3">
                <Card.Body>
                  <Card.Title>{enrollment.course?.title || 'Unknown Course'}</Card.Title>
                  <Card.Text className="text-muted small">
                    Enrolled on: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </Card.Text>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Progress</small>
                      <small>{enrollment.progress}%</small>
                    </div>
                    <ProgressBar now={enrollment.progress} variant="primary" animated />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

// Profile Sub-page
const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h2 className="mb-4">My Profile</h2>
      <Card className="glass-card p-4" style={{ maxWidth: '500px' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <UserCircle size={80} className="text-primary" />
          </div>
          <div className="mb-3">
            <strong>Name:</strong>
            <p className="text-muted mb-0">{user?.name}</p>
          </div>
          <div className="mb-3">
            <strong>Email:</strong>
            <p className="text-muted mb-0">{user?.email}</p>
          </div>
          <div>
            <strong>Role:</strong>
            <p className="text-muted mb-0 text-capitalize">{user?.role}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

// Main Student Dashboard
const StudentDashboard = () => {
  const sidebarLinks = [
    { path: '/student/dashboard', label: 'My Courses', icon: <BookOpen size={18} /> },
    { path: '/student/dashboard/profile', label: 'Profile', icon: <UserCircle size={18} /> },
  ];

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={3} lg={2}>
          <Sidebar links={sidebarLinks} />
        </Col>
        <Col md={9} lg={10}>
          <Routes>
            <Route index element={<MyCourses />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
