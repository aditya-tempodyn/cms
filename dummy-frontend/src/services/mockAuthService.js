import { mockUser } from '../data/mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock credentials for demo
const mockCredentials = {
  username: 'demo_user',
  password: 'demo123',
  email: 'demo@example.com'
};

export const authService = {
  login: async (credentials) => {
    await delay();
    
    // Simple validation for demo
    if (credentials.username === mockCredentials.username && 
        credentials.password === mockCredentials.password) {
      
      const token = 'mock-jwt-token-' + Date.now();
      
      return {
        success: true,
        data: {
          token,
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          roles: mockUser.roles
        }
      };
    } else {
      throw {
        response: {
          data: {
            message: 'Invalid username or password'
          }
        }
      };
    }
  },

  register: async (userData) => {
    await delay();
    
    // Basic validation
    if (!userData.username || userData.username.length < 3) {
      throw {
        response: {
          data: {
            message: 'Username must be at least 3 characters long'
          }
        }
      };
    }
    
    if (!userData.password || userData.password.length < 6) {
      throw {
        response: {
          data: {
            message: 'Password must be at least 6 characters long'
          }
        }
      };
    }
    
    if (!userData.email || !userData.email.includes('@')) {
      throw {
        response: {
          data: {
            message: 'Please enter a valid email address'
          }
        }
      };
    }

    // Simulate successful registration
    return {
      success: true,
      message: 'Registration successful! You can now log in with username: demo_user and password: demo123'
    };
  },

  logout: async () => {
    await delay(200);
    // Mock logout - just simulate the API call
    return { success: true };
  }
}; 