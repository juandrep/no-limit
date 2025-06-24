"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  JSX,
} from "react";

import React from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  favoriteStations: string[];
  listeningHistory: Array<{
    stationId: string;
    timestamp: string;
    duration: number;
  }>;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("no-limit-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("no-limit-user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user exists in localStorage (mock database)
      const users = JSON.parse(localStorage.getItem("no-limit-users") || "[]");
      const existingUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!existingUser) {
        throw new Error("Invalid credentials");
      }

      const userData: User = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        avatar: existingUser.avatar,
        createdAt: existingUser.createdAt,
        favoriteStations: existingUser.favoriteStations || [],
        listeningHistory: existingUser.listeningHistory || [],
      };

      setUser(userData);
      localStorage.setItem("no-limit-user", JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("no-limit-users") || "[]");
      const existingUser = users.find((u: any) => u.email === email);

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In real app, this would be hashed
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          name
        )}`,
        createdAt: new Date().toISOString(),
        favoriteStations: [],
        listeningHistory: [],
      };

      // Save to mock database
      users.push(newUser);
      localStorage.setItem("no-limit-users", JSON.stringify(users));

      // Set current user
      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
        favoriteStations: newUser.favoriteStations,
        listeningHistory: newUser.listeningHistory,
      };

      setUser(userData);
      localStorage.setItem("no-limit-user", JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("no-limit-user");
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("no-limit-user", JSON.stringify(updatedUser));

      // Update in mock database
      const users = JSON.parse(localStorage.getItem("no-limit-users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data };
        localStorage.setItem("no-limit-users", JSON.stringify(users));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
