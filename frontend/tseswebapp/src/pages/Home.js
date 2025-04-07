import { Link } from "react-router-dom"
import styles from "../components/page.module.css"
import {useState,useEffect} from 'react'
import verifyuser from '../context/authentication.js'
import { useAuth } from "../context/auth-context.js"

export default function Home() {
  
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
   verifytheuser();
  },[])
  
  useEffect(()=>{
    if(verifydata!==null){
      login(verifydata.data.data)
    }
  },[verifydata])
  
  
  return (
    <div className={styles.home}>
      <h1>Welcome to School App</h1>
      <p>Your one-stop solution for school management</p>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h2>Notices</h2>
          <p>Stay updated with the latest announcements and notices from school.</p>
          <Link to="/notice" className="btn btn-primary">
            View Notices
          </Link>
        </div>

        <div className={styles.feature}>
          <h2>Attendance</h2>
          <p>Track and manage student attendance with ease.</p>
          <Link to="/attendance" className="btn btn-primary">
            Manage Attendance
          </Link>
        </div>

        <div className={styles.feature}>
          <h2>Homework</h2>
          <p>Assign and track homework for different classes.</p>
          <Link to="/homework" className="btn btn-primary">
            View Homework
          </Link>
        </div>
      </div>
    </div>
  )
}

