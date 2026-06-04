"use client";

import { useState } from "react";

export default function TimePage() {
  const [now, setNow] = useState("");

  const showTime = () => {
    const current = new Date();
    setNow(current.toLocaleString());
  };

  return (
    <div style={{ padding: "40px", fontSize: "20px" }}>
      <h1>現在の日時を表示するアプリ</h1>
      <button
        onClick={showTime}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        日時を表示
      </button>

      {now && (
        <p style={{ marginTop: "20px", fontSize: "24px", color: "blue" }}>
          {now}
        </p>
      )}
    </div>
  );
}
