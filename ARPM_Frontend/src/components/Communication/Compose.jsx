import { useState, useEffect, useRef } from "react";

export default function Compose() {
  const [users, setUsers] = useState([]);
  const [receiverIds, setReceiverIds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);

  const dropdownRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id;

  // Fetch users
  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add user
  const addUser = (id) => {
    if (!receiverIds.includes(id)) {
      setReceiverIds([...receiverIds, id]);
    }
  };

  // Remove user
  const removeUser = (id) => {
    setReceiverIds(receiverIds.filter(uid => uid !== id));
  };

  // Send message
  const handleSend = async () => {
    if (receiverIds.length === 0) {
      alert("Select at least one user");
      return;
    }

    const formData = new FormData();

    receiverIds.forEach(id => {
      formData.append("receiver_ids", id);
    });

    formData.append("subject", subject);
    formData.append("body", body);

    if (file) {
      formData.append("file", file);
    }

    const res = await fetch(
      `http://127.0.0.1:8000/messages/send?sender_id=${senderId}`,
      {
        method: "POST",
        body: formData
      }
    );

    if (res.ok) {
      alert("Message sent!");

      setReceiverIds([]);
      setSubject("");
      setBody("");
      setFile(null);
    } else {
      alert("Error sending message");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Compose Message
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md">

        {/* 📧 RECIPIENT FIELD */}
        <div className="relative mb-4" ref={dropdownRef}>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            To
          </label>

          <div
            className="border rounded-lg p-2 flex flex-wrap gap-2 min-h-[45px] cursor-pointer focus-within:ring-2 focus-within:ring-purple-500"
            onClick={() => setShowDropdown(true)}
          >
            {receiverIds.length === 0 && (
              <span className="text-gray-400 text-sm">
                Select recipients
              </span>
            )}

            {receiverIds.map(id => {
              const u = users.find(user => user.id === id);
              return (
                <span
                  key={id}
                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                >
                  {u?.email}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeUser(id);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>

          {/* 🔽 DROPDOWN */}
          {showDropdown && (
            <div className="absolute w-full bg-white border rounded-lg mt-1 shadow-md max-h-40 overflow-y-auto z-10">
              {users.map(u => (
                <div
                  key={u.id}
                  onClick={() => addUser(u.id)}
                  className="p-2 hover:bg-purple-50 cursor-pointer text-sm"
                >
                  <span className="font-medium">{u.name}</span>
                  <span className="text-gray-500 ml-1">({u.email})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBJECT */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* BODY */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Message
          </label>
          <textarea
            placeholder="Write your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border rounded-lg p-2 w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* FILE */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Attachment
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        {/* SEND BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleSend}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}