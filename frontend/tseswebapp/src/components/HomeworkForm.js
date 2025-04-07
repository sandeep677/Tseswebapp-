"use client"

import { useState } from "react"
import styles from "./homework-form.module.css"

export default function HomeworkForm({ onSubmit, classes }) {
  const [formData, setFormData] = useState({
    class: "Class 1",
    subject: "",
    description: "",
    assignedDate: new Date().toISOString().split("T")[0],
    dueDate: "",
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
      ...formData,
      subject: "",
      description: "",
      dueDate: "",
    })
  }

  return (
    <div className={styles.homeworkForm}>
      <h2>Add New Homework</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="class">Class</label>
            <select id="class" name="class" value={formData.class} onChange={handleChange} required>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Enter subject"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter homework description"
            rows={3}
          ></textarea>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="assignedDate">Assigned Date</label>
            <input
              type="date"
              id="assignedDate"
              name="assignedDate"
              value={formData.assignedDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dueDate">Due Date</label>
            <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Homework
        </button>
      </form>
    </div>
  )
}

