import React, { useEffect, useState } from "react";
import client from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import "./TrackClaims.css";

const statusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
    default:
      return "warning";
  }
};

const TrackClaims = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await client.get("/api/claims", { params: { userId: user?.id } });
      setClaims(res.data || []);
      setError("");
    } catch (err) {
      console.error("Error loading claims:", err);
      setError("Failed to load claims. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="container section">
        <div className="card">
          <div className="card-body center" style={{ minHeight: 160 }}>
            <span className="text-body">Loading your claims…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section track-root">
      <div className="between mb-3 track-header">
        <h2 className="h2 track-title">Track My Claims</h2>
        <button className="btn btn-outline" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="card mb-3" style={{ borderColor: "#fecaca" }}>
          <div className="card-body" style={{ color: "#991b1b" }}>
            {error}
          </div>
        </div>
      )}

      {claims.length === 0 ? (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="card-body center" style={{ minHeight: 160 }}>
            <div className="h3 mb-2" style={{ fontWeight: 600 }}>No claims found</div>
            <div className="text-body">You haven\'t submitted any claims yet.</div>
          </div>
        </div>
      ) : (
        <div className="track-grid">
          {claims.map((c) => (
          <div className="card track-card" key={c.id} onClick={()=>{setActive(c); setShow(true);}} style={{cursor:"pointer"}}>
            <div className="card-body">
              <div className="between mb-2">
                <div className="h3" style={{ fontWeight: 600 }}>
                  Claim #{c.id}
                </div>
                <span
                  className={`badge track-badge ${
                    statusColor(c.status) === "success"
                      ? "badge-success"
                      : statusColor(c.status) === "error"
                      ? "badge-error"
                      : "badge-warning"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="text-body">Policy: {c.policyId}</div>
              {c.claimType && (
                <div className="text-body">Type: {c.claimType}</div>
              )}
              {(c.estimatedAmount || c.requestedAmount) && (
                <div className="text-body">
                  Amount: ₹{String(c.estimatedAmount || c.requestedAmount)}
                </div>
              )}
            </div>
          </div>
          ))}
        </div>
      )}
      {show && active && (
        <div className="policy-dialog-overlay" onClick={()=>setShow(false)}>
          <div className="card" style={{width:"min(720px,92vw)"}} onClick={(e)=>e.stopPropagation()}>
            <div className="card-body">
              <div className="between mb-2">
                <div className="h3">Claim #{active.id}</div>
                <button className="btn btn-outline" onClick={()=>setShow(false)}>Close</button>
              </div>
              {(() => { let d={}; try{ d = JSON.parse(active.details||"{}"); } catch(e){} return (
              <div className="policy-form-grid" style={{gridTemplateColumns:"repeat(3,1fr)", gap:12}}>
                <label>
                  <span>Status</span>
                  <input value={active.status || "PENDING"} disabled />
                </label>
                <label>
                  <span>Policy ID</span>
                  <input value={active.policyId || ""} disabled />
                </label>
                <label>
                  <span>Type</span>
                  <input value={active.claimType || d.claimType || ""} disabled />
                </label>
                <label>
                  <span>Requested Amount</span>
                  <input value={(active.requestedAmount || d.requestedAmount) ? `₹${active.requestedAmount || d.requestedAmount}` : "N/A"} disabled />
                </label>
                <label>
                  <span>Estimated Amount</span>
                  <input value={(active.estimatedAmount || d.estimatedAmount) ? `₹${active.estimatedAmount || d.estimatedAmount}` : "N/A"} disabled />
                </label>
                <label>
                  <span>Contact</span>
                  <input value={d.contactNumber || ""} disabled />
                </label>
                <label>
                  <span>Incident Date</span>
                  <input value={active.incidentDate ? new Date(active.incidentDate).toLocaleDateString() : (d.incidentDate ? new Date(d.incidentDate).toLocaleDateString() : "")} disabled />
                </label>
                <label className="full">
                  <span>Description</span>
                  <textarea value={active.description || d.description || ""} disabled rows={3} />
                </label>
              </div> )})()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackClaims;
