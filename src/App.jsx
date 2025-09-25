// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { Send } from "lucide-react";
// import MarkdownPreview from "@uiw/react-markdown-preview";

// export default function AIAgentChat() {
//   const [messages, setMessages] = useState([
//     // {
//     //   role: "assistant",
//     //   content: "Hi I am AI Assistant. How can I help you today?",
//     // },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//     inputRef.current?.focus();
//   }, [messages, loading]);

//   const sendMessage = async (type = "text") => {
//     if (!input.trim()) return;

//     const newMessage = { role: "user", content: input };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:5000/api/chat", {
//         message: input,
//         type,
//       });

//       if (res.data.type === "image") {
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content: (
//               <img
//                 src={res.data.image}
//                 alt="AI generated"
//                 className="rounded-lg shadow-lg max-w-sm"
//               />
//             ),
//           },
//         ]);
//       } else {
//         const aiResponse =
//           res.data.reply || "🤖 Sorry, I didn’t understand that.";
//         setMessages((prev) => [
//           ...prev,
//           { role: "assistant", content: aiResponse },
//         ]);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "Couldn’t reach the AI server." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (

//      <div className="w-full h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 flex justify-center items-center">
//       <div className="flex flex-col w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden">
//         <div className="bg-gradient-to-r from-pink-600 to-indigo-600 text-white text-xl font-bold px-6 py-4 shadow-lg flex items-center gap-3">
//               <img
//           src="https://cdn-icons-png.flaticon.com/512/98/98233.png"
//           alt="AI"
//           className="w-10 h-10 rounded-full"
//         />

//           <span className="flex w-full justify-between items-center">
//               <span>नमस्ते मैं सितारा!!</span>
//               <span>मैं आपकी कैसे मदद कर सकता हूँ?</span>
//           </span>

//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 msg.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`relative w-auto max-w-full md:max-w-3xl px-4 py-2 rounded-3xl shadow break-words transition-all duration-300
//         ${
//           msg.role === "user"
//             ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
//             : "bg-gray-100 text-gray-800 rounded-bl-none"
//         }`}
//               >
//                 {typeof msg.content === "string" ? (
//                   <MarkdownPreview
//                     source={msg.content}
//                     style={{
//                       padding: 12,
//                       margin: 0,
//                       background: "transparent",
//                       color: msg.role === "user" ? "white" : "black",
//                     }}
//                   />
//                 ) : (
//                   msg.content
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Loading Indicator */}
//           {loading && (
//             <div className="flex justify-start">
//               <div className="bg-gray-200 px-4 py-2 rounded-3xl shadow text-gray-500 flex items-center gap-1 font-mono italic text-lg tracking-wide animate-pulse">
//                 Thinking
//                 <span className="animate-bounce">.</span>
//                 <span className="animate-bounce animation-delay-200">.</span>
//                 <span className="animate-bounce animation-delay-400">.</span>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         <div className="border-t bg-white px-4 py-3 flex items-center gap-3 shadow-inner rounded-b-3xl">
//           <input
//             ref={inputRef}
//             type="text"
//             className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Ask me anything you want..."
//           />
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={() => sendMessage("text")}
//             disabled={loading}
//           >
//             <Send className="w-5 h-5" />
//           </button>

//           {/* <button
//             className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={() => sendMessage("image")}
//             disabled={loading}
//           >
//             +
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Send, Edit2, Bot, User } from "lucide-react";

