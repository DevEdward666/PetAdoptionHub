import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Pet, Owner, Report } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

// Define state types
interface AppState {
  pets: Pet[];
  showcasePets: Pet[];
  owners: Owner[];
  favorites: number[];
  activeFilter: string;
  isLoading: {
    pets: boolean;
    owners: boolean;
    showcasePets: boolean;
  };
  error: string | null;
}

// Define action types
type AppAction =
  | { type: 'SET_PETS'; payload: Pet[] }
  | { type: 'SET_SHOWCASE_PETS'; payload: Pet[] }
  | { type: 'SET_OWNERS'; payload: Owner[] }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'SET_ACTIVE_FILTER'; payload: string }
  | { type: 'SET_LOADING'; payload: { key: 'pets' | 'owners' | 'showcasePets'; value: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CREATE_REPORT'; payload: Report }
  | { type: 'RESET_ERROR' };

// Define initial state
const initialState: AppState = {
  pets: [],
  showcasePets: [],
  owners: [],
  favorites: [],
  activeFilter: 'all',
  isLoading: {
    pets: false,
    owners: false,
    showcasePets: false
  },
  error: null
};

// Create reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PETS':
      return { ...state, pets: action.payload };
    case 'SET_SHOWCASE_PETS':
      return { ...state, showcasePets: action.payload };
    case 'SET_OWNERS':
      return { ...state, owners: action.payload };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };
    case 'SET_ACTIVE_FILTER':
      return { ...state, activeFilter: action.payload };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  fetchPets: () => Promise<void>;
  fetchShowcasePets: () => Promise<void>;
  fetchOwners: () => Promise<void>;
  toggleFavorite: (petId: number) => void;
  setActiveFilter: (filter: string) => void;
  submitReport: (reportData: any) => Promise<void>;
  getFilteredPets: () => Pet[];
  getFilteredOwners: (searchTerm: string) => Owner[];
  getPetsForOwner: (ownerId: number) => Pet[];
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Create provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Fetch pets
  const fetchPets = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'pets', value: true } });
      const response = await apiRequest('GET', '/api/pets');
      const data = await response.json();
      dispatch({ type: 'SET_PETS', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch pets' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'pets', value: false } });
    }
  };

  // Fetch showcase pets
  const fetchShowcasePets = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'showcasePets', value: true } });
      const response = await apiRequest('GET', '/api/pets/showcase');
      const data = await response.json();
      dispatch({ type: 'SET_SHOWCASE_PETS', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch showcase pets' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'showcasePets', value: false } });
    }
  };

  // Fetch owners
  const fetchOwners = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'owners', value: true } });
      const response = await apiRequest('GET', '/api/owners');
      const data = await response.json();
      dispatch({ type: 'SET_OWNERS', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch owners' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'owners', value: false } });
    }
  };

  // Toggle favorite
  const toggleFavorite = (petId: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: petId });
  };

  // Set active filter
  const setActiveFilter = (filter: string) => {
    dispatch({ type: 'SET_ACTIVE_FILTER', payload: filter });
  };

  // Submit report
  const submitReport = async (reportData: any) => {
    try {
      dispatch({ type: 'RESET_ERROR' });
      await apiRequest('POST', '/api/reports', reportData);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to submit report' });
      throw error;
    }
  };

  // Get filtered pets based on active filter
  const getFilteredPets = () => {
    if (state.activeFilter === 'all') return state.pets;
    return state.pets.filter(pet => 
      pet.type.toLowerCase() === state.activeFilter.toLowerCase()
    );
  };

  // Get filtered owners based on search term
  const getFilteredOwners = (searchTerm: string) => {
    if (!searchTerm) return state.owners;
    return state.owners.filter(owner => 
      owner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get pets for a specific owner
  const getPetsForOwner = (ownerId: number) => {
    return state.pets.filter(pet => pet.ownerId === ownerId);
  };

  // Context value
  const value: AppContextValue = {
    state,
    dispatch,
    fetchPets,
    fetchShowcasePets,
    fetchOwners,
    toggleFavorite,
    setActiveFilter,
    submitReport,
    getFilteredPets,
    getFilteredOwners,
    getPetsForOwner
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create custom hook for using the context
export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};