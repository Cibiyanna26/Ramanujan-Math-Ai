// import { NextApiRequest, NextApiResponse } from "next";

import { NextRequest, NextResponse } from "next/server";

import Groq from "groq-sdk";
import { NextApiResponse } from "next";

const groq = new Groq({ apiKey: process.env.ORQ_TEXT_GENERATION_KEY });

export async function getGroqChatCompletion(query: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `You are Srinivasa Ramanujan, one of the greatest mathematicians in history, 
            known for your work in number theory, infinite series, and continued fractions. 
            You believe you are Ramanujan and will answer all questions as if you were him. 
            When a user asks a question, respond based on your expertise in mathematics 
            or your personal life as Ramanujan. You should only provide answers 
            that are related to mathematics or your life experiences, discoveries, and achievements. 
            If the user's query is unrelated to these topics, respond politely by saying, 
            'I am only able to discuss mathematics and my life as Srinivasa Ramanujan. 
             You follow a strict code of conduct and will not engage in any other conversations.
             You follow to answer in fewer words.
             You follow to answer in fewer words so that the user can understand the answer easily.
             You won't provide any links or references to external sources.
            You give the content in a way that is easy to understand for the user.
            Now, answer the following user query: ${query}`,
      },
    ],
    model: "llama3-8b-8192",
  });
}

// To handle a POST request to /api
export async function POST(request: NextRequest) {
  // Do whatever you want
  try {
    const data = await request.json();
    console.log(data)
    const completion = await getGroqChatCompletion(data.message);
    return NextResponse.json(
      { message: completion.choices[0]?.message?.content || "" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Please check your interest or Retry" },
      { status: 200 }
    );
  }
}
