"use client"

import { createContext, useContext, useState } from "react"
import axios from 'axios'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (userinfo) => {
    setUser(userinfo) // Directly set the user ID
  }

  const logout = () => {
    setUser(null)
   async function cookieremove(){
    const response = await axios.get(
      "http://localhost:8000/logout",
      { withCredentials: true }
    )
  };
  cookieremove();
  }

  return <AuthContext.Provider value={{ user, login, logout}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

