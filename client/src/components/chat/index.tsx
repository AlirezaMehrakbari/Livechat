import React, {useEffect, useState} from "react";
import style from "./chat.module.css";
import {Send} from "iconsax-react";
import {useRef} from "react";

interface IChat {
    socket: any;
    username: string;
    room: string;
}

const Chat = ({socket, username, room}: IChat) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState<any>([]);
    const chatBodyRef = useRef(null)


    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messageList]);

    const sendMessage = async (e) => {
        e.preventDefault()
        if (currentMessage) {
            const messageData = {
                room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list: any) => [...list, messageData]);
            setCurrentMessage("");
            chatBodyRef.current.scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                })
        }

    };

    useEffect(() => {
        socket.on("receive_message", (data: any) => {
            setMessageList((list: any) => [...list, data]);
        });
        return () => {
            socket.off("receive_message");
        };
    }, [socket]);

    return (
        <div className={style.chat_container}>
            <div className={style.chat_header}>
                <h4>Live Chat</h4>
            </div>
            <div className={style.chat_body} ref={chatBodyRef}>
                {messageList &&
                    messageList.map((item: any, index: number) => (
                        <div
                            className={`${
                                username === item.author
                                    ? style.speechContainerMe
                                    : style.speechContainerOther
                            }`}
                            key={index}
                        >
                            <div
                                className={`${
                                    username === item.author
                                        ? style.speechBubbleMe
                                        : style.speechBubbleOther
                                } ${style.speechBubble}`}
                            >
                                <p>{item.message}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <div className={style.chat_footer}>
                <form onSubmit={sendMessage} className={style.inputContainer}>
                    <input
                        className={style.messageInput}
                        type="text"
                        value={currentMessage}
                        placeholder="message ..."
                        onChange={(e) => {
                            setCurrentMessage(e.target.value);
                        }}
                    />
                    <button className={style.sendButton} type={'submit'}>
                        <Send size="28" color="#fff" variant="Bold"/>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
