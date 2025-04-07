"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/auth-context";
import styles from "../components/attendance/attendance.module.css";
import verifyuser from '../context/authentication.js';
import axios from 'axios';

export default function AttendancePage(){
  
  const [verifydata, setVerifyData] = useState(null);
  const { login, user } = useAuth();

  async function verifytheuser(){
    try {
      const verify = await verifyuser();
      setVerifyData(verify);
    } catch(err) {
      console.log(err);
    }
  }
 
  useEffect(() => {
    verifytheuser();
  }, []);
  
  useEffect(() => {
    if(verifydata !== null){
      login(verifydata.data.data);
    }
  }, [verifydata, login]);

  const [selectedClass, setSelectedClass] = useState("Class 1");
  const [saveStatus, setSaveStatus] = useState("");
  
  // Students state with only total present days
  const [students, setStudents] = useState([]);
  const [studentdata, setStudentData] = useState([]);
  
  useEffect(() => {
    async function getdata(year) {
      try {
        const senddata = { year };
        const response = await axios.post("http://localhost:8000/getstudentattendance", senddata);
        setStudentData(response.data[0]);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }
    getdata(selectedClass);
  }, [selectedClass]);
  
  
  useEffect(() => {
    if(studentdata !== null && Array.isArray(studentdata)){
      setStudents(studentdata);
    }
  }, [studentdata]);

  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

  // Update attendance status and total present days
  const markAttendance = (studentId, status) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          let newTotalPresentDays = student.totalPresentDays || 0;
          
          if (student.status === "present" && status !== "present") {
            // Decrement if changing from present to absent
            newTotalPresentDays = Math.max(0, newTotalPresentDays - 1);
          } else if (student.status !== "present" && status === "present") {
            // Increment if changing to present
            newTotalPresentDays = newTotalPresentDays + 1;
          }
          
          return {
            ...student,
            status: status,
            totalPresentDays: newTotalPresentDays
          };
        }
        return student;
      })
    );
  };

  // Get current attendance status
  const getAttendanceStatus = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student?.status || "";
  };

  // Get total present days
  const getTotalPresentDays = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student?.totalPresentDays || 0;
  };

  // Save attendance data
  const saveAttendanceData = async () => {
    try {
      const presentstudent=[];
      const absentstudent=[];
      for(let i =0; i < students.length; i++){
        if(students[i].status==="present"){
          presentstudent.push({id:students[i].id ,status:students[i].status })
        }
        if(students[i].status==="absent"){
          absentstudent.push({id:students[i].id,status:students[i].status})
        }
      }
      const senddata={
        year:selectedClass,
        presentstudents:presentstudent,
        absentstudents:absentstudent
      }
       const response=await axios.post("http://localhost:8000/updateattendance",senddata);
      if(response.status===200){
      setSaveStatus("Attendance data saved successfully!");
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
      }
      if(response.status===400){
        setSaveStatus("Error saving attendance , try again later")
        setTimeout(() => {
        setSaveStatus("");
      }, 3000);
      }
      
    } catch (error) {
      console.error("Error saving attendance data:", error);
      setSaveStatus("Error saving attendance data. Please try again.");
      
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    }
  };

  return (
    <div className={styles.attendancePage}>
      <h1>Attendance Management</h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="class">Class:</label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveStatus && (
        <div className={styles.saveStatus}>
          {saveStatus}
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Status</th>
              {user && (user.role === "admin" || user.role === "teacher") && (
                <>
                  <th>Total Present Days</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>
                    {getAttendanceStatus(student.id) === "present" ? (
                      <span className={styles.present}>Present</span>
                    ) : getAttendanceStatus(student.id) === "absent" ? (
                      <span className={styles.absent}>Absent</span>
                    ) : (
                      <span className={styles.unmarked}>Not marked</span>
                    )}
                  </td>
                  {user && (user.role === "admin" || user.role === "teacher") && (
                    <>
                      <td className={styles.totalDays}>
                        {getTotalPresentDays(student.id)} days
                      </td>
                      <td className={styles.actions}>
                        <button
                          className={`btn btn-success ${getAttendanceStatus(student.id) === "present" ? "active" : ""}`}
                          onClick={() => markAttendance(student.id, "present")}
                        >
                          Present
                        </button>
                        <button
                          className={`btn btn-danger ${getAttendanceStatus(student.id) === "absent" ? "active" : ""}`}
                          onClick={() => markAttendance(student.id, "absent")}
                        >
                          Absent
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user && (user.role === "admin" || user.role === "teacher") ? 4 : 2} className={styles.noData}>
                  No students found for this class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {user && (user.role === "admin" || user.role === "teacher") && students.length > 0 && (
        <div className={styles.saveButtonContainer}>
          <button 
            className="btn btn-primary" 
            onClick={saveAttendanceData}
            style={{ marginTop: '20px', padding: '10px 20px' }}
          >
            Save Attendance Data
          </button>
        </div>
      )}
    </div>
  );
}