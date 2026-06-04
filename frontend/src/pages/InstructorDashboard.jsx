import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal, ListGroup } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2, BookOpen, Upload } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

// Create Course Sub-page
const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', price: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/courses', { ...formData, price: Number(formData.price) });
      setMessage({ text: 'Course created successfully!', type: 'success' });
      setFormData({ title: '', description: '', category: '', price: '' });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to create course.', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Create New Course</h2>
      {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>{message.text}</Alert>}
      <Card className="glass-card p-4" style={{ maxWidth: '700px' }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Course Title</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleChange} placeholder="Enter course title" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Course description" required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Web Development" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} placeholder="99.99" required min="0" step="0.01" />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Course'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

// Manage Courses Sub-page
const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const { user } = useContext(AuthContext);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      // Filter to only show courses by this instructor
      const myCourses = data.filter((c) => c.instructor?._id === user._id || c.instructor === user._id);
      setCourses(myCourses);
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
      setMessage({ text: 'Course deleted successfully.', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to delete course.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4">Manage My Courses</h2>
      {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>{message.text}</Alert>}
      {courses.length === 0 ? (
        <Alert variant="info">You haven't created any courses yet.</Alert>
      ) : (
        <Table responsive hover variant="dark" className="glass-card">
          <thead>
            <tr>
              <th>Title</th>
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

// Upload Lessons Sub-page
const UploadLessons = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonUrl, setLessonUrl] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        const myCourses = data.filter((c) => c.instructor?._id === user._id || c.instructor === user._id);
        setCourses(myCourses);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      setMessage({ text: 'Please select a course.', type: 'danger' });
      return;
    }
    setSubmitting(true);
    try {
      const course = courses.find((c) => c._id === selectedCourse);
      const updatedLessons = [...(course.lessons || []), { title: lessonTitle, videoUrl: lessonUrl }];
      await api.put(`/courses/${selectedCourse}`, { lessons: updatedLessons });
      setMessage({ text: 'Lesson added successfully!', type: 'success' });
      setLessonTitle('');
      setLessonUrl('');
      // Refresh courses
      const { data } = await api.get('/courses');
      const myCourses = data.filter((c) => c.instructor?._id === user._id || c.instructor === user._id);
      setCourses(myCourses);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to add lesson.', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Upload Lessons</h2>
      {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>{message.text}</Alert>}
      <Card className="glass-card p-4" style={{ maxWidth: '700px' }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Course</Form.Label>
              <Form.Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                <option value="">-- Select a course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lesson Title</Form.Label>
              <Form.Control value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Enter lesson title" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Video URL</Form.Label>
              <Form.Control value={lessonUrl} onChange={(e) => setLessonUrl(e.target.value)} placeholder="https://example.com/video" required />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Lesson'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Show lessons for selected course */}
      {selectedCourse && (
        <Card className="glass-card p-4 mt-4" style={{ maxWidth: '700px' }}>
          <Card.Body>
            <h5>Current Lessons</h5>
            <ListGroup variant="flush">
              {(courses.find((c) => c._id === selectedCourse)?.lessons || []).map((lesson, idx) => (
                <ListGroup.Item key={idx} className="bg-transparent text-light border-secondary">
                  {idx + 1}. {lesson.title}
                </ListGroup.Item>
              ))}
              {(courses.find((c) => c._id === selectedCourse)?.lessons || []).length === 0 && (
                <ListGroup.Item className="bg-transparent text-muted border-secondary">No lessons yet.</ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

// Main Instructor Dashboard
const InstructorDashboard = () => {
  const sidebarLinks = [
    { path: '/instructor/dashboard', label: 'Create Course', icon: <PlusCircle size={18} /> },
    { path: '/instructor/dashboard/manage', label: 'Manage Courses', icon: <BookOpen size={18} /> },
    { path: '/instructor/dashboard/lessons', label: 'Upload Lessons', icon: <Upload size={18} /> },
  ];

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={3} lg={2}>
          <Sidebar links={sidebarLinks} />
        </Col>
        <Col md={9} lg={10}>
          <Routes>
            <Route index element={<CreateCourse />} />
            <Route path="manage" element={<ManageCourses />} />
            <Route path="lessons" element={<UploadLessons />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorDashboard;
