import React, { useState } from "react";
import client from "../../../api/client";
import "./CreatePolicy.css";

const CreatePolicy = () => {
  const [form, setForm] = useState({
    policyName: "",
    vehicleType: "Two-Wheeler",
    coverageType: "Comprehensive",
    premiumAmount: "",
    coverageAmount: "",
    duration: 12,
    description: "",
    benefits: "",
    terms: "",
    isActive: true
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Calculate coverage amount based on premium, vehicle type, duration, and coverage type
  const calculateCoverageAmount = (premium, vehicleType, duration, coverageType) => {
    if (!premium || premium < 1000) return '';

    let multiplier = 20; // Base multiplier (20x premium)

    // Vehicle type multiplier
    if (vehicleType === 'Two-Wheeler') {
      multiplier = 15; // Lower coverage for bikes
    } else if (vehicleType === 'Four-Wheeler') {
      multiplier = 25; // Higher coverage for cars
    }

    // Coverage type multiplier
    if (coverageType === 'Comprehensive') {
      multiplier *= 1.5;
    } else if (coverageType === 'Zero Depreciation') {
      multiplier *= 1.8;
    } else if (coverageType === 'Third-Party') {
      multiplier *= 0.3;
    }

    // Duration multiplier
    const durationMultiplier = duration / 12; // Normalize to years
    multiplier *= Math.sqrt(durationMultiplier); // Diminishing returns for longer duration

    const coverage = Math.round(premium * multiplier / 1000) * 1000; // Round to nearest thousand
    return Math.max(coverage, 100000); // Minimum 1 lakh coverage
  };

  // Auto-calculate coverage when premium, vehicle type, duration, or coverage type changes
  React.useEffect(() => {
    const newCoverage = calculateCoverageAmount(
      parseFloat(form.premiumAmount),
      form.vehicleType,
      parseInt(form.duration),
      form.coverageType
    );
    if (newCoverage && newCoverage !== form.coverageAmount) {
      setForm(prev => ({ ...prev, coverageAmount: newCoverage.toString() }));
    }
  }, [form.premiumAmount, form.vehicleType, form.duration, form.coverageType]);

  const validateForm = () => {
    const errors = {};

    if (!form.policyName.trim()) {
      errors.policyName = "Policy name is required";
    }

    if (!form.premiumAmount || form.premiumAmount < 1000) {
      errors.premiumAmount = "Premium amount must be at least ₹1,000";
    }

    if (!form.coverageAmount || form.coverageAmount < 100000) {
      errors.coverageAmount = "Coverage amount must be at least ₹1,00,000";
    }

    if (!form.description.trim()) {
      errors.description = "Policy description is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const policyData = {
        policyName: form.policyName,
        vehicleType: form.vehicleType,
        coverageType: form.coverageType,
        premiumAmount: form.premiumAmount.toString(),
        coverageAmount: form.coverageAmount.toString(),
        duration: parseInt(form.duration),
        description: form.description || `Comprehensive ${form.vehicleType} insurance policy providing extensive coverage for your vehicle. This policy includes protection against accidents, theft, natural disasters, and third-party liabilities.`,
        benefits: form.benefits || `24/7 Roadside Assistance\nCashless Garage Network\nNo Claim Bonus\nPersonal Accident Cover\nZero Depreciation Coverage`,
        terms: form.terms || `Policy is valid for ${form.duration} months from the start date. Premium must be paid in full before policy activation. Claims must be reported within 48 hours of incident. Deductible applies as per policy terms. Coverage subject to policy limits and exclusions.`,
        isActive: form.isActive,
        createdByAdmin: 1
      };

      await client.post("/api/policies", policyData);
      setMessage("Policy created successfully!");

      // Reset form
      setForm({
        policyName: "",
        vehicleType: "Two-Wheeler",
        coverageType: "Comprehensive",
        premiumAmount: "",
        coverageAmount: "",
        duration: 12,
        description: "",
        benefits: "",
        terms: "",
        isActive: true
      });
    } catch (err) {
      console.error("Policy creation error:", err);
      setMessage(err.response?.data?.message || "Failed to create policy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-policy-container">
      <h2 className="create-policy-title">Create Insurance Policy</h2>
      <p className="create-policy-description">
        Create new insurance policies that users can view and apply for. Fill in all the required details to make the policy available.
      </p>

      {message && (
        <div className={`create-policy-alert ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={submit} className="create-policy-form">
        <div className="create-policy-grid">
          {/* Policy Name */}
          <div className="create-policy-field full-width">
            <label className="create-policy-label">Policy Name *</label>
            <input
              className={`create-policy-input ${validationErrors.policyName ? 'error' : ''}`}
              value={form.policyName}
              onChange={(e) => setForm({ ...form, policyName: e.target.value })}
              placeholder="e.g., Premium Bike Insurance, Family Car Protection"
              required
            />
            {validationErrors.policyName && (
              <span className="create-policy-error-text">{validationErrors.policyName}</span>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="create-policy-field">
            <label className="create-policy-label">Vehicle Type *</label>
            <select
              className="create-policy-select"
              value={form.vehicleType}
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
            >
              <option value="Two-Wheeler">Two-Wheeler</option>
              <option value="Four-Wheeler">Four-Wheeler</option>
            </select>
          </div>

          {/* Coverage Type */}
          <div className="create-policy-field">
            <label className="create-policy-label">Coverage Type *</label>
            <select
              className="create-policy-select"
              value={form.coverageType}
              onChange={(e) => setForm({ ...form, coverageType: e.target.value })}
            >
              <option value="Comprehensive">Comprehensive</option>
              <option value="Third-Party">Third-Party</option>
              <option value="Zero Depreciation">Zero Depreciation</option>
              <option value="Personal Accident">Personal Accident</option>
            </select>
          </div>

          {/* Premium Amount */}
          <div className="create-policy-field">
            <label className="create-policy-label">Premium Amount (₹) *</label>
            <input
              className={`create-policy-input ${validationErrors.premiumAmount ? 'error' : ''}`}
              type="number"
              value={form.premiumAmount}
              onChange={(e) => setForm({ ...form, premiumAmount: e.target.value })}
              min="1000"
              step="100"
              placeholder="5000"
              required
            />
            {validationErrors.premiumAmount ? (
              <span className="create-policy-error-text">{validationErrors.premiumAmount}</span>
            ) : (
              <span className="create-policy-helper-text">Minimum ₹1,000</span>
            )}
          </div>

          {/* Coverage Amount - Auto-calculated */}
          <div className="create-policy-field">
            <label className="create-policy-label">Coverage Amount (₹) - Auto Calculated</label>
            <input
              className="create-policy-input"
              type="number"
              value={form.coverageAmount}
              readOnly
              style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed' }}
              placeholder="Auto-calculated based on premium"
            />
            <span className="create-policy-helper-text">
              Automatically calculated: {form.premiumAmount ? `₹${parseFloat(form.premiumAmount || 0).toLocaleString()} × ${Math.round(calculateCoverageAmount(parseFloat(form.premiumAmount), form.vehicleType, parseInt(form.duration), form.coverageType) / parseFloat(form.premiumAmount || 1))}` : 'Enter premium amount'}
            </span>
          </div>

          {/* Duration */}
          <div className="create-policy-field">
            <label className="create-policy-label">Policy Duration (Months) *</label>
            <select
              className="create-policy-select"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            >
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
            </select>
          </div>
        </div>

        <div className="create-policy-divider"></div>
        <h3 className="create-policy-section-title">Policy Details</h3>

        <div className="create-policy-grid">
          {/* Description */}
          <div className="create-policy-field full-width">
            <label className="create-policy-label">Policy Description *</label>
            <textarea
              className={`create-policy-textarea ${validationErrors.description ? 'error' : ''}`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what this policy covers and its key features..."
              rows={4}
              required
            />
            {validationErrors.description && (
              <span className="create-policy-error-text">{validationErrors.description}</span>
            )}
          </div>

          {/* Benefits */}
          <div className="create-policy-field full-width">
            <label className="create-policy-label">Key Benefits</label>
            <textarea
              className="create-policy-textarea"
              value={form.benefits}
              onChange={(e) => setForm({ ...form, benefits: e.target.value })}
              placeholder="List the key benefits of this policy (one per line)..."
              rows={3}
            />
            <span className="create-policy-helper-text">One benefit per line</span>
          </div>

          {/* Terms & Conditions */}
          <div className="create-policy-field full-width">
            <label className="create-policy-label">Terms & Conditions</label>
            <textarea
              className="create-policy-textarea"
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              placeholder="Enter important terms and conditions..."
              rows={3}
            />
          </div>
        </div>

        <button
          type="submit"
          className="create-policy-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="create-policy-loading"></div>
              Creating Policy...
            </>
          ) : (
            "Create Policy"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePolicy;
