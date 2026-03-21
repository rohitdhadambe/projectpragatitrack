import { useEffect, useState } from "react";

export default function Sent() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

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

  const getEmail = (id) => {
    const u = users.find(user => user.id === id);
    return u ? u.email : id;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today, ${time}`;
    if (date.toDateString() === yesterday.toDateString())
      return `Yesterday, ${time}`;

    return date.toLocaleDateString() + ", " + time;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sent</h2>

      {messages.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md text-gray-500">
          No messages sent
        </div>
      )}

      {messages.map(msg => (
        <div
          key={msg.id}
          className="bg-white p-5 mb-4 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-purple-600">
              To: {msg.receivers.map(id => getEmail(id)).join(", ")}
            </p>

            <p className="text-xs text-gray-500">
              {formatTime(msg.created_at)}
            </p>
          </div>

          <p className="font-medium text-gray-800">{msg.subject}</p>
          <p className="text-gray-600 mt-1">{msg.body}</p>

          {msg.attachment && (
            <a
              href={msg.attachment}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-sm text-purple-500 hover:underline"
            >
              📎 View Attachment
            </a>
          )}
        </div>
      ))}
    </div>
  );
}