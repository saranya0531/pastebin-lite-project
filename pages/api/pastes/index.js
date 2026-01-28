// pages/index.js
import { useState, useEffect } from "react";

export default function Home() {
  const [pastes, setPastes] = useState([]);
  const [text, setText] = useState("");

  // Fetch all pastes
  const fetchPastes = async () => {
    const res = await fetch("/api/savePaste");
    const data = await res.json();
    if (data.pastes) setPastes(data.pastes);
  };

  useEffect(() => {
    fetchPastes();
  }, []);

  const handleSave = async () => {
    if (!text) return alert("Type something!");
    const id = "paste-" + Date.now();

    await fetch("/api/savePaste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content: text }),
    });

    setText("");
    fetchPastes(); // refresh list
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "Arial" }}>
      <h1>Pastebin Lite</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: 10 }}
        placeholder="Type your paste here..."
      />
      <button
        onClick={handleSave}
        style={{ marginTop: 10, padding: "10px 20px" }}
      >
        Save Paste
      </button>

      <h2>Saved Pastes</h2>
      <ul>
        {pastes.map((paste) => (
          <li key={paste.id} style={{ marginBottom: 10 }}>
            <strong>{paste.id}</strong>: {paste.content}
          </li>
        ))}
      </ul>
    </div>
  );
}