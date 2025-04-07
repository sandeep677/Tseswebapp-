"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/auth-context.js"
import styles from "../components/login/login.module.css"
import axios from 'axios'


export default function LoginPage() {
  const navigate = useNavigate()
  const { login , setCookie, cookie} = useAuth()
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError("")
    const userinfo={
       id:formData.id,
       password:formData.password
    }
    // Simple validation
    if (!formData.id || !formData.password) {
      setError("Please enter both id and password")
      return
    }
    try{
    const res=await axios.post(
      "http://localhost:8000/login" ,userinfo,{ withCredentials: true })
      
       if(res.status === 200){
       login(res.data[0])
        navigate('/')
         setCookie(res.data[0].cookie)
}
       else{
       setError("Invalid ID or password")
       }
    
    }catch(error){
      setError("database or client error")
      console.log(error)
    }
   }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1>Login</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Id</label>
            <input
              type="number"
              id="username"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Enter your id"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

