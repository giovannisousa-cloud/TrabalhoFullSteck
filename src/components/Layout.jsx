import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, Outlet } from 'react-router';
import { useTeam } from '../state/TeamContext';
import { MAX_TEAM_SIZE } from '../state/teamReducer';

export default function Layout() {
  const { members } = useTeam();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar expand="sm" sticky="top" variant="dark" className="navbar-pokedex shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold">
            <img src="/pokeball.svg" alt="" width="28" height="28" />
            Pokédex SPA
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end>
                Pokédex
              </Nav.Link>
              <Nav.Link as={NavLink} to="/time">
                Meu Time{' '}
                <Badge bg="light" text="dark" pill>
                  {members.length}/{MAX_TEAM_SIZE}
                </Badge>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container as="main" className="flex-grow-1 py-4">
        <Outlet />
      </Container>

      <footer className="py-3 text-center text-body-secondary small">
        Dados fornecidos pela{' '}
        <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
          PokéAPI
        </a>
      </footer>
    </div>
  );
}
