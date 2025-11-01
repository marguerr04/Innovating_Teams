import React from 'react';
import { Modal } from 'react-bootstrap';
import ReadOnlyMap from './ReadOnlyMap';

export default function MapModal({ show, onHide, persona, bubbles }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5" className="fw-bold">Mapa de Empatía</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReadOnlyMap persona={persona} bubbles={bubbles} />
      </Modal.Body>
    </Modal>
  );
}