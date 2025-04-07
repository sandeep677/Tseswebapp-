const express=require("express");
const mysql=require("mysql2/promise");
const bcrypt=require("bcryptjs");
const cors=require("cors");
const jwt= require("jsonwebtoken");
const app=express();
const env=require("dotenv");
env.config();
const cookieParser=require('cookie-parser');

const port =process.env.PORT;
const jwtkey=process.env.JWTKEY;



const db= mysql.createPool({
  host:process.env.HOST,
  port:process.env.DBPORT,
  user:process.env.USER,
  password:process.env.DBPASSWORD,
  database:process.env.DATABASE,
  waitForConnections:false,
  connectionLimit:850,  
  queueLimit:0
});


app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(express.json());
app.use(cookieParser(jwtkey));

 


app.get("/getnoticedata",async(req,res)=>{
  try{
  const [noticedata]=await db.query("select * from notice_info order by id desc limit 5;")
  return res.send(noticedata)
  }catch(err){
    return res.send(err)
  }
})

app.post("/login",async (req,res)=>{
  const id=Number(req.body.id);
  const password=req.body.password;

  function createjwttoken(user_info){
  const token = jwt.sign(user_info,jwtkey)
  return token;
}

 

  async function checklogininfo(id , pass){
const [check] =await db.query("select * from login_info where id = ? ;" , [id]
)

   let checkedid;
   let user_info=check[0];
   let checkedpass=user_info.passwords;
   
   let hashcheck=await bcrypt.compare(password,checkedpass)   
  
   if(check.length===0){
        return  false;
   }
   else{
   checkedid=check[0].id;
   if(!hashcheck){
     return false;
   }
   
   if (checkedid>800){
     const assigntoken=createjwttoken(user_info)
     
    const modifiedcheck=check.map(item=>({
   ...item,
   role:"teacher",
   cookie:assigntoken
   }))

user_info.role="teacher"
     return {
     response:true , 
     role:"teacher",
     data:modifiedcheck,
     authtoken:assigntoken
     }
   }
   else{
     const assigntoken=createjwttoken(user_info)
    const modifiedcheck=check.map(item=>({
   ...item,
   role:"student",
   cookie:assigntoken
   }))
   
   user_info.role="student"

   return {
   response:true , 
   role:"student",
   data:modifiedcheck,
   authtoken:assigntoken
   };
   }
   }

}


  try{
  const isvalid = await checklogininfo(id,password)

  if (isvalid.response){
  const authtoken=isvalid.authtoken;
  const senddata=isvalid.data
  res.cookie("authToken",authtoken,{
   httpOnly:true,
   signed:true,
   maxAge:7*24*60*60*1000,
   path:"/",
  })
 return res.status(200).json(isvalid.data)
  }

  else{
   return res.status(404).send("incorrect info")
  }
  } catch(err){
   return res.status(500).send(err)
  }
  
})

app.get("/verifyuser",async (req,res)=>{
  const usercookie=req.signedCookies.authToken;
  if (!usercookie){
    return res.status(200).send("please login");
  }
  
  async function verification(cookie){
    try{
    const verify= await jwt.verify(cookie,jwtkey)
    return {response:true,data:verify}
    }catch(err){
     return false;
    }
  }
  try{
  const iscookievalid= await verification(usercookie)
  
  if(iscookievalid && iscookievalid.data && iscookievalid.data.id>800){
    iscookievalid.data.role="teacher"
  }
   
    if(iscookievalid.data && iscookievalid.data && iscookievalid.data.id<800){
      iscookievalid.data.role="student"
    }
  
  
  if (iscookievalid){return res.status(200).json(iscookievalid)}
  
  else{return res.status(400).send("incorrect cookie")}
  
  }catch(err){
  return res.status(400).send(err)
  }
})

app.get("/logout",async (req,res)=>{
await res.clearCookie('authToken',{
  httpOnly:true,
   signed:true,
   path:"/"
  })
  
  return res.status(200).send("cookie successfully removed")
})

app.post("/addnotice", async(req,res)=>{
  const title=req.body.title;
  const content=req.body.content;
  const date=req.body.date;
  
  try{
  const result= await db.query(
    "insert into notice_info(title,content,date) values(?,?,?);",[title,content,date]
    )
    return res.status(200).send("successfully created")
  }catch(err) {return res.send(err)};
})

app.post("/deletenotice",async(req,res)=>{
   const id=req.body.id;
   try{
     const response=await db.query(
       "delete from notice_info where id=?;",[id]
       )
       return res.status(200).send("successfully removed")
   }catch(error){console.log(error)}
})

