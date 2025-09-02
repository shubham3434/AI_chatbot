import express from'express';
import { generate } from './chatbot.js';
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('i am a server for gen ai')
})

app.post('bobby/ai/assistant/chat',async(req,res)=>{

      

      const {message,threadId} = req.body;

       if(!message || !threadId){
        console.log("all fields are required");

        return res.status(400).json({message:"All Fields are Required...!!!"});
       }
      console.log("message",message);
      console.log("threadId",threadId);
       
     const result =  await generate(message,threadId);

      res.json({message:result});

      console.log("result ai:-",result);
})


app.listen(port, () => {
  console.log(` server is running on port ${port}`)
})
