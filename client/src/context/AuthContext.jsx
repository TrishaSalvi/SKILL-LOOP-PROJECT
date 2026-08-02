import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import socket from "../socket.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("skillloopToken");

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("skillloopToken");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("join-user", user._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    localStorage.setItem("skillloopToken", data.token);
    setUser(data.user);
    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    localStorage.setItem("skillloopToken", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("skillloopToken");
    setUser(null);
    socket.disconnect();
  };

  const value = useMemo(
    () => ({ user, setUser, loading, register, login, logout, isAuthenticated: Boolean(user) }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
