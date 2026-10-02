import { useState } from 'react';
import { Button, ButtonGroup, Card, Col, Form, ListGroup, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router';
import StatBar from '../components/StatBar';
import TypeBadge from '../components/TypeBadge';
import { useTeam } from '../state/TeamContext';
import { MAX_TEAM_SIZE, TEAM_ACTIONS } from '../state/teamReducer';
import { formatId, formatName } from '../utils/labels';

function averageStats(members) {
  const totals = {};
  members.forEach((member) =>
    member.stats.forEach((stat) => {
      totals[stat.name] = (totals[stat.name] ?? 0) + stat.value;
    }),
  );
  return Object.entries(totals).map(([name, sum]) => ({
    name,
    value: Math.round(sum / members.length),
  }));
}

function countTypes(members) {
  const counts = {};
  members.forEach((member) =>
    member.types.forEach((type) => {
      counts[type] = (counts[type] ?? 0) + 1;
    }),
  );
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export default function TeamPage() {
  const { members, dispatch } = useTeam();
  const [confirmClear, setConfirmClear] = useState(false);

  if (members.length === 0) {
    return (
      <section className="text-center py-5">
        <h1 className="fw-bold">Meu Time</h1>
        <p className="text-body-secondary">
          Seu time está vazio. Abra um Pokémon na Pokédex e clique em “Adicionar ao time”.
        </p>
        <Button as={Link} to="/" variant="danger">
          Ir para a Pokédex
        </Button>
      </section>
    );
  }

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h1 className="fw-bold mb-0">
          Meu Time ({members.length}/{MAX_TEAM_SIZE})
        </h1>
        <Button variant="outline-danger" onClick={() => setConfirmClear(true)}>
          Limpar time
        </Button>
      </div>

      <ListGroup as="ol">
        {members.map((member, index) => (
          <ListGroup.Item as="li" key={member.id} className="d-flex flex-wrap align-items-center gap-3">
            <Link to={`/pokemon/${member.name}`}>
              <img
                src={member.image ?? '/pokeball.svg'}
                alt={formatName(member.name)}
                className="team-member__img"
              />
            </Link>

            <div className="flex-grow-1">
              <small className="text-body-secondary">{formatId(member.id)}</small>
              <div className="fw-bold">
                {member.nickname || formatName(member.name)}
                {member.nickname && (
                  <small className="text-body-secondary fw-normal"> ({formatName(member.name)})</small>
                )}
              </div>
              <div className="d-flex flex-wrap gap-1 my-1">
                {member.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
              <Form.Control
                size="sm"
                placeholder="Apelido"
                maxLength={20}
                value={member.nickname}
                onChange={(event) =>
                  dispatch({
                    type: TEAM_ACTIONS.SET_NICKNAME,
                    payload: { id: member.id, nickname: event.target.value },
                  })
                }
                aria-label={`Apelido de ${formatName(member.name)}`}
                className="team-member__nickname"
              />
            </div>

            <ButtonGroup>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  dispatch({ type: TEAM_ACTIONS.MOVE, payload: { id: member.id, direction: -1 } })
                }
                disabled={index === 0}
                aria-label="Mover para cima"
              >
                ↑
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  dispatch({ type: TEAM_ACTIONS.MOVE, payload: { id: member.id, direction: 1 } })
                }
                disabled={index === members.length - 1}
                aria-label="Mover para baixo"
              >
                ↓
              </Button>
              <Button
                variant="danger"
                onClick={() => dispatch({ type: TEAM_ACTIONS.REMOVE, payload: { id: member.id } })}
              >
                Remover
              </Button>
            </ButtonGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h2" className="h5 mb-0">
              Tipos no time
            </Card.Header>
            <Card.Body className="d-flex flex-wrap gap-3">
              {countTypes(members).map(([type, count]) => (
                <span key={type}>
                  <TypeBadge type={type} /> × {count}
                </span>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h2" className="h5 mb-0">
              Média dos atributos
            </Card.Header>
            <Card.Body>
              {averageStats(members).map((stat) => (
                <StatBar key={stat.name} name={stat.name} value={stat.value} />
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={confirmClear} onHide={() => setConfirmClear(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Limpar time</Modal.Title>
        </Modal.Header>
        <Modal.Body>Remover todos os Pokémon do time?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmClear(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              dispatch({ type: TEAM_ACTIONS.CLEAR });
              setConfirmClear(false);
            }}
          >
            Limpar
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
