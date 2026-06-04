import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Card className="glass-card h-100 course-card">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="info" className="category-badge">{course.category}</Badge>
          <span className="price-tag">${course.price}</span>
        </div>
        <Card.Title className="mt-2">{course.title}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">
          {course.description?.substring(0, 120)}
          {course.description?.length > 120 ? '...' : ''}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary">
          <small className="text-muted">
            By {course.instructor?.name || 'Unknown'}
          </small>
          <small className="text-muted">
            {course.lessons?.length || 0} lessons
          </small>
        </div>
        <Link to={`/courses/${course._id}`} className="btn btn-outline-primary btn-sm mt-3 w-100">
          View Course
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
