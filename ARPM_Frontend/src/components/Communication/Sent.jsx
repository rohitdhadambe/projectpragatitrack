import { useEffect, useState } from "react";

export default function Sent() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Fetch users
  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // Fetch and group messages
  useEffect(() => {
    if (!userId) return;

    fetch(`http://127.0.0.1:8000/messages/sent/${userId}`)
      .then(res => res.json())
      .then(data => {

        const grouped = {};

        data.forEach(msg => {
          const key = `${msg.subject}-${msg.body}-${msg.created_at}`;

          if (!grouped[key]) {
            grouped[key] = {
              ...msg,
              receivers: [msg.receiver_id]
            };
          } else {
            grouped[key].receivers.push(msg.receiver_id);
          }
        });

        setMessages(Object.values(grouped));
      });

  }, [userId]);

  // 🔥 Get email from ID
  const getEmail = (id) => {
    const u = users.find(user => user.id === id);
    return u ? u.email : id;
  };

  // 🔥 Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;

    return date.toLocaleDateString() + ", " + time;
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Sent Messages</h2>

      {messages.length === 0 && <p>No messages sent</p>}

      {messages.map(msg => (
        <div key={msg.id} className="border p-4 mb-3 rounded shadow">

          <p>
            <b>To:</b>{" "}
            {msg.receivers.map(id => getEmail(id)).join(", ")}
          </p>

          <p><b>Subject:</b> {msg.subject}</p>
          <p className="mb-2">{msg.body}</p>

          {msg.attachment && (
            <a
              href={msg.attachment}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              View Attachment
            </a>
          )}

          {/* 🕒 TIME */}
          <p className="text-xs font-bold text-gray-600 text-right">
            {formatTime(msg.created_at)}
          </p>

        </div>
      ))}
    </div>
  );
}