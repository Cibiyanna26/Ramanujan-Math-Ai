"use client"

import { Input } from "@/components/ui/input";
import { ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, ReactElement, useEffect, useState } from "react";
import Toast, { Toaster } from "react-hot-toast"

const leftMessageCreator = (message: string) => (
  <div className="flex items-end justify-end">
    <div className="bg-blue-500 text-white p-3 rounded-xl rounded-br-none max-w-[80%]">
      {message}
    </div>
  </div>
);

const rightMessageCreator = (message: string) => (
  <div className="flex items-end">
    <div className="bg-gray-300 text-black p-3 rounded-xl rounded-bl-none max-w-[80%]">
      {message}
    </div>
  </div>
);

const saveMessagesToLocalStorage = (messages: { sender: string; text: string }[]) => {
  try{
    if (typeof window === "undefined") {
      return [];
    }
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }
  catch(e){
    Toast.error("Your history is full.. please clear the chat to save messages")
    return [];
  }
  return [];
};

const getMessagesFromLocalStorage = ( setLoading : Function ): { sender: string; text: string }[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedMessages = localStorage.getItem("chatMessages");
  setLoading(false)
  return storedMessages ? JSON.parse(storedMessages) : [];
};




export default function ChatbotPage(){

    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
    useEffect(() => {
      const chatMessages = document.getElementById("chat-messages");
      chatMessages?.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth",
      });
    }, []);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    const [messages, setMessages] = useState<{ sender: string; text: string }[]>(() => {
      return getMessagesFromLocalStorage(setIsLoading);
    });
    
    // const [storedMessages, setStoredMessages] = useState<{ sender: string; text: string }[]>();

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      const chatMessages = document.getElementById("chat-messages");
      chatMessages?.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth",
      });
    }, [messages]);

    useEffect(() => {
      saveMessagesToLocalStorage(messages);
    }, [messages]);

    const [input, setInput] = useState<string>("");

    const clearChat = () => {
      setMessages([]);
      
      localStorage.removeItem("chatMessages");
    
      Toast.success("Chat cleared successfully!");
    };

    const handleChatbot = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (input) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "user", text: input },
        ]);
        setInput("");
  
        try {
          const response = await fetch(baseUrl + "/api/v1/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: input }),
          });
          const data = await response.json();
          if (data.message) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: "ai", text: data.message },
            ]);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    if (!isClient) {
      return null; // Render nothing on the server
    }

    if (isLoading) {
      return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    return (
      <>
      <Toaster/>
      <div className="flex flex-col items-center lg:px-10 py-5">
        <div
          className="max-h-[500px] lg:w-3/5 w-full overflow-y-auto space-y-4"
          id="chat-messages"
        >
          {messages.map((msg, index) =>
            msg.sender === "user"
              ? leftMessageCreator(msg.text)
              : rightMessageCreator(msg.text)
          )}
        </div>
        <form
          onSubmit={handleChatbot}
          className="w-full flex flex-row gap-4 fixed bottom-10 justify-center md:px-20 px-10"
        >
          <Input
            className="lg:w-3/5 w-full rounded-2xl p-4"
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button variant="outline" size="icon" className="rounded-2xl">
            <ChevronRight className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl bg-red-400" onClick={clearChat}>
            <Trash2 className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </>
    );
}