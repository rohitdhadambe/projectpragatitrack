import { useEffect, useState } from "react";

export default function Sent() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

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
            grouped[key] = { ...msg, receivers: [msg.receiver_id] };
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
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isToday) return `Today, ${time}`;
    if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
    return date.toLocaleDateString() + ", " + time;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sent</h2>

      {messages.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md text-gray-500">No messages sent</div>
      )}

      {messages.map(msg => (
        <div
          key={msg.id}
          onClick={() => setSelected(msg)}
          className="bg-white p-4 mb-3 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition flex items-center gap-3"
        >
          {/* Avatar — always purple-600 */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 bg-purple-600">
            {getEmail(msg.receivers[0]).charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">
              <span className="text-sm font-bold text-purple-600">To : </span>
              {msg.receivers.map(id => getEmail(id)).join(", ")}
            </p>
            <p className="text-sm text-gray-600 truncate">
              <span className="font-bold text-purple-600">Subject : </span>{msg.subject}
            </p>
          </div>

          {/* Larger timestamp */}
          <p className="text-sm font-medium text-gray-500 flex-shrink-0">{formatTime(msg.created_at)}</p>
        </div>
      ))}

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-[620px] max-w-[92vw] max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with bold close button */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                <span className="text-lg font-bold text-purple-600">Subject : </span>
                {selected.subject}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-base transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-purple-600">
                {getEmail(selected.receivers[0]).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  <span className="text-xs font-bold text-purple-600">To: </span>
                  {selected.receivers.map(id => getEmail(id)).join(", ")}
                </p>
                {/* Larger timestamp inside modal too */}
                <p className="text-sm font-medium text-gray-500">{formatTime(selected.created_at)}</p>
              </div>
            </div>

            <div className="px-6 py-5 text-gray-700 whitespace-pre-line">{selected.body}</div>

            {selected.attachment && (
              <div className="px-6 pb-6">
                <a href={selected.attachment} target="_blank" rel="noreferrer"
                  className="inline-block text-sm text-purple-500 hover:underline">
                  📎 View Attachment
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}