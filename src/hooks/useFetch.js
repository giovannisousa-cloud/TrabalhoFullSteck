import { useEffect, useReducer } from 'react';

const initialState = { status: 'idle', data: null, error: null };

function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Ação desconhecida: ${action.type}`);
  }
}

export function useFetch(fetcher, deps) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!fetcher) {
      dispatch({ type: 'RESET' });
      return undefined;
    }

    const controller = new AbortController();
    dispatch({ type: 'FETCH_START' });

    fetcher(controller.signal)
      .then((data) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
      });

    return () => controller.abort();
  }, deps);

  return state;
}
