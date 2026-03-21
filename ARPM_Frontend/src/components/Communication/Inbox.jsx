import { useEffect, useState } from "react";

export default function Inbox() {
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

  // Fetch inbox messages
  useEffect(() => {
    if (!userId) return;

    fetch(`http://127.0.0.1:8000/messages/inbox/${userId}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [userId]);

  // 🔥 helper: get email by id
  const getEmail = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.email : id;
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Inbox</h2>

      {messages.length === 0 && <p>No messages</p>}

      {messages.map(msg => (
        <div key={msg.id} className="border p-4 mb-3 rounded shadow">
          <p><b>From:</b> {getEmail(msg.sender_id)}</p>
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
        </div>
      ))}
    </div>
  );
}