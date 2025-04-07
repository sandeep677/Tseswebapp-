import axios from 'axios'

export default async function verifyuser(){
  
  try{
   const response = await axios.get("http://localhost:8000/verifyuser",{ withCredentials: true })
     if (response.status!==200){
        console.log('cookie not verified')

     }

     return response
  }catch(err){
    console.error(err)
    return null
  }
   }
   
   
