import React, { useEffect, useState } from "react";
import client from "../../../api/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./AppliedPolicies.css";

const AppliedPolicies = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await client.get("/api/user-policies");
      setRows(res.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching policies:", err);
      setError("Failed to load policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const download = (row) => {
    try {
      const doc = new jsPDF();
      const details = (() => {
        try {
          return JSON.parse(row.details || "{}");
        } catch {
          return {};
        }
      })();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(15, 76, 129);
      doc.text("AUTO INSURANCE MANAGEMENT", 14, 20);

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Policy Application Details", 14, 30);

      // Application info
      doc.setFontSize(12);
      doc.text(`Application ID: ${row.id}`, 14, 40);
      doc.text(`Application Date: ${new Date().toLocaleDateString()}`, 14, 47);

      // Vehicle details table
      autoTable(doc, {
        startY: 55,
        head: [["Field", "Details"]],
        body: [
          ["Application ID", String(row.id)],
          ["Vehicle Type", row.type],
          ["Vehicle Number", details.vehicleNumber || "N/A"],
          ["Manufacturer", details.manufacturer || "N/A"],
          ["Model", details.model || "N/A"],
          ["Manufacture Year", String(details.manufactureYear || "N/A")],
          ["Insurance Type", details.insuranceType || "N/A"],
          ["Policy Duration", `${details.durationMonths || 12} months`],
          [
            "Coverage Amount",
            `₹${
              details.coverageAmount
                ? details.coverageAmount.toLocaleString()
                : "N/A"
            }`,
          ],
          ["Processing Fee", details.processingFee ? `₹${details.processingFee}` : "₹199"],
          ["Payment", details.paymentMaskedCard ? `Card ${details.paymentMaskedCard}` : "Received"],
          ["Driving Experience", details.drivingExperience || "N/A"],
          ["Previous Claims", details.previousClaims || "N/A"],
          [
            "Application Date",
            details.applicationDate
              ? new Date(details.applicationDate).toLocaleDateString()
              : new Date().toLocaleDateString(),
          ],
        ],
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [15, 76, 129],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleString()}`,
          14,
          doc.internal.pageSize.height - 10
        );
      }

      doc.save(`policy-application-${row.id}-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      setError("Could not generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "40px 0" }}>
        <div className="card">
          <div className="card-body center" style={{ minHeight: 160 }}>
            <span className="text-body">Loading your policies…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container applied-root">
      <div className="card mb-4 applied-card">
        <div className="card-body">
          <div className="between mb-3 applied-header">
            <h2 className="h2 applied-title">My Applied Policies</h2>
            <button
              className="btn btn-outline"
              onClick={fetchPolicies}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="card mb-3 applied-error">
              <div className="card-body">{error}</div>
            </div>
          )}

          {rows.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <div className="h3 mb-2" style={{ fontWeight: 600 }}>
                  No policies applied yet
                </div>
                <div className="text-body">
                  Apply for your first insurance policy to get started.
                </div>
              </div>
            </div>
          ) : (
            <div className="applied-grid">
              {rows.map((policy) => {
                const details = (() => {
                  try {
                    return JSON.parse(policy.details || "{}");
                  } catch {
                    return {};
                  }
                })();

                return (
                  <div
                    key={policy.id}
                    className="card applied-card"
                    style={{ height: "100%" }}
                  >
                    <div className="card-body">
                      <div className="between mb-2">
                        <div className="h3" style={{ fontWeight: 600 }}>
                          {policy.type}
                        </div>
                        <span className="badge badge-primary applied-badge">
                          ID: {policy.id}
                        </span>
                      </div>

                      <div className="mb-3" style={{ display: "grid", gap: 6 }}>
                        <div className="text-body">
                          <strong>Vehicle:</strong>{" "}
                          {details.manufacturer || "N/A"}{" "}
                          {details.model || "N/A"}
                        </div>
                        <div className="text-body">
                          <strong>Registration:</strong>{" "}
                          {details.vehicleNumber || "N/A"}
                        </div>
                        <div className="text-body">
                          <strong>Coverage:</strong>{" "}
                          {details.insuranceType || "N/A"}
                        </div>
                        <div className="text-body">
                          <strong>Duration:</strong>{" "}
                          {details.durationMonths || 12} months
                        </div>
                        {details.coverageAmount && (
                          <div className="text-body">
                            <strong>Amount:</strong> ₹
                            {details.coverageAmount.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <button
                        className="btn btn-download"
                        onClick={() => download(policy)}
                      >
                        Download Application
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedPolicies;
