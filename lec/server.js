import express from'express';
import { generate } from './chatbot.js';
import cors from 'cors'
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('i am a server for gen ai')
})

app.post('/chat',async(req,res)=>{
      const {message,threadId} = req.body;
       if(!message || !threadId){
        console.log("all fields are required");
        return res.status(400).json({message:"All Fields are Required...!!!"});
       }
      const result =  await generate(message,threadId);
      res.json({message:result});
})


app.listen(port, () => {
  console.log(` server is running on port ${port}`)
})