app.post("/gethomeworkdata",async(req,res)=>{
  const splityear=req.body.year.split(" ")
  const year=Number(splityear[1]);
  const date=String(req.body.date);

  try{
  const [response]= await db.query("select * from homework where class = ? and assignedDate = ? order by assignedDate limit 7;",[year,date])
  return res.status(200).json(response)
  }catch(err){res.send(err)}
})

app.post("/addhomework",async(req,res)=>{
   const splityear=req.body.class.split(" ")
  const year=Number(splityear[1]);
  const subject=req.body.subject;
  const description=req.body.description;
  const dueDate=req.body.dueDate;
  const assignedDate=req.body.assignedDate;
  try{
    const response=db.query("insert into homework(class,subject,description,dueDate,assignedDate) values(?,?,?,?,?)",[year,subject,description,dueDate,assignedDate])
    res.status(200).send("successfully created")
  }catch(error){res.send(error)}
})

app.post("/deletehomework",async(req,res)=>{
  const id=Number(req.body.id);
  try{
    const response=await db.query("delete from homework where id = ?",[id])
    res.send("successfully removed")
  }catch(err){res.send(err)}
})


app.post("/change-password",async(req,res)=>{
  const id=req.body.userId;
  const oldpass=req.body.oldPassword;
  const newpass=req.body.newPassword;
  
  const usercookie=req.signedCookies.authToken;
  if (!usercookie){
    return res.status(200).send("please login");
  }
  
  async function verification(cookie){
    try{
    const verify= await jwt.verify(cookie,jwtkey)
    return {response:true,data:verify}
    }catch(err){
     return false;
    }
  }
  
  const iscookievalid=await verification(usercookie);
  if(iscookievalid && iscookievalid.data &&iscookievalid.response===true){
    const hashcheck= await bcrypt.compare(oldpass,iscookievalid.data.passwords)
    if(hashcheck===false){
      return res.status(404).send("wrong old password")
    }
    if (hashcheck){
      const newhashpass=await bcrypt.hash(newpass,12)
      
      async function changepass(){
        try{
        const response = await db.query("update login_info set passwords = ? where id = ?",[newhashpass,id])
        return true;
        }catch(err){return false}
      }
      
      const passchange=await changepass()
      if(passchange===true){
        return res.status(200).send("password changed")
      }
      else{
        return res.status(400).send("error")
      }
    }
  }
})

app.post("/getstudentattendance",async(req,res)=>{
  const splityear=req.body.year.split(" ")
  const year=Number(splityear[1]);
  try{
    const response=await db.query(" select * from attendance where class = ?",[year])
    res.status(200).json(response)
  }catch(err){res.send(err)}
})

app.post("/updateattendance", async (req, res) => {
  const splityear = req.body.year.split(" ");
  const year = Number(splityear[1]);
  const presentstudents = req.body.presentstudents || [];
  const absentstudents = req.body.absentstudents || [];

  const presentids = presentstudents.map(s => s.id);
  const absentids = absentstudents.map(s => s.id);
  const allIds = [...presentids, ...absentids];

  try {
    const [rows] = await db.query("SELECT id, status FROM attendance WHERE id IN (?) AND class = ?", [allIds, year]);

    const currentStatusMap = {};
    rows.forEach(row => {
      currentStatusMap[row.id] = row.status;
    });

    for (let id of presentids) {
      const oldStatus = currentStatusMap[id];
      if (oldStatus === 'absent') {
        await db.query("UPDATE attendance SET status='present', totalPresentDays = totalPresentDays + 1 WHERE id = ? AND class = ?", [id, year]);
      } else if (oldStatus !== 'present') {
        await db.query("UPDATE attendance SET status='present' WHERE id = ? AND class = ?", [id, year]);
      }
    }

    for (let id of absentids) {
      const oldStatus = currentStatusMap[id];
      if (oldStatus === 'present') {
        await db.query("UPDATE attendance SET status='absent', totalPresentDays = totalPresentDays - 1 WHERE id = ? AND class = ?", [id, year]);
      } else if (oldStatus !== 'absent') {
        await db.query("UPDATE attendance SET status='absent' WHERE id = ? AND class = ?", [id, year]);
      }
    }

    return res.status(200).send("Successfully updated");
  } catch (err) {
    console.error("Error in attendance update:", err);
    return res.status(400).send("Error updating attendance");
  }
});

app.listen(port,(err)=>{
  if(err){
  console.error(err)
  }
  else{
    console.log(`server started at port ${port}`);
  }
}
)
