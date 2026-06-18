import React, { useEffect, useState } from "react";
import client from "../../../api/client";
import "./AdminQueries.css";

const AdminQueries = () => {
  const [rows, setRows] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const load = async () => {
    const res = await client.get("/api/queries");
    setRows(res.data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const sendReply = async () => {
    if (!selectedId) return;
    await client.put(`/api/queries/${selectedId}/reply`, null, {
      params: { response: reply, status: "RESOLVED" },
    });
    setReply("");
    setSelectedId(null);
    await load();
  };

  return (
    <div className="admin-queries-container">
      <h2 className="admin-queries-title">User Queries</h2>
      <form className="admin-queries-form" onSubmit={(e) => { e.preventDefault(); sendReply(); }}>
        <div className="admin-queries-field">
          <label className="admin-queries-label">Reply</label>
          <input
            className="admin-queries-input"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Enter your reply..."
          />
        </div>
        <button 
          type="submit"
          className="admin-queries-button" 
          disabled={!selectedId}
        >
          Send Reply
        </button>
      </form>
      {rows.length === 0 ? (
        <div className="admin-queries-empty">No queries found</div>
      ) : (
        <table className="admin-queries-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Query</th>
              <th>Status</th>
              <th>Response</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.userId}</td>
                <td>{r.queryText}</td>
                <td>{r.status}</td>
                <td>{r.response || '-'}</td>
                <td>
                  <button 
                    className={`admin-queries-select-button ${selectedId === r.id ? 'selected' : ''}`}
                    onClick={() => setSelectedId(r.id)}
                  >
                    {selectedId === r.id ? "Selected" : "Select"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminQueries;
