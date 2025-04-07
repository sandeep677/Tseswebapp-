"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import styles from "./change-password.module.css";
import axios from 'axios';
import verifyuser from '../context/authentication.js';

export default function ChangePasswordPage() {
  useEffect(() => {
    verifyuser();
  }, []);

  const navigate = useNavigate();
  const { user,logout } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate old password
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
    }
    
    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    
    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status
    setStatus({ message: "", type: "" });
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Make API call to change password
      const response = await axios.post(
        "http://localhost:8000/change-password",
        {
          userId: user.id,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        { withCredentials: true }
      );
      
      if(response.status===200){
      setStatus({
        message: "Password changed successfully!",
        type: "success"
      })
        setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setTimeout(() => {
        navigate("/");
        logout();
      }, 1000);
      
      };
      
      if(response.status===400){
        setStatus({
          message: "Failed to change password. Please try again.",
          type: "error"
        });
      }
      
    } catch (error) {
      // Handle error
      console.error("Error changing password:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setStatus({
          message: error.response.data.message,
          type: "error"
        });
      } else {
        setStatus({
          message: "Failed to change password. Please try again.",
          type: "error"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.changePasswordPage}>
      <div className={styles.changePasswordCard}>
        <h1>Change Password</h1>
        
        {status.message && (
          <div className={`${styles.statusMessage} ${styles[status.type]}`}>
            {status.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.changePasswordForm}>
          <div className={styles.formGroup}>
            <label htmlFor="oldPassword">Current Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              className={errors.oldPassword ? styles.inputError : ""}
            />
            {errors.oldPassword && (
              <span className={styles.errorText}>{errors.oldPassword}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              className={errors.newPassword ? styles.inputError : ""}
            />
            {errors.newPassword && (
              <span className={styles.errorText}>{errors.newPassword}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              className={errors.confirmPassword ? styles.inputError : ""}
            />
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}