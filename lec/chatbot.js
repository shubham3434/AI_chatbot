import 'dotenv/config';

import readline from "node:readline/promises";

import { tavily } from "@tavily/core";
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });


import Groq from "groq-sdk/index.mjs";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

import NodeCache from "node-cache" ;
const Cache = new NodeCache({stdTTL:60*60*24});  // for 24 hrs cache memory


export async function generate(userMessage,threadId) {


    const  baseMessages=[
        {
            role:"system",
            content:`you are jarvish a smart personal assistant who can answers asked questions and 
            you have access to the following functions :-1.webSearch({query}:{query:string})  //Search the latest information and realtime data from the internet
            current date and time: ${new Date().toUTCString()} 
            when user ask for webSearch then don't return query <function=webSearch{"query": "joke of the day"}</function> like this go for web searach and give the answer`
        },
        // {
        //     role:"user",
        //     content:`current weather in bhopal`
        //     //`when was the i phone 16 launched?`
        // }
    ]

   
    const messages = Cache.get(threadId)?? baseMessages;

        messages.push({

            role:`user`,
            content:userMessage
        })


        const MAX_RETRIES=10;
        let count =0;
   while(true){

    if(count > MAX_RETRIES){

      return "Sorry ! I could not give the result Pleas Try Again";
    }
    count++;

    const completions=await groq.chat.completions.create({
        temperature:0,
        max_tokens:500,
        // model:"llama-3.3-70b-versatile",
        model:"openai/gpt-oss-20b",
        messages:messages,
        "tools": [
            {
              "type": "function",
              "function": {
                "name": "webSearch",
                "description": "Search the latest information and realtime data from the internet",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "query": {
                      "type": "string",
                      "description": "the query to perform the search on the internet"
                    },
                  },
                  "required": ["query"]
                }
              }
            }
          ],
          "tool_choice": "auto",
    })

  messages.push(completions.choices[0].message);

const toolCalls=completions.choices[0].message.tool_calls;

if(!toolCalls){

    Cache.set(threadId,messages);
     console.log("cache:-",Cache);
    return completions.choices[0].message.content;
    
}

for(const tool of toolCalls){
//    console.log("tool call:-",tool);
   const functionName=tool.function.name;
   const fuctionParams= tool.function.arguments;

   if(functionName==="webSearch"){
        const toolResult= await webSearch(JSON.parse(fuctionParams));
        // console.log("tool result:-",toolResult);

        messages.push({
            role:"tool",
            content:toolResult,
            tool_call_id:tool.id,
            name:functionName
        })
   }
}

}
  }





async function webSearch({query}){
    console.log("webSearch calling.....");
      
    const results=await tvly.search(query);
    const finalResults=results.results.map(result=>result.content).join("\n\n");
   // console.log("WebSearch results:-",finalResults);
    return finalResults;
}