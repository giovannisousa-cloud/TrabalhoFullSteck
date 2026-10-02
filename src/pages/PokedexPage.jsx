import { Col, Form, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router';
import PokemonCard from '../components/PokemonCard';
import Pagination from '../components/Pagination';
import { ErrorMessage, Loader } from '../components/StatusMessage';
import { useFetch } from '../hooks/useFetch';
import { fetchPokemonIndex, fetchPokemonNamesByType, fetchTypes } from '../services/pokeapi';
import { TYPE_LABELS } from '../utils/labels';

const PAGE_SIZE = 24;

export default function PokedexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const type = searchParams.get('tipo') ?? '';
  const page = Math.max(1, Number(searchParams.get('pagina')) || 1);

  const index = useFetch(fetchPokemonIndex, []);
  const types = useFetch(fetchTypes, []);
  const byType = useFetch(
    type ? (signal) => fetchPokemonNamesByType(type, signal) : null,
    [type],
  );

  function updateParams(changes) {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  }

  if (index.status === 'error') return <ErrorMessage message={index.error} />;
  if (byType.status === 'error') return <ErrorMessage message={byType.error} />;

  const loading = index.status !== 'success' || (type && byType.status !== 'success');

  let results = [];
  if (!loading) {
    const typeNames = type ? new Set(byType.data) : null;
    const term = query.trim().toLowerCase();
    results = index.data.filter(
      (pokemon) =>
        (!typeNames || typeNames.has(pokemon.name)) &&
        (!term || pokemon.name.includes(term) || String(pokemon.id) === term),
    );
  }

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section>
      <Row className="g-2 mb-3">
        <Col md={8}>
          <Form.Control
            type="search"
            placeholder="Buscar por nome ou número..."
            value={query}
            onChange={(event) => updateParams({ q: event.target.value, pagina: '' })}
            aria-label="Buscar Pokémon"
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={type}
            onChange={(event) => updateParams({ tipo: event.target.value, pagina: '' })}
            aria-label="Filtrar por tipo"
            disabled={types.status !== 'success'}
          >
            <option value="">Todos os tipos</option>
            {types.data?.map((name) => (
              <option key={name} value={name}>
                {TYPE_LABELS[name] ?? name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <Loader text="Carregando Pokémon..." />
      ) : (
        <>
          <p className="text-body-secondary">{results.length} Pokémon encontrados</p>
          {pageItems.length === 0 ? (
            <p className="text-center text-body-secondary py-5">Nenhum Pokémon corresponde à busca.</p>
          ) : (
            <Row xs={2} sm={3} md={4} lg={6} className="g-3">
              {pageItems.map((pokemon) => (
                <Col key={pokemon.name}>
                  <PokemonCard pokemon={pokemon} />
                </Col>
              ))}
            </Row>
          )}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={(nextPage) => {
              updateParams({ pagina: nextPage > 1 ? String(nextPage) : '' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </section>
  );
}
