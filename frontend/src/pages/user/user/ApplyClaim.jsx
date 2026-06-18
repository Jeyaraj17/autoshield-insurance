import React, { useState, useEffect } from "react";
import client from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import "./ApplyClaim.css";

const ApplyClaim = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    policyId: "",
    claimType: "",
    accidentDate: new Date(),
    description: "",
    estimatedAmount: "",
    contactNumber: "",
    address: "",
    otherReason: "",
    claimImage: null,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [policies, setPolicies] = useState([]);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  // No fee/payment for claims

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await client.get("/api/user-policies");
      setPolicies(res.data || []);
    } catch (err) {
      console.error("Error fetching policies:", err);
    }
  };

  const handleSubmitClaim = async () => {
    try {
      await processClaim();
      setSnack({ open: true, message: "Your claim has been submitted successfully.", severity: "success" });
      setForm({ policyId: "", claimType: "", accidentDate: new Date(), description: "", estimatedAmount: "", contactNumber: "", address: "", otherReason: "", claimImage: null });
    } catch (err) {
      // Error already handled in processClaim
      console.error("Claim submission failed:", err);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.policyId) errors.policyId = "Please select a policy";
    if (!form.claimType) errors.claimType = "Please select claim type";
    if (form.claimType === "Other" && !form.otherReason.trim()) {
      errors.otherReason = "Please specify the reason";
    }
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.estimatedAmount || Number(form.estimatedAmount) <= 0) {
      errors.estimatedAmount = "Please enter a valid damage amount";
    } else {
      const selectedPolicy = policies.find(p => String(p.id) === String(form.policyId));
      if (selectedPolicy) {
        const details = (() => { try { return JSON.parse(selectedPolicy.details || "{}"); } catch { return {}; } })();
        const coverageAmount = Number(details.coverageAmount || 100000);
        if (Number(form.estimatedAmount) > coverageAmount) {
          errors.estimatedAmount = `Damage amount cannot exceed coverage amount of ₹${coverageAmount.toLocaleString()}`;
        }
      }
    }
    if (!form.contactNumber) {
      errors.contactNumber = "Contact number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.contactNumber)) {
      errors.contactNumber = "Enter valid 10-digit Indian mobile number";
    }
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.claimImage) errors.claimImage = "Please upload an image of the damage/incident";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      setSnack({
        open: true,
        message: "Please fix the errors and try again.",
        severity: "error",
      });
      return;
    }

    await handleSubmitClaim();
  };

  const calculateClaimAmount = (policy, claimType, estimatedAmount) => {
    const details = (() => { try { return JSON.parse(policy.details || "{}"); } catch { return {}; } })();
    const coverageAmount = Number(details.coverageAmount || 100000);
    const vehicleValue = Number(details.vehicleValue || coverageAmount);

    let maxClaimable = 0;
    let deductible = 0;

    // Set deductible based on claim type and coverage
    if (details.coverageType === "Comprehensive") {
      deductible = Math.min(vehicleValue * 0.02, 5000); // 2% or ₹5000, whichever is lower

      switch (claimType) {
        case "Accident":
          maxClaimable = Math.min(coverageAmount, vehicleValue * 0.8); // 80% of vehicle value
          break;
        case "Theft":
          maxClaimable = Math.min(coverageAmount, vehicleValue * 0.9); // 90% of vehicle value
          break;
        case "Natural Disaster":
          maxClaimable = Math.min(coverageAmount, vehicleValue * 0.7); // 70% of vehicle value
          break;
        case "Fire":
          maxClaimable = Math.min(coverageAmount, vehicleValue * 0.85); // 85% of vehicle value
          break;
        case "Vandalism":
          maxClaimable = Math.min(coverageAmount, vehicleValue * 0.6); // 60% of vehicle value
          break;
        default:
          maxClaimable = Math.min(coverageAmount, vehicleValue * 0.5);
      }
    } else if (details.coverageType === "Third-Party") {
      // Third-party only covers liability, not own damage
      if (["Accident"].includes(claimType)) {
        maxClaimable = 750000; // Standard third-party liability limit
        deductible = 0;
      } else {
        maxClaimable = 0; // No coverage for theft, fire, etc.
      }
    }

    const requestedAmount = Number(estimatedAmount) || (maxClaimable * 0.3);
    const approvedAmount = Math.min(requestedAmount, maxClaimable) - deductible;

    return {
      requestedAmount,
      maxClaimable,
      deductible,
      approvedAmount: Math.max(0, approvedAmount),
      coverageType: details.coverageType
    };
  };

  const processClaim = async () => {
    setLoading(true);
    try {
      const upRes = await client.get("/api/user-policies");
      const policy = (upRes.data || []).find((x) => String(x.id) === String(form.policyId));

      if (!policy) {
        throw new Error("Policy not found");
      }

      const claimCalculation = calculateClaimAmount(policy, form.claimType, form.estimatedAmount);

      if (claimCalculation.maxClaimable === 0) {
        throw new Error(`${form.claimType} is not covered under your ${claimCalculation.coverageType} policy`);
      }
      // Convert image to base64 for storage
      let imageBase64 = null;
      if (form.claimImage) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(form.claimImage);
        });
      }

      const details = JSON.stringify({
        claimType: form.claimType === "Other" ? form.otherReason : form.claimType,
        description: form.description,
        contactNumber: form.contactNumber,
        address: form.address,
        incidentDate: form.accidentDate.toISOString(),
        requestedAmount: claimCalculation.requestedAmount,
        maxClaimable: claimCalculation.maxClaimable,
        deductible: claimCalculation.deductible,
        approvedAmount: claimCalculation.approvedAmount,
        coverageType: claimCalculation.coverageType,
        claimNumber: `CLM${Date.now()}${Math.floor(Math.random() * 1000)}`,
        otherReason: form.claimType === "Other" ? form.otherReason : null,
      });
      const payload = {
        userId: user?.id,
        policyId: form.policyId ? Number(form.policyId) : null,
        claimType: form.claimType === "Other" ? form.otherReason : form.claimType,
        requestedAmount: claimCalculation.requestedAmount.toString(),
        approvedAmount: claimCalculation.approvedAmount.toString(),
        deductible: claimCalculation.deductible.toString(),
        estimatedAmount: form.estimatedAmount.toString(),
        description: form.description,
        incidentDate: form.accidentDate.toISOString().split('T')[0] + 'T00:00:00',
        status: "PENDING",
        paymentStatus: "RECEIVED",
        details,
        imageUrl: imageBase64,
        claimNumber: `CLM${Date.now()}${Math.floor(Math.random() * 1000)}`,
      };

      console.log('=== FRONTEND CLAIM SUBMISSION ===' );
      console.log('Submitting claim payload:', JSON.stringify(payload, null, 2));
      console.log('Payload keys:', Object.keys(payload));
      console.log('UserId type:', typeof payload.userId, payload.userId);
      console.log('PolicyId type:', typeof payload.policyId, payload.policyId);

      const response = await client.post("/api/claims", payload);
      console.log('Claim submitted successfully:', response.data);
      
      if (!response.data || typeof response.data === 'string') {
        throw new Error(response.data || 'Unexpected response format');
      }
    } catch (err) {
      console.error("=== CLAIM SUBMISSION ERROR ===");
      console.error("Error object:", err);
      console.error("Error message:", err.message);
      console.error("Error response:", err.response);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      console.error("Response headers:", err.response?.headers);
      
      let errorMessage = "Failed to submit claim. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setSnack({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      throw err; // Re-throw to prevent success message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-claim-container">
      <div className="apply-claim-card">
        <h2 className="apply-claim-title">Apply for Insurance Claim</h2>
        <p className="apply-claim-description">Submit your claim details below. No payment required.</p>

        <form onSubmit={submit} className="apply-claim-form">
          <div className="apply-claim-grid">
            {/* Policy Selection */}
            <div className="apply-claim-field">
              <label className="apply-claim-label">Select Policy *</label>
              <select
                className="apply-claim-select"
                value={form.policyId}
                onChange={(e) => setForm({ ...form, policyId: e.target.value })}
                required
              >
                <option value="">Select a policy</option>
                {policies.map((policy) => {
                  const details = (() => {
                    try {
                      return JSON.parse(policy.details || "{}");
                    } catch {
                      return {};
                    }
                  })();
                  return (
                    <option key={policy.id} value={policy.id}>
                      {policy.type} - {details.vehicleNumber || "N/A"} ({details.model || "N/A"})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Claim Type */}
            <div className="apply-claim-field">
              <label className="apply-claim-label">Claim Type *</label>
              <select
                className={`apply-claim-select ${validationErrors.claimType ? 'error' : ''}`}
                value={form.claimType}
                onChange={(e) => setForm({ ...form, claimType: e.target.value })}
                required
              >
                <option value="">Select claim type</option>
                <option value="Accident">Accident</option>
                <option value="Theft">Theft</option>
                <option value="Natural Disaster">Natural Disaster</option>
                <option value="Fire">Fire</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.claimType && (
                <span className="apply-claim-error-text">{validationErrors.claimType}</span>
              )}
            </div>

            {/* Other Reason - Show only when Other is selected */}
            {form.claimType === "Other" && (
              <div className="apply-claim-field full-width">
                <label className="apply-claim-label">Specify Reason *</label>
                <textarea
                  className={`apply-claim-textarea ${validationErrors.otherReason ? 'error' : ''}`}
                  value={form.otherReason}
                  onChange={(e) => setForm({ ...form, otherReason: e.target.value })}
                  placeholder="Please specify the reason for your claim..."
                  rows={3}
                  required
                />
                {validationErrors.otherReason && (
                  <span className="apply-claim-error-text">{validationErrors.otherReason}</span>
                )}
              </div>
            )}

            {/* Incident Date */}
            <div className="apply-claim-field">
              <label className="apply-claim-label">Incident Date *</label>
              <input
                className="apply-claim-input"
                type="date"
                value={form.accidentDate.toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, accidentDate: new Date(e.target.value) })}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Estimated Amount */}
            <div className="apply-claim-field">
              <label className="apply-claim-label">Estimated Damage Amount (₹) *</label>
              <input
                className={`apply-claim-input ${validationErrors.estimatedAmount ? 'error' : ''}`}
                type="number"
                value={form.estimatedAmount}
                onChange={(e) => setForm({ ...form, estimatedAmount: e.target.value })}
                placeholder="Enter estimated repair/replacement cost"
                min="1"
                required
              />
              {validationErrors.estimatedAmount ? (
                <span className="apply-claim-error-text">{validationErrors.estimatedAmount}</span>
              ) : (
                <small style={{ color: '#64748b', fontSize: '12px' }}>
                  Enter the estimated cost of damage/repair
                  {form.policyId && (() => {
                    const policy = policies.find(p => String(p.id) === String(form.policyId));
                    if (policy) {
                      const details = (() => { try { return JSON.parse(policy.details || "{}"); } catch { return {}; } })();
                      return ` (Max: ₹${Number(details.coverageAmount || 100000).toLocaleString()})`;
                    }
                    return '';
                  })()}
                </small>
              )}
            </div>
          </div>

          <div className="apply-claim-divider"></div>
          <h3 className="apply-claim-section-title">Contact Information</h3>

          <div className="apply-claim-grid">
            {/* Contact Number */}
            <div className="apply-claim-field">
              <label className="apply-claim-label">Contact Number *</label>
              <input
                className={`apply-claim-input ${validationErrors.contactNumber ? 'error' : ''}`}
                value={form.contactNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  setForm({ ...form, contactNumber: value });
                }}
                placeholder="9876543210"
                maxLength="10"
                required
              />
              {validationErrors.contactNumber ? (
                <span className="apply-claim-error-text">{validationErrors.contactNumber}</span>
              ) : (
                <small style={{ color: '#64748b', fontSize: '12px' }}>Enter 10-digit mobile number</small>
              )}
            </div>

            {/* Address */}
            <div className="apply-claim-field full-width">
              <label className="apply-claim-label">Address *</label>
              <textarea
                className={`apply-claim-textarea ${validationErrors.address ? 'error' : ''}`}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Enter your complete address"
                rows={3}
                required
              />
              {validationErrors.address && (
                <span className="apply-claim-error-text">{validationErrors.address}</span>
              )}
            </div>

            {/* Description */}
            <div className="apply-claim-field full-width">
              <label className="apply-claim-label">Incident Description *</label>
              <textarea
                className={`apply-claim-textarea ${validationErrors.description ? 'error' : ''}`}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Please provide detailed description of the incident..."
                rows={4}
                required
              />
              {validationErrors.description && (
                <span className="apply-claim-error-text">{validationErrors.description}</span>
              )}
            </div>

            {/* Image Upload */}
            <div className="apply-claim-field full-width">
              <label className="apply-claim-label">Upload Damage/Incident Photo *</label>
              <input
                className={`apply-claim-input ${validationErrors.claimImage ? 'error' : ''}`}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 5 * 1024 * 1024) {
                    alert('File size should be less than 5MB');
                    return;
                  }
                  setForm({ ...form, claimImage: file });
                }}
                required
              />
              {validationErrors.claimImage ? (
                <span className="apply-claim-error-text">{validationErrors.claimImage}</span>
              ) : (
                <small style={{ color: '#64748b', fontSize: '12px' }}>Upload clear photo of damage/incident (Max 5MB)</small>
              )}
              {form.claimImage && (
                <div style={{ marginTop: '8px' }}>
                  <img
                    src={URL.createObjectURL(form.claimImage)}
                    alt="Claim preview"
                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="apply-claim-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="apply-claim-loading"></div>
                Processing...
              </>
            ) : (
              "Submit Claim"
            )}
          </button>
        </form>
      </div>


      {snack.open && (
        <div className="apply-claim-snackbar">
          <div className={`apply-claim-snackbar-content ${snack.severity}`}>
            <span>{snack.message}</span>
            <button
              className="apply-claim-snackbar-close"
              onClick={() => setSnack({ ...snack, open: false })}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyClaim;
