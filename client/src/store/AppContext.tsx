import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { Pet, Owner, Report, Admin } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

// Define state types
interface AppState {
  pets: Pet[];
  showcasePets: Pet[];
  owners: Owner[];
  favorites: number[];
  activeFilter: string;
  filters: {
    type: string;
    age: string;
    size: string;
    gender: string;
    goodWithKids: boolean;
  };
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
  | { type: 'SET_FILTERS'; payload: { key: string; value: any } }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_LOADING'; payload: { key: 'pets' | 'owners' | 'showcasePets'; value: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_ERROR' };

// Define initial state
const initialState: AppState = {
  pets: [],
  showcasePets: [],
  owners: [],
  favorites: [],
  activeFilter: 'all',
  filters: {
    type: 'all',
    age: 'any',
    size: 'any',
    gender: 'any',
    goodWithKids: false
  },
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
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        activeFilter: 'all'
      };
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
  submitReport: (reportData: Omit<Report, 'id' | 'createdAt'>) => Promise<void>;
  getFilteredPets: () => Pet[];
  getFilteredOwners: (searchTerm: string) => Owner[];
  getPetsForOwner: (ownerId: number) => Pet[];
  login: (token: string, user: Owner) => void;
  logout: () => void;
  user: Owner | null;
  token: string | null;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Create provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [location, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<Owner | null>(null);
  const { toast } = useToast();
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
  const submitReport = async (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    try {
      dispatch({ type: 'RESET_ERROR' });
      await apiRequest('POST', '/api/reports', reportData);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to submit report' });
      throw error;
    }
  };

  // Get filtered pets based on all filters
  const getFilteredPets = () => {
    return state.pets.filter(pet => {
      // Type filter
      if (state.filters.type !== 'all' && pet.type.toLowerCase() !== state.filters.type.toLowerCase()) {
        return false;
      }

      // Age filter
      if (state.filters.age !== 'any') {
        const age = pet.age || 0;
        switch (state.filters.age) {
          case 'young':
            if (age > 1) return false;
            break;
          case 'adult':
            if (age <= 1 || age > 7) return false;
            break;
          case 'senior':
            if (age <= 7) return false;
            break;
        }
      }

      // Size filter
      if (state.filters.size !== 'any' && pet.size?.toLowerCase() !== state.filters.size.toLowerCase()) {
        return false;
      }

      // Gender filter
      if (state.filters.gender !== 'any' && pet.gender?.toLowerCase() !== state.filters.gender.toLowerCase()) {
        return false;
      }
      return true;
    });
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

  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('PetuserToken');
    const storedAdmin = localStorage.getItem('PetUser');

    if (storedToken && storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setToken(storedToken);
        setUser(parsedAdmin);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse admin user data', error);
        // Clear invalid data
        localStorage.removeItem('PetuserToken');
        localStorage.removeItem('PetUser');
      }
    }
  }, []);

  // Route protection logic
  useEffect(() => {
    // Redirect to login if trying to access protected routes without authentication
    // if (!isAuthenticated && location !== '/' && !location.includes('/owner/login')) {
    //   toast({
    //     title: 'Authentication Required',
    //     description: 'Please log in to access the app.',
    //     variant: 'destructive',
    //   });
    //   setLocation('/');
    // }
  }, [location, isAuthenticated, toast, setLocation]);

  const login = (newToken: string, newUser: Owner) => {
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    
    // Store in localStorage
    localStorage.setItem('PetuserToken', newToken);
    localStorage.setItem('PetUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Remove from localStorage
    localStorage.removeItem('PetuserToken');
    localStorage.removeItem('PetUser');
    
    // Redirect to login using wouter
    setLocation('/admin/login');
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
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
    getPetsForOwner,
    login,
    logout,
    user, 
    token, 
    isAuthenticated, 
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