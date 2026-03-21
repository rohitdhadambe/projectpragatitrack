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
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Compose Message</h2>

      {/* RECIPIENT FIELD */}
      <div className="relative mb-3" ref={dropdownRef}>
        <div
          className="border p-2 rounded flex flex-wrap gap-2 cursor-pointer"
          onClick={() => setShowDropdown(true)}
        >
          {receiverIds.length === 0 && (
            <span className="text-gray-400">Select recipients</span>
          )}

         {receiverIds.map(id => {
  const u = users.find(user => user.id === id);
  return (
    <span
      key={id}
      className="bg-blue-100 px-2 py-1 rounded flex items-center gap-2 text-sm"
    >
      {/* ✅ SHOW EMAIL */}
      {u?.email}

      {/* ❌ REMOVE BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeUser(id);
        }}
        className="text-red-500 font-bold"
      >
        ✕
      </button>
    </span>
  );
})}
        </div>

        {/* DROPDOWN */}
        {showDropdown && (
          <div className="absolute w-full bg-white border mt-1 max-h-40 overflow-y-auto z-10">
            {users.map(u => (
              <div
                key={u.id}
                onClick={() => addUser(u.id)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {u.name} ({u.email})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUBJECT */}
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      {/* BODY */}
      <textarea
        placeholder="Message"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      {/* FILE */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 w-full mb-3"
      />

      {/* SEND */}
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}