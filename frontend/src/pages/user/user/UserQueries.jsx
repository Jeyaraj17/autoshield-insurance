import React, { useEffect, useState } from "react";
import client from "../../../api/client";
import "./UserQueries.css";

const UserQueries = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ queryText: "" });
  const [snack, setSnack] = useState("");

  const load = async () => {
    const res = await client.get("/api/queries");
    setList(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await client.post("/api/queries", form);
    setForm({ queryText: "" });
    setSnack("Submitted");
    await load();
  };

  return (
    <div className="user-queries-container">
      <h2 className="user-queries-title">Queries</h2>
      <form onSubmit={submit} className="user-queries-form">
        <div className="user-queries-field">
          <label className="user-queries-label">Query</label>
          <textarea
            className="user-queries-textarea"
            value={form.queryText}
            onChange={(e) => setForm({ queryText: e.target.value })}
            placeholder="Enter your query here..."
            rows={3}
            required
          />
        </div>
        <button type="submit" className="user-queries-button">
          Submit
        </button>
      </form>
      <ul className="user-queries-list">
        {list.map((q) => (
          <li key={q.id} className="user-queries-item">
            <div className="user-queries-query">{q.queryText}</div>
            <div className="user-queries-meta">
              <span className={`user-queries-status ${q.status.toLowerCase()}`}>
                Status: {q.status}
              </span>
            </div>
            {q.response && (
              <div className="user-queries-response">
                <strong>Response:</strong> {q.response}
              </div>
            )}
          </li>
        ))}
      </ul>
      {snack && (
        <div className="user-queries-snackbar">
          {snack}
        </div>
      )}
    </div>
  );
};

export default UserQueries;
