import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function SectionRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Row className={`px-2 ${className || ''}`}>
      <Col md="12" className="p-0 px-lg-2">
        {children}
      </Col>
    </Row>
  );
}


