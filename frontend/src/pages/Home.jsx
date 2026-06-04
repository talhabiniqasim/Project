import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-5">
      <div className="p-5 text-center bg-light rounded-3 shadow-sm mb-5">
        <h1 className="display-4 fw-bold">Welcome to the LMS Platform</h1>
        <p className="lead mt-3">
          The best place to learn and teach. Discover courses, enroll, and track your progress.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button as={Link} to="/courses" variant="primary" size="lg">
            Browse Courses
          </Button>
          <Button as={Link} to="/register" variant="outline-primary" size="lg">
            Get Started
          </Button>
        </div>
      </div>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>For Students</Card.Title>
              <Card.Text>
                Access world-class education from anywhere. Enroll in courses and track your progress seamlessly.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>For Instructors</Card.Title>
              <Card.Text>
                Share your knowledge with the world. Create and manage your courses, upload lessons, and reach millions of students.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Industry Standard</Card.Title>
              <Card.Text>
                Built using modern technologies like React, Node.js, and MongoDB ensuring a robust and scalable platform.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
