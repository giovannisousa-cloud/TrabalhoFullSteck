import { Alert, Spinner } from 'react-bootstrap';

export function Loader({ text = 'Carregando...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center gap-3 py-5 text-body-secondary" role="status">
      <Spinner animation="border" variant="danger" size="sm" />
      {text}
    </div>
  );
}

export function ErrorMessage({ message }) {
  return <Alert variant="danger">{message}</Alert>;
}
