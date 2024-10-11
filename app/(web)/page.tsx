"use client"

import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";


export default function ChatbotPage(){

    const baseUrl = "https://man-of-infinity.vercel.app/";
    useEffect(() => {
      const chatMessages = document.getElementById("chat-messages");
      chatMessages?.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth",
      });
    }, []);

    const [input, setInput] = useState<string>("");

    const handleChatbot = async () =>{
   
        const chatMessages = document.getElementById("chat-messages");
        const chatInput = document.getElementById("chat-input");

        if(input){
            const message = input;
            if(message){
                const leftMessage = document.createElement("div");
                leftMessage.classList.add("flex", "items-end", "justify-end");
                const leftMessageContent = document.createElement("div");
                leftMessageContent.classList.add("bg-blue-500", "text-white", "p-3", "rounded-xl", "rounded-br-none",'max-w-[80%]');
                leftMessageContent.textContent = message;
                leftMessage.appendChild(leftMessageContent);
                chatMessages?.appendChild(leftMessage);
                chatMessages?.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: "smooth",
                });
            }
            chatInput?.setAttribute("disabled", "true");
        }

        try{
            const response = await fetch(baseUrl+"/api/v1/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: input}),
            });
            console.log("response", response);
            setInput("");
            const data = await response.json();
            console.log("data", data);
            if(data.message){
                const rightMessage = document.createElement("div");
                rightMessage.classList.add("flex", "items-end");
                const rightMessageContent = document.createElement("div");
                rightMessageContent.classList.add("bg-gray-300", "text-black", "p-3", "rounded-xl", "rounded-bl-none",'max-w-[80%]');
                rightMessageContent.textContent = data.message;
                rightMessage.appendChild(rightMessageContent);
                chatMessages?.appendChild(rightMessage);
                chatMessages?.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: "smooth",
                });
            }
            chatInput?.removeAttribute("disabled");
        } catch(e){
            console.log(e);
            setInput("");
            chatInput?.removeAttribute("disabled");
        }
    }

    return (
      <>
        <div className="flex flex-col items-center lg:px-10 py-5">
          <div
            className="max-h-[500px] lg:w-3/5 w-full overflow-y-auto space-y-4"
            id="chat-messages"
          >
           
          </div>
          <div className="w-full flex flex-row gap-4 fixed bottom-10 justify-center md:px-20 px-10">
            <Input className="lg:w-3/5 w-full rounded-2xl p-4" id="chat-input" value={input} onChange={(e)=>setInput(e.target.value)} />
            <Button variant="outline" size="icon" className="rounded-2xl" onClick={()=>handleChatbot()}>
              <ChevronRight className="h-6 w-6 " />
            </Button>
          </div>
        </div>
      </>
    );
}