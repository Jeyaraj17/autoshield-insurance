import React, { useEffect, useState } from "react";
import client from "../../../api/client";
import "./ViewPolicies.css";

const ViewPolicies = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await client.get("/api/policies");
      setRows(res.data || []);
    })();
  }, []);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (months) => {
    if (months === 12) return "1 Year";
    if (months === 24) return "2 Years";
    if (months === 36) return "3 Years";
    return `${months} Months`;
  };

  return (
    <div className="view-policies-container">
      <h2 className="view-policies-title">All Insurance Policies</h2>
      <p className="view-policies-description">
        Manage and view all insurance policies created in the system. These policies are available for users to apply.
      </p>
      {rows.length === 0 ? (
        <div className="view-policies-empty">No policies found</div>
      ) : (
        <table className="view-policies-table">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Vehicle Type</th>
              <th>Coverage Type</th>
              <th>Premium</th>
              <th>Coverage Amount</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((policy) => (
              <tr key={policy.id}>
                <td>
                  <div className="view-policies-policy-name">{policy.policyName}</div>
                  <div className="view-policies-policy-type">ID: {policy.id}</div>
                </td>
                <td>
                  <span>{policy.vehicleType === "Two-Wheeler" ? "🏍️" : "🚗"}</span>
                  {policy.vehicleType}
                </td>
                <td>{policy.coverageType}</td>
                <td className="view-policies-amount">
                  {formatCurrency(policy.premiumAmount)}
                </td>
                <td className="view-policies-amount">
                  {formatCurrency(policy.coverageAmount)}
                </td>
                <td>{formatDuration(policy.duration)}</td>
                <td>
                  <span className={`view-policies-status ${policy.isActive ? 'active' : 'inactive'}`}>
                    {policy.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="view-policies-description-cell">
                  <div className="view-policies-description-text">
                    {policy.description}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewPolicies;
