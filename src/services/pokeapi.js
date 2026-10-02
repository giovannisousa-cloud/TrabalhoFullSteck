const BASE_URL = 'https://pokeapi.co/api/v2';
const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

const HIDDEN_TYPES = ['unknown', 'shadow', 'stellar'];

const cache = new Map();

async function getJSON(url, signal) {
  if (cache.has(url)) return cache.get(url);

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? 'Pokémon não encontrado.'
        : `Erro ${response.status} ao acessar a PokéAPI.`,
    );
  }

  const data = await response.json();
  cache.set(url, data);
  return data;
}

export function idFromUrl(url) {
  return Number(url.split('/').filter(Boolean).pop());
}

export function artworkUrl(id) {
  return `${ARTWORK_URL}/${id}.png`;
}

export async function fetchPokemonIndex(signal) {
  const data = await getJSON(`${BASE_URL}/pokemon?limit=2000`, signal);
  return data.results.map((pokemon) => ({
    name: pokemon.name,
    id: idFromUrl(pokemon.url),
  }));
}

export async function fetchTypes(signal) {
  const data = await getJSON(`${BASE_URL}/type`, signal);
  return data.results
    .map((type) => type.name)
    .filter((name) => !HIDDEN_TYPES.includes(name));
}

export async function fetchPokemonNamesByType(type, signal) {
  const data = await getJSON(`${BASE_URL}/type/${type}`, signal);
  return data.pokemon.map((entry) => entry.pokemon.name);
}

function pickFlavorText(species) {
  if (!species) return '';
  const entries = species.flavor_text_entries;
  const entry =
    entries.find((item) => item.language.name === 'pt-br') ??
    entries.find((item) => item.language.name === 'en');
  return entry ? entry.flavor_text.replace(/[\n\f\r]/g, ' ') : '';
}

function pickGenus(species) {
  if (!species) return '';
  const genus = species.genera.find((item) => item.language.name === 'en');
  return genus ? genus.genus : '';
}

export async function fetchPokemonDetail(nameOrId, signal) {
  const pokemon = await getJSON(`${BASE_URL}/pokemon/${nameOrId}`, signal);

  const species = await getJSON(pokemon.species.url, signal).catch((error) => {
    if (error.name === 'AbortError') throw error;
    return null;
  });

  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    image:
      pokemon.sprites.other?.['official-artwork']?.front_default ??
      pokemon.sprites.front_default,
    types: pokemon.types.map((entry) => entry.type.name),
    abilities: pokemon.abilities.map((entry) => ({
      name: entry.ability.name,
      hidden: entry.is_hidden,
    })),
    stats: pokemon.stats.map((entry) => ({
      name: entry.stat.name,
      value: entry.base_stat,
    })),
    genus: pickGenus(species),
    description: pickFlavorText(species),
  };
}
