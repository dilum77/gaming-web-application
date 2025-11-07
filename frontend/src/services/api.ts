const API_BASE_URL = 'https://marcconrad.com/uob/banana';
const BACKEND_API_URL = 'http://localhost:5000/api';

// ==================== INTERFACES ====================

export interface PuzzleData {
  question: string;
  solution: number;
}

export interface User {
  id: string;
  username: string;
  highScore: number;
  totalGamesPlayed: number;
  createdAt?: string;
  lastPlayed?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface ScoreSubmission {
  score: number;
  level: 'Easy' | 'Medium' | 'Hard';
  timeRemaining: number;
  puzzlesSolved: number;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  level: string;
  playedAt: string;
  timeRemaining: number;
  puzzlesSolved: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: {
    leaderboard: LeaderboardEntry[];
    count: number;
  };
}

export interface ScoreSubmitResponse {
  success: boolean;
  message: string;
  data?: {
    score: any;
    isNewHighScore: boolean;
  };
}

// ==================== HELPER FUNCTIONS ====================

// Get JWT token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set JWT token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove JWT token from localStorage
const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

// Get auth headers with JWT token
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ==================== BANANA PUZZLE API ====================

export const bananaApi = {
  // Fetch a new puzzle from the Banana API
  getPuzzle: async (): Promise<PuzzleData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api.php`);
      if (!response.ok) {
        throw new Error('Failed to fetch puzzle');
      }
      const data = await response.json();
      return {
        question: data.question || `${API_BASE_URL}/${data.question}`,
        solution: data.solution,
      };
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      throw error;
    }
  },

  // Validate the user's guess
  checkAnswer: (userGuess: number, correctAnswer: number): boolean => {
    return userGuess === correctAnswer;
  },
};

// ==================== BACKEND API - AUTHENTICATION ====================

export const authApi = {
  // Register a new user
  register: async (username: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        setToken(data.data.token);
      }

      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      return {
        success: false,
        message: 'Failed to connect to server',
      };
    }
  },

  // Login existing user
  login: async (username: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        setToken(data.data.token);
      }

      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      return {
        success: false,
        message: 'Failed to connect to server',
      };
    }
  },

  // Get current user info
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return {
        success: false,
        message: 'Failed to get user info',
      };
    }
  },

  // Logout user
  logout: (): void => {
    removeToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

// ==================== BACKEND API - LEADERBOARD ====================

export const leaderboardApi = {
  // Submit a new score
  submitScore: async (scoreData: ScoreSubmission): Promise<ScoreSubmitResponse> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/leaderboard/score`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scoreData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting score:', error);
      return {
        success: false,
        message: 'Failed to submit score',
      };
    }
  },

  // Get top scores (leaderboard)
  getTopScores: async (limit: number = 20, level?: string): Promise<LeaderboardResponse> => {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (level) params.append('level', level);

      const response = await fetch(`${BACKEND_API_URL}/leaderboard/top?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return {
        success: false,
        data: { leaderboard: [], count: 0 },
      };
    }
  },

  // Get user's score history
  getMyScores: async (limit: number = 10): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/leaderboard/my-scores?limit=${limit}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting my scores:', error);
      return {
        success: false,
        data: { scores: [], count: 0 },
      };
    }
  },

  // Get leaderboard statistics
  getStats: async (): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/leaderboard/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        success: false,
        data: {},
      };
    }
  },
};

// ==================== EXPORTS ====================

export default bananaApi;
