import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert } from 'react-bootstrap';
import { Users, BookOpen, BarChart3, Trash2, UserCheck, GraduationCap } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

// Analytics Sub-page
const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/analytics');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <Alert variant="danger">Failed to load analytics.</Alert>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={32} />, color: '#4f46e5' },
    { label: 'Total Students', value: stats.totalStudents, icon: <GraduationCap size={32} />, color: '#10b981' },
    { label: 'Total Instructors', value: stats.totalInstructors, icon: <UserCheck size={32} />, color: '#f59e0b' },
    { label: 'Total Courses', value: stats.totalCourses, icon: <BookOpen size={32} />, color: '#ec4899' },
    { label: 'Total Enrollments', value: stats.totalEnrollments, icon: <BarChart3 size={32} />, color: '#8b5cf6' },
  ];

  return (
    <div>
      <h2 className="mb-4">Analytics & Reports</h2>
      <Row className="g-4">
        {cards.map((card) => (
          <Col key={card.label} sm={6} lg={4} xl>
            <Card className="glass-card p-3 text-center analytics-card" style={{ borderTop: `3px solid ${card.color}` }}>
              <Card.Body>
                <div style={{ color: card.color }} className="mb-2">{card.icon}</div>
                <h3 className="fw-bold">{card.value}</h3>
                <p className="text-muted mb-0">{card.label}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

// Manage Users Sub-page
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      setMessage({ text: 'Failed to load users.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      setMessage({ text: 'User deleted.', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to delete user.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4">Manage Users</h2>
      {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>{message.text}</Alert>}
      <Table responsive hover variant="dark" className="glass-card">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td className="text-capitalize">{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u._id)}>
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

// Admin Manage Courses Sub-page
const AdminManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (error) {
      setMessage({ text: 'Failed to load courses.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      setMessage({ text: 'Course deleted.', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to delete course.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4">Manage Courses</h2>
      {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>{message.text}</Alert>}
      {courses.length === 0 ? (
        <Alert variant="info">No courses found.</Alert>
      ) : (
        <Table responsive hover variant="dark" className="glass-card">
          <thead>
            <tr>
              <th>Title</th>
              <th>Instructor</th>
              <th>Category</th>
              <th>Price</th>
              <th>Lessons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.instructor?.name || 'N/A'}</td>
                <td>{course.category}</td>
                <td>${course.price}</td>
                <td>{course.lessons?.length || 0}</td>
                <td>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(course._id)}>
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const sidebarLinks = [
    { path: '/admin/dashboard', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { path: '/admin/dashboard/users', label: 'Manage Users', icon: <Users size={18} /> },
    { path: '/admin/dashboard/courses', label: 'Manage Courses', icon: <BookOpen size={18} /> },
  ];

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={3} lg={2}>
          <Sidebar links={sidebarLinks} />
        </Col>
        <Col md={9} lg={10}>
          <Routes>
            <Route index element={<Analytics />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="courses" element={<AdminManageCourses />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
