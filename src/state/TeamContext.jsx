import { createContext, useContext, useEffect, useReducer } from 'react';
import {
  MAX_TEAM_SIZE,
  initialTeamState,
  loadTeamState,
  saveTeamState,
  teamReducer,
} from './teamReducer';

const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const [state, dispatch] = useReducer(teamReducer, initialTeamState, loadTeamState);

  useEffect(() => {
    saveTeamState(state);
  }, [state]);

  const value = {
    members: state.members,
    isFull: state.members.length >= MAX_TEAM_SIZE,
    isInTeam: (id) => state.members.some((member) => member.id === id),
    dispatch,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) throw new Error('useTeam deve ser usado dentro de <TeamProvider>.');
  return context;
}
