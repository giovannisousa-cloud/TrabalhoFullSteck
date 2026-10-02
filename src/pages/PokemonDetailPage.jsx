import { Alert, Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router';
import StatBar from '../components/StatBar';
import { ErrorMessage, Loader } from '../components/StatusMessage';
import TypeBadge from '../components/TypeBadge';
import { useFetch } from '../hooks/useFetch';
import { fetchPokemonDetail } from '../services/pokeapi';
import { useTeam } from '../state/TeamContext';
import { MAX_TEAM_SIZE, TEAM_ACTIONS } from '../state/teamReducer';
import { formatId, formatName } from '../utils/labels';

const LAST_NATIONAL_ID = 1025;

export default function PokemonDetailPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isFull, isInTeam, dispatch } = useTeam();

  const { status, data: pokemon, error } = useFetch(
    (signal) => fetchPokemonDetail(name.toLowerCase(), signal),
    [name],
  );

  if (status === 'error') {
    return (
      <>
        <ErrorMessage message={error} />
        <Button as={Link} to="/" variant="danger">
          Voltar para a Pokédex
        </Button>
      </>
    );
  }
  if (status !== 'success') return <Loader text="Carregando detalhes..." />;

  const inTeam = isInTeam(pokemon.id);
  const total = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);

  function toggleTeam() {
    if (inTeam) {
      dispatch({ type: TEAM_ACTIONS.REMOVE, payload: { id: pokemon.id } });
    } else {
      dispatch({
        type: TEAM_ACTIONS.ADD,
        payload: {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          types: pokemon.types,
          stats: pokemon.stats,
        },
      });
    }
  }

  const facts = [
    { label: 'Altura', value: `${pokemon.height.toLocaleString('pt-BR')} m` },
    { label: 'Peso', value: `${pokemon.weight.toLocaleString('pt-BR')} kg` },
    {
      label: 'Habilidades',
      value: pokemon.abilities
        .map((ability) => formatName(ability.name) + (ability.hidden ? ' (oculta)' : ''))
        .join(', '),
    },
  ];

  return (
    <article>
      <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Voltar
        </Button>
        <ButtonGroup>
          {pokemon.id > 1 && pokemon.id <= LAST_NATIONAL_ID && (
            <Button as={Link} to={`/pokemon/${pokemon.id - 1}`} variant="outline-secondary">
              ‹ {formatId(pokemon.id - 1)}
            </Button>
          )}
          {pokemon.id < LAST_NATIONAL_ID && (
            <Button as={Link} to={`/pokemon/${pokemon.id + 1}`} variant="outline-secondary">
              {formatId(pokemon.id + 1)} ›
            </Button>
          )}
        </ButtonGroup>
      </div>

      <Row className="g-4">
        <Col md={5}>
          <Card body className="text-center">
            <img
              src={pokemon.image ?? '/pokeball.svg'}
              alt={formatName(pokemon.name)}
              className="img-fluid"
            />
          </Card>
        </Col>

        <Col md={7}>
          <span className="text-body-secondary fw-semibold">{formatId(pokemon.id)}</span>
          <h1 className="fw-bold">{formatName(pokemon.name)}</h1>
          {pokemon.genus && <p className="text-body-secondary">{pokemon.genus}</p>}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
          {pokemon.description && <p>{pokemon.description}</p>}

          <Row xs={1} sm={3} className="g-2 mb-4">
            {facts.map((fact) => (
              <Col key={fact.label}>
                <Card body className="h-100 py-0">
                  <small className="text-body-secondary d-block">{fact.label}</small>
                  <span className="fw-semibold">{fact.value}</span>
                </Card>
              </Col>
            ))}
          </Row>

          <Button
            variant={inTeam ? 'outline-danger' : 'danger'}
            size="lg"
            onClick={toggleTeam}
            disabled={!inTeam && isFull}
          >
            {inTeam ? 'Remover do time' : 'Adicionar ao time'}
          </Button>
          {!inTeam && isFull && (
            <Alert variant="warning" className="mt-3 mb-0">
              Seu time já tem {MAX_TEAM_SIZE} Pokémon. Remova um para adicionar.
            </Alert>
          )}
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Header as="h2" className="h5 mb-0">
          Atributos base
        </Card.Header>
        <Card.Body>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} />
          ))}
          <p className="fw-bold mb-0 mt-3">Total: {total}</p>
        </Card.Body>
      </Card>
    </article>
  );
}
