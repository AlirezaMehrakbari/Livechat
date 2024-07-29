"use client";

import { useState } from "react";
import styles from "./page.module.css";
import io from "socket.io-client";
import Chat from "@/components/chat";

const socket = io("http://localhost:8001", {
  transports: ["websocket"],
});

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <>
      {!showChat ? (
        <main className={styles.main}>
          <h3>Join A Chat</h3>
          <input
            className={styles.inputs}
            type="text"
            placeholder="Your Name ..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={styles.inputs}
            type="text"
            placeholder="Room ..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button className={styles.joinButton} onClick={joinRoom}>
            Join The Room
          </button>
        </main>
      ) : (
        <Chat room={room} socket={socket} username={username} />
      )}
    </>
  );
}
