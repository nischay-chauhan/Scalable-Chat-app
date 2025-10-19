import { useEffect, useState } from 'react'
import './index.css'
import { io } from "socket.io-client"

const socket = io("http://localhost:8080")

function App() {
  const [message , setMessage] = useState<string>("")
  const [chat , setChat] = useState<string[]>([])

  useEffect(() => {
    socket.on("message" , (msg) => {
      setChat((prev) => [...prev , msg]);
    });

    return () => {
      socket.off("message");
    }
  }, [])


  const sendMessage = () => {
    if(!message.trim()) return;
    socket.emit("message" , message);
    setMessage("");
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4"> Live Chat</h1>

      <div className="w-full max-w-md bg-gray-800 rounded p-4 mb-4 h-64 overflow-y-auto">
        {chat.map((msg, i) => (
          <div key={i} className="mb-1 p-1 bg-gray-700 rounded">{msg}</div>
        ))}
      </div>

      <div className="flex w-full max-w-md">
        <input
          className="flex-1 p-2 rounded-l bg-gray-700 focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}


export default App
