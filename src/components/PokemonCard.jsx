import { Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router';
import { artworkUrl } from '../services/pokeapi';
import { useTeam } from '../state/TeamContext';
import { formatId, formatName } from '../utils/labels';

export default function PokemonCard({ pokemon }) {
  const { isInTeam } = useTeam();

  return (
    <Card as={Link} to={`/pokemon/${pokemon.name}`} className="pokemon-card h-100 text-decoration-none">
      {isInTeam(pokemon.id) && (
        <Badge bg="danger" pill className="position-absolute top-0 end-0 m-2">
          No time
        </Badge>
      )}
      <Card.Img
        variant="top"
        src={artworkUrl(pokemon.id)}
        alt={formatName(pokemon.name)}
        loading="lazy"
        className="pokemon-card__img mx-auto mt-3"
        onError={(event) => {
          event.currentTarget.src = '/pokeball.svg';
        }}
      />
      <Card.Body className="text-center p-2">
        <Card.Subtitle className="text-body-secondary small">{formatId(pokemon.id)}</Card.Subtitle>
        <Card.Title as="h6" className="mt-1 mb-0 fw-bold">
          {formatName(pokemon.name)}
        </Card.Title>
      </Card.Body>
    </Card>
  );
}
