"use client"

import { useState } from "react"
import styles from "./notice-form.module.css"

export default function NoticeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <div className={styles.noticeForm}>
      <h2>Add New Notice</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter notice title"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Enter notice content"
            rows={4}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Notice
        </button>
      </form>
    </div>
  )
}