export default function AIAgentChat() {
  const [messages, setMessages] = useState(() => {
    // Load chat history from localStorage on mount
    const saved = localStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const BASE_URL = "https://chatbot-gemini-whf6.onrender.com/api/chat";
  // const BASE_URL = "http://localhost:5000/api/chat";

  // Save messages to localStorage only during session
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  // Clear on page reload
  useEffect(() => {
    localStorage.removeItem("chat_history");
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages, loading]);

  const sendMessage = async (type = "text") => {
    if (!input.trim()) return;

    let newMessage;
    let updatedMessages = [...messages];

    if (editIndex !== null) {
      // Replace the old message
      newMessage = { role: "user", content: input };

      // Cut off everything after the edited message (including old AI replies)
      updatedMessages = updatedMessages.slice(0, editIndex + 1);
      updatedMessages[editIndex] = newMessage;

      setMessages(updatedMessages);
      setEditIndex(null);
    } else {
      // New message
      newMessage = { role: "user", content: input };
      updatedMessages = [...updatedMessages, newMessage];
      setMessages(updatedMessages);
    }

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(BASE_URL, {
        message: newMessage.content,
        type,
      });

      if (res.data.type === "image") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: (
              <img
                src={res.data.image}
                alt="AI generated"
                className="rounded-lg shadow-lg max-w-sm"
              />
            ),
          },
        ]);
      } else {
        const aiResponse =
          res.data.reply || "🤖 Sorry, I didn’t understand that.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiResponse },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Couldn’t reach the AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setInput(messages[index].content);
    setEditIndex(index);
    inputRef.current.focus();
  };

  return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-400 via-pink-200 to-pink-50 p-4 flex justify-center items-center">
      <div className="flex flex-col w-full md:w-7xl h-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border-radius-lg border border-white/30 shadow-lg overflow-hidden">
              <img src="data:image/png;base64,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" 
              alt="profile"
              className="w-full h-full object-cover" />
              
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">नमस्ते मैं सितारा!!</h1>
              <p className="text-white/80 text-sm">
                मैं आपकी कैसे मदद कर सकती हूँ?
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-white/50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 max-w-[75%] ${
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <div
                  className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                  }`}
                >
                  {/* Message Content */}
                  <div className="relative">
                    {typeof msg.content === "string" ? (
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <MarkdownPreview
                            source={msg.content}
                            style={{
                              padding: 0,
                              margin: 0,
                              background: "transparent",
                              color: msg.role === "user" ? "white" : "#374151",
                              fontSize: "14px",
                              lineHeight: "1.5",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          />
                        </div>
                        {msg.role === "user" && (
                          <button
                            onClick={() => handleEdit(i)}
                            className="group-hover:opacity-100 text-white/70 hover:text-white transition-all duration-200 p-1 hover:bg-white/10 rounded"
                            title="Edit message"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>

                  {/* Message Tail */}
                  <div
                    className={`absolute top-0 w-3 h-3 ${
                      msg.role === "user"
                        ? "-right-1 bg-gradient-to-br from-blue-500 to-blue-600 transform rotate-45"
                        : "-left-1 bg-white border-l border-t border-gray-100 transform rotate-45"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md text-white">
                <Bot size={16} />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 relative">
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="text-sm">सोच रहा हूँ</span>
                  <div className="flex gap-1 ml-2">
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
                <div className="absolute top-0 -left-1 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white shadow-sm resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  editIndex !== null
                    ? "Edit your message and press Enter..."
                    : "Ask me anything..."
                }
                disabled={loading}
              />
            </div>
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              onClick={() => sendMessage("text")}
              disabled={loading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {editIndex !== null && (
            <div className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              Editing message #{editIndex + 1} - Press Enter Proceed !!!
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="w-full h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 flex justify-center items-center">
  //     <div className="flex flex-col w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden">
  //       {/* Header */}
  //       <div className="bg-gradient-to-r from-pink-600 to-indigo-600 text-white text-xl font-bold px-6 py-4 shadow-lg flex items-center gap-3">
  //         <img
  //           src="https://cdn-icons-png.flaticon.com/512/98/98233.png"
  //           alt="AI"
  //           className="w-10 h-10 rounded-full"
  //         />
  //         <span className="flex w-full justify-between items-center">
  //           <span>नमस्ते मैं सितारा!!</span>
  //           <span>मैं आपकी कैसे मदद कर सकता हूँ?</span>
  //         </span>
  //       </div>

  //       {/* Messages */}
  //       <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
  //         {messages.map((msg, i) => (
  //           <div
  //             key={i}
  //             className={`flex ${
  //               msg.role === "user" ? "justify-end" : "justify-start"
  //             }`}
  //           >
  //             <div
  //               className={` w-full max-w-full px-4 py-2 rounded-3xl shadow break-words transition-all duration-300
  //               ${
  //                 msg.role === "user"
  //                   ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none "
  //                   : "bg-gray-100 text-gray-800 rounded-bl-none"
  //               }`}
  //             >
  //               {typeof msg.content === "string" ? (
  //                 <div className="flex items-start gap-2">
  //                   <MarkdownPreview
  //                     source={msg.content}
  //                     style={{
  //                       padding: 12,
  //                       margin: 0,
  //                       background: "transparent",
  //                       color: msg.role === "user" ? "white" : "black",
  //                     }}
  //                   />
  //                   {msg.role === "user" && (
  //                     <button
  //                       onClick={() => handleEdit(i)}
  //                       className="text-gray-200 hover:text-white"
  //                       title="Edit message"
  //                     >
  //                       <Edit2 size={16} />
  //                     </button>
  //                   )}
  //                 </div>
  //               ) : (
  //                 msg.content
  //               )}
  //             </div>
  //           </div>
  //         ))}
  //         {loading && (
  //           <div className="flex justify-start">
  //             <div className="bg-gray-200 px-4 py-2 rounded-3xl shadow text-gray-500 flex items-center gap-1 font-mono italic text-lg tracking-wide animate-pulse">
  //               Thinking
  //               <span className="animate-bounce">.</span>
  //               <span className="animate-bounce animation-delay-200">.</span>
  //               <span className="animate-bounce animation-delay-400">.</span>
  //             </div>
  //           </div>
  //         )}

  //         <div ref={messagesEndRef} />
  //       </div>

  //       {/* Input */}
  //       <div className="border-t bg-white px-4 py-3 flex items-center gap-3 shadow-inner rounded-b-3xl">
  //         <input
  //           ref={inputRef}
  //           type="text"
  //           className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400"
  //           value={input}
  //           onChange={(e) => setInput(e.target.value)}
  //           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  //           placeholder={
  //             editIndex !== null
  //               ? "Edit your message and press Enter..."
  //               : "Ask me anything you want..."
  //           }
  //         />
  //         <button
  //           className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  //           onClick={() => sendMessage("text")}
  //           disabled={loading}
  //         >
  //           <Send className="w-5 h-5" />
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
}
