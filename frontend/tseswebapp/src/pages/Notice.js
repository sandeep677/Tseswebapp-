"use client"

import { useState ,useEffect } from "react"
import { useAuth } from "../context/auth-context.js"
import styles from "../components/notice/notice.module.css"
import NoticeForm from "../components/NoticeForm"
import verifyuser from '../context/authentication.js'
import axios from 'axios'

export default function NoticePage() {

const [noticedata,setNoticeData]=useState(null);
const [notices, setNotices] = useState([])
  
async function getnoticedata(){
  try{
  const response = await axios.get("http://localhost:8000/getnoticedata")
  if (Array.isArray(response.data)){
  setNoticeData(response.data)
  }
  }catch(err){
    console.log(err)
  }
}

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
 

 useEffect(()=>{
  async function data(){
   await getnoticedata()
  }
  data();
  },[])

useEffect(()=>{
  if(noticedata !== null && Array.isArray(noticedata)){
  setNotices(noticedata);
}
},[noticedata])

  const { user } = useAuth()

  const addNotice = async(notice) => {
    setNotices([...notices, { ...notice, id: Number(notices[0].id) + 1}])
    const senddata={...notice};
    try{
   const postnotice= await axios.post("http://localhost:8000/addnotice",senddata)
    }catch(error){console.log(error)}
  }

  const removeNotice = async(id) => {
    setNotices(notices.filter((notice) => notice.id !== id))
    
    const sendid={id}
    
    try{
    const deletenotice=await axios.post(
  "http://localhost:8000/deletenotice",sendid)
    }catch(error){console.log(error)}
  }


  return (
    <div className={styles.noticePage}>
      <h1>School Notices</h1>

      {user && (user.role === "admin" || user.role === "teacher") && <NoticeForm onSubmit={addNotice} />}

      <div className={styles.noticeList}>
        {Array.isArray(notices)&&notices.map((notice) => (
          <div key={notice.id} className={styles.noticeCard}>
            <div className={styles.noticeHeader}>
              <h2>{notice.title}</h2>
              <span className={styles.noticeDate}>{new Date(notice.date).toLocaleDateString()}</span>
            </div>
            <p>{notice.content}</p>

            {user && (user.role === "admin" || user.role === "teacher") && (
              <button className="btn btn-danger" onClick={() => removeNotice(notice.id)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

