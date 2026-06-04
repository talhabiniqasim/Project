import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BookOpen, Users, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <Container className="mt-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">About Our Platform</h1>
        <p className="lead text-muted mt-3">
          Empowering learners and educators worldwide with a modern, industry-standard learning management system.
        </p>
      </div>

      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card className="glass-card h-100 text-center p-4">
            <Card.Body>
              <BookOpen size={48} className="text-primary mb-3" />
              <Card.Title>Rich Courses</Card.Title>
              <Card.Text className="text-muted">
                Access hundreds of courses across multiple categories with structured lessons and progress tracking.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="glass-card h-100 text-center p-4">
            <Card.Body>
              <Users size={48} className="text-primary mb-3" />
              <Card.Title>Expert Instructors</Card.Title>
              <Card.Text className="text-muted">
                Learn from qualified instructors who bring real-world industry experience to every lesson.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="glass-card h-100 text-center p-4">
            <Card.Body>
              <Award size={48} className="text-primary mb-3" />
              <Card.Title>Certifications</Card.Title>
              <Card.Text className="text-muted">
                Earn recognized certifications upon course completion that boost your career prospects.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="glass-card h-100 text-center p-4">
            <Card.Body>
              <Globe size={48} className="text-primary mb-3" />
              <Card.Title>Global Access</Card.Title>
              <Card.Text className="text-muted">
                Study anywhere, anytime. Our platform is accessible from any device, in any location.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="glass-card p-4">
            <Card.Body>
              <h3 className="mb-3">Our Mission</h3>
              <p className="text-muted">
                We believe that education should be accessible, engaging, and effective. Our Learning Management System 
                is built using the latest MERN stack technologies to provide a seamless experience for students, 
                instructors, and administrators alike.
              </p>
              <p className="text-muted mb-0">
                Whether you're looking to upskill, teach, or manage an educational platform, our LMS provides the 
                tools and infrastructure needed to succeed in today's fast-paced learning environment.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
