import 'dotenv/config';
import Groq from "groq-sdk/index.mjs";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


async function main() {
    const completions=await groq.chat.completions.create({
        temperature:1,
        max_tokens:200,
        model:"llama-3.3-70b-versatile",
        messages:[
            {
                role:"user",
                content:"hii how are you?"
            },
            {
                role:"assistant",
                content:"you are Jarvish a personal assistant to understand sentiments and feeling of user and help him anyhow possible"
            }
        ]
    })
    console.log(completions.choices[0].message.content);
}

main();