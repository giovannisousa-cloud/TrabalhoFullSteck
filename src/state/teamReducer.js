export const MAX_TEAM_SIZE = 6;
const STORAGE_KEY = 'pokedex-spa:team';

export const TEAM_ACTIONS = {
  ADD: 'ADD_MEMBER',
  REMOVE: 'REMOVE_MEMBER',
  SET_NICKNAME: 'SET_NICKNAME',
  MOVE: 'MOVE_MEMBER',
  CLEAR: 'CLEAR_TEAM',
};

export const initialTeamState = { members: [] };

export function teamReducer(state, action) {
  switch (action.type) {
    case TEAM_ACTIONS.ADD: {
      const pokemon = action.payload;
      const alreadyInTeam = state.members.some((member) => member.id === pokemon.id);
      if (alreadyInTeam || state.members.length >= MAX_TEAM_SIZE) return state;
      return { ...state, members: [...state.members, { ...pokemon, nickname: '' }] };
    }

    case TEAM_ACTIONS.REMOVE:
      return {
        ...state,
        members: state.members.filter((member) => member.id !== action.payload.id),
      };

    case TEAM_ACTIONS.SET_NICKNAME:
      return {
        ...state,
        members: state.members.map((member) =>
          member.id === action.payload.id
            ? { ...member, nickname: action.payload.nickname }
            : member,
        ),
      };

    case TEAM_ACTIONS.MOVE: {
      const { id, direction } = action.payload;
      const index = state.members.findIndex((member) => member.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= state.members.length) return state;

      const members = [...state.members];
      [members[index], members[target]] = [members[target], members[index]];
      return { ...state, members };
    }

    case TEAM_ACTIONS.CLEAR:
      return initialTeamState;

    default:
      throw new Error(`Ação desconhecida: ${action.type}`);
  }
}

export function loadTeamState(fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.members)) return saved;
  } catch {}
  return fallback;
}

export function saveTeamState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}
