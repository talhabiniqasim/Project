import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert, ListGroup } from 'react-bootstrap';
import { BookOpen, Clock, DollarSign, User, PlayCircle } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/Rs.{id}`);
        setCourse(data);
      } catch (error) {
        setMessage({ text: 'Course not found.', type: 'danger' });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await api.post('/enrollments/enroll', { courseId: course._id });
      setMessage({ text: 'Successfully enrolled in this course!', type: 'success' });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Enrollment failed.', type: 'danger' });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return <Container className="mt-5"><Alert variant="danger">Course not found.</Alert></Container>;

  return (
    <Container className="mt-4">
      {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>{message.text}</Alert>}

      <Row className="g-4">
        {/* Main Content */}
        <Col lg={8}>
          <Card className="glass-card p-4">
            <Card.Body>
              <Badge bg="info" className="mb-3">{course.category}</Badge>
              <h1 className="mb-3">{course.title}</h1>
              <p className="text-muted lead">{course.description}</p>

              <div className="d-flex gap-4 mt-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <User size={18} className="text-primary" />
                  <span>{course.instructor?.name || 'Unknown'}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <span>{course.lessons?.length || 0} Lessons</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <DollarSign size={18} className="text-primary" />
                  <span>Rs.{course.price}</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Lessons */}
          {course.lessons && course.lessons.length > 0 && (
            <Card className="glass-card mt-4 p-4">
              <Card.Body>
                <h3 className="mb-3">Course Lessons</h3>
                <ListGroup variant="flush">
                  {course.lessons.map((lesson, index) => (
                    <ListGroup.Item
                      key={lesson._id || index}
                      className="bg-transparent text-light border-secondary d-flex align-items-center gap-2"
                    >
                      <PlayCircle size={18} className="text-primary" />
                      <span>Lesson {index + 1}: {lesson.title}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          <Card className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
            <Card.Body className="text-center">
              <h2 className="display-6 fw-bold mb-3">Rs.{course.price}</h2>
              {user && user.role === 'student' ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              ) : !user ? (
                <Button variant="primary" size="lg" className="w-100" onClick={() => navigate('/login')}>
                  Login to Enroll
                </Button>
              ) : (
                <p className="text-muted">Only students can enroll.</p>
              )}
              <hr className="border-secondary" />
              <p className="text-muted small mb-1">Category: {course.category}</p>
              <p className="text-muted small mb-0">Lessons: {course.lessons?.length || 0}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetail;
