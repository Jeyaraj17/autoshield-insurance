import React, { useEffect, useState } from "react";
import client from "../../../api/client";
import "./ManageClaims.css";

const ManageClaims = () => {
  const [rows, setRows] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const load = async () => {
    try {
      const res = await client.get("/api/claims/all");
      setRows(res.data || []);
    } catch (err) {
      console.error("Error loading claims:", err);
      setRows([]);
    }
  };
  
  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    await client.put(`/api/claims/${id}/status`, null, { params: { status } });
    await load();
    setShowDialog(false);
  };

  const viewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowDialog(true);
  };

  return (
    <div className="manage-root">
      <h3 className="h3 manage-title">Manage Claims</h3>
      <div className="card">
        <div className="card-body">
          <table className="manage-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Policy</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.policyId}</td>
                  <td>{r.claimType || 'N/A'}</td>
                  <td>{r.status}</td>
                  <td>
                    <div className="manage-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => viewClaim(r)}
                        style={{marginRight: '8px'}}
                      >
                        View
                      </button>
                      {r.status === "PENDING" && (
                        <>
                          <button
                            className="btn btn-approve"
                            onClick={() => setStatus(r.id, "APPROVED")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => setStatus(r.id, "REJECTED")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showDialog && selectedClaim && (
        <div className="policy-dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="card" style={{width:"min(600px,92vw)"}} onClick={(e)=>e.stopPropagation()}>
            <div className="card-body">
              <div className="between mb-2">
                <div className="h3">Claim Details #{selectedClaim.id}</div>
                <button className="btn btn-outline" onClick={()=>setShowDialog(false)}>Close</button>
              </div>
              {(() => { 
                let d={}; 
                try{ d = JSON.parse(selectedClaim.details||"{}"); } catch(e){} 
                return (
                  <div className="policy-form-grid" style={{gridTemplateColumns:"repeat(3,1fr)", gap:12}}>
                    <label>
                      <span>Status</span>
                      <input value={selectedClaim.status || "PENDING"} disabled />
                    </label>
                    <label>
                      <span>Policy ID</span>
                      <input value={selectedClaim.policyId || ""} disabled />
                    </label>
                    <label>
                      <span>Claim Type</span>
                      <input value={selectedClaim.claimType || d.claimType || ""} disabled />
                    </label>
                    <label>
                      <span>Contact Number</span>
                      <input value={d.contactNumber || ""} disabled />
                    </label>
                    <label>
                      <span>Requested Amount</span>
                      <input value={(selectedClaim.requestedAmount || d.requestedAmount) ? `₹${selectedClaim.requestedAmount || d.requestedAmount}` : "N/A"} disabled />
                    </label>
                    <label>
                      <span>Approved Amount</span>
                      <input value={(selectedClaim.approvedAmount || d.approvedAmount) ? `₹${selectedClaim.approvedAmount || d.approvedAmount}` : "N/A"} disabled />
                    </label>
                    <label>
                      <span>Estimated Amount</span>
                      <input value={(selectedClaim.estimatedAmount || d.estimatedAmount) ? `₹${selectedClaim.estimatedAmount || d.estimatedAmount}` : "N/A"} disabled />
                    </label>
                    <label className="full">
                      <span>Address</span>
                      <textarea value={d.address || ""} disabled rows={2} />
                    </label>
                    <label className="full">
                      <span>Description</span>
                      <textarea value={selectedClaim.description || d.description || ""} disabled rows={3} />
                    </label>
                    {d.imageUrl && (
                      <div className="full" style={{marginTop: '12px'}}>
                        <span style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>Incident Photo:</span>
                        <img 
                          src={d.imageUrl} 
                          alt="Claim evidence" 
                          style={{maxWidth: '300px', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer'}}
                          onClick={() => window.open(d.imageUrl, '_blank')}
                        />
                        <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>Click to view full size</div>
                      </div>
                    )}
                    {selectedClaim.status === "PENDING" && (
                      <div className="full" style={{display:'flex', gap:12, justifyContent:'flex-end', marginTop:12}}>
                        <button
                          className="btn btn-approve"
                          onClick={() => setStatus(selectedClaim.id, "APPROVED")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={() => setStatus(selectedClaim.id, "REJECTED")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClaims;
