import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="text-center py-5">
      <h1 className="fw-bold">Página não encontrada</h1>
      <p className="text-body-secondary">Esse caminho não existe na Pokédex.</p>
      <Button as={Link} to="/" variant="danger">
        Voltar para a Pokédex
      </Button>
    </section>
  );
}
