import React, { useState, useRef, useEffect } from "react";


const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! 👋 I'm the MiniFiverr Assistant. How can I help you?"
        }
    ]);

    const messagesEndRef = useRef(null);

  
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);

    const sendMessage = async () => {

        if (!input.trim() || loading) {
            return;
        }

        const question = input.trim();

      
        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: question
            }
        ]);

        setInput("");
        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem("user"));

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: question,
                        userId:user?._id

                    })
                }
            );

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text:
                        data.answer ||
                        "Sorry, I couldn't generate an answer."
                }
            ]);

        } catch (error) {

            console.error("Chatbot Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text:
                        "Sorry 😔 I couldn't connect to the AI assistant. Please try again."
                }
            ]);

        } finally {

            setLoading(false);

        }
    };

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
        

            {!isOpen && (
                <button
                    className="chat-floating-button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chatbot"
                >
                    💬
                </button>
            )}

          

            {isOpen && (
                <div className="chatbot-container">

                

                    <div className="chatbot-header">

                        <div className="chatbot-header-left">

                            <div className="bot-avatar">
                                🤖
                            </div>

                            <div>
                                <h3>MiniFiverr Assistant</h3>

                                <span>
                                    ● Online
                                </span>
                            </div>

                        </div>

                        <button
                            className="chat-close-button"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>

                    </div>


                   

                    <div className="chatbot-messages">

                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={
                                    message.sender === "user"
                                        ? "message-wrapper user-wrapper"
                                        : "message-wrapper bot-wrapper"
                                }
                            >

                                {message.sender === "bot" && (
                                    <div className="small-bot-avatar">
                                        🤖
                                    </div>
                                )}

                                <div
                                    className={
                                        message.sender === "user"
                                            ? "message user-message"
                                            : "message bot-message"
                                    }
                                >
                                    {message.text}
                                </div>

                            </div>

                        ))}


                  

                        {loading && (

                            <div className="message-wrapper bot-wrapper">

                                <div className="small-bot-avatar">
                                    🤖
                                </div>

                                <div className="message bot-message typing-message">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>

                            </div>

                        )}

                        <div ref={messagesEndRef}></div>

                    </div>



                    <div className="chatbot-input-area">

                        <input
                            type="text"
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            disabled={loading}
                        />

                        <button
                            onClick={sendMessage}
                            disabled={
                                loading ||
                                !input.trim()
                            }
                            className="chat-send-button"
                        >
                            ➤
                        </button>

                    </div>

                </div>
            )}
        </>
    );
};

export default ChatBot;