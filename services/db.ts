
import { AIPersona, User } from '../types';

const USERS_KEY = 'faces_of_ai_database_users';
const PERSONAS_KEY = 'faces_of_ai_database_personas';
const ACTIVE_USER_KEY = 'faces_of_ai_session_user';

/**
 * Persistence Layer - Local Database Service
 * Handles all CRUD operations for the application.
 */
export const db = {
  // User Management
  saveUser: (user: User) => {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    const allUsers = db.getAllUsers();
    if (!allUsers.find(u => u.email === user.email)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([...allUsers, user]));
    }
  },

  getActiveUser: (): User | null => {
    const u = localStorage.getItem(ACTIVE_USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  getAllUsers: (): User[] => {
    const u = localStorage.getItem(USERS_KEY);
    return u ? JSON.parse(u) : [];
  },

  logout: () => {
    localStorage.removeItem(ACTIVE_USER_KEY);
  },

  // Persona/Project Management
  savePersona: (persona: AIPersona) => {
    const all = db.getAllPersonas();
    const index = all.findIndex(p => p.id === persona.id);
    if (index > -1) {
      all[index] = persona;
    } else {
      all.push(persona);
    }
    localStorage.setItem(PERSONAS_KEY, JSON.stringify(all));
  },

  getAllPersonas: (): AIPersona[] => {
    const p = localStorage.getItem(PERSONAS_KEY);
    return p ? JSON.parse(p) : [];
  },

  getUserPersonas: (email: string): AIPersona[] => {
    return db.getAllPersonas().filter(p => p.creatorEmail === email);
  },

  deletePersona: (id: string) => {
    const all = db.getAllPersonas().filter(p => p.id !== id);
    localStorage.setItem(PERSONAS_KEY, JSON.stringify(all));
  },

  updatePersonaKnowledge: (id: string, newFact: string) => {
    const all = db.getAllPersonas();
    const index = all.findIndex(p => p.id === id);
    if (index > -1) {
      all[index].knowledgeBase.push(newFact);
      localStorage.setItem(PERSONAS_KEY, JSON.stringify(all));
    }
  }
};
