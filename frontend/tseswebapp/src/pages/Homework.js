"use client"

import { useState ,useEffect } from "react"
import { useAuth } from "../context/auth-context.js"
import styles from "../components/homework/homework.module.css"
import HomeworkForm from "../components/HomeworkForm"
import { useNavigate } from "react-router-dom"
import verifyuser from '../context/authentication.js'
import axios from 'axios'

export default function HomeworkPage() {
  const navigate = useNavigate();
  
 
const[verifydata,setVerifyData]=useState(null)
 const {login}=useAuth();

async function verifytheuser(){
  try{
  const verify=await verifyuser()
  setVerifyData(verify);
  }catch(err){
    console.log(err)
  }
  }
  
  useEffect(()=>{
   verifytheuser()
  },[])
  
 useEffect(()=>{
    if(verifydata!==null){
      login(verifydata.data.data)
    }
  },[verifydata])
  
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedClass, setSelectedClass] = useState("Class 1")
  
  const [homeworkdata,setHomeworkData]=useState()
  const [homework, setHomework] = useState([
    {description:"no homework"}
    ])

async function gethomeworkdata(year,date){
  const senddata={year,date}
  try{
  const response = await axios.post(
"http://localhost:8000/gethomeworkdata",senddata)
  setHomeworkData(response.data)
  }catch(err){
    console.log(err)
  }
}

useEffect(()=>{
  async function getdata(){
    await gethomeworkdata(selectedClass,selectedDate)
  }
  getdata();
},[selectedClass,selectedDate])

useEffect(()=>{
  if(homeworkdata !== null && Array.isArray(homeworkdata) ){
  setHomework(homeworkdata);
}
},[homeworkdata])
  

  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"]

  const addHomework = async(newHomework) => {
    setHomework([...homework, { ...newHomework, id: homework[0].id + 1 }])
    const senddata={...newHomework}
    try{
    const response= await axios.post("http://localhost:8000/addhomework",senddata)
    }catch(err){console.log(err)}
  }

  const removeHomework = async(id) => {
    setHomework(homework.filter((hw) => hw.id !== id))
    const senddata={id}
    try{
      const response=await axios.post("http://localhost:8000/deletehomework",senddata)
    }catch(error){console.log(error)}
  }

  return (
    <div className={styles.homeworkPage}>
      <h1>Homework Management</h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="class">Class:</label>
          <select id="class" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {user && (user.role === "admin" || user.role === "teacher") && (
        <HomeworkForm onSubmit={addHomework} classes={classes} />
      )}

      <div className={styles.tableContainer}>
        <table className={styles.homeworkTable}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Description</th>
              <th>Assigned Date</th>
              <th>Due Date</th>
              {user && (user.role === "admin" || user.role === "teacher") && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {homework.map((hw) => (
              <tr key={hw.id}>
                <td>{hw.subject}</td>
                <td>{hw.description}</td>
                <td>{new Date(hw.assignedDate).toLocaleDateString()}</td>
                <td>{new Date(hw.dueDate).toLocaleDateString()}</td>
                {user && (user.role === "admin" || user.role === "teacher") && (
                  <td>
                    <button className="btn btn-danger" onClick={() => removeHomework(hw.id)}>
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {homework.length === 0 && (
              <tr>
                <td
                  colSpan={user && (user.role === "admin" || user.role === "teacher") ? 5 : 4}
                  className={styles.noData}
                >
                  No homework found for the selected class and date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

