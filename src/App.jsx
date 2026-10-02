import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';
import PokedexPage from './pages/PokedexPage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import TeamPage from './pages/TeamPage';
import { TeamProvider } from './state/TeamContext';

export default function App() {
  return (
    <TeamProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<PokedexPage />} />
            <Route path="pokemon/:name" element={<PokemonDetailPage />} />
            <Route path="time" element={<TeamPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TeamProvider>
  );
}
