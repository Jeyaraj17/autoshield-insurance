import React, { useEffect, useState } from "react";
import client from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import "./AvailablePolicies.css";

const AvailablePolicies = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("view"); // view | apply
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyForm, setApplyForm] = useState({
    vehicleNumber: "",
    manufacturer: "",
    model: "",
    manufactureYear: "",
    startDate: "",
    endDate: "",
    vehicleValue: "",
  });
  const [calculatedPremium, setCalculatedPremium] = useState(null);
  const [paymentMode, setPaymentMode] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  const validateVehicleNumber = (vehicleNum) => {
    const pattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    return pattern.test(vehicleNum.replace(/[\s-]/g, ''));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const validateManufacturer = (value) => {
    return /^[a-zA-Z\s]+$/.test(value);
  };

  const validateCVV = (value) => {
    return /^[0-9]{3}$/.test(value);
  };

  const validateInsuranceDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 365;
  };

  const validateManufactureYear = (year) => {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    return yearNum <= currentYear && yearNum >= 1900;
  };



  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await client.get("/api/policies");
      setPolicies(res.data || []);
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

  const filteredPolicies = policies.filter((policy) => {
    const matchesFilter = filter === "All" || policy.vehicleType === filter;
    const matchesSearch =
      (policy.policyName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (policy.coverageType?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    return matchesFilter && matchesSearch && policy.isActive;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDuration = (months) => {
    if (months === 12) return "1 Year";
    if (months === 24) return "2 Years";
    if (months === 36) return "3 Years";
    return `${months} Months`;
  };

  if (loading) {
    return (
      <div className="available-policies-container">
        <div className="available-policies-loading">
          <div className="available-policies-spinner"></div>
          <p>Loading available policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="available-policies-container">
      <div className="available-policies-header">
        <h2 className="available-policies-title">
          Available Insurance Policies
        </h2>
        <p className="available-policies-description">
          Browse and compare our comprehensive insurance policies. Choose the
          one that best fits your needs.
        </p>
      </div>

      {error && (
        <div className="available-policies-error">
          <p>{error}</p>
          <button
            className="available-policies-retry-btn"
            onClick={fetchPolicies}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="available-policies-filters">
        <div className="available-policies-search">
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="available-policies-search-input"
          />
        </div>
        <div className="available-policies-filter-buttons">
          <button
            className={`available-policies-filter-btn ${
              filter === "All" ? "active" : ""
            }`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
          <button
            className={`available-policies-filter-btn ${
              filter === "Two-Wheeler" ? "active" : ""
            }`}
            onClick={() => setFilter("Two-Wheeler")}
          >
            Two-Wheeler
          </button>
          <button
            className={`available-policies-filter-btn ${
              filter === "Four-Wheeler" ? "active" : ""
            }`}
            onClick={() => setFilter("Four-Wheeler")}
          >
            Four-Wheeler
          </button>
        </div>
      </div>

      {filteredPolicies.length === 0 ? (
        <div className="available-policies-empty">
          <div className="available-policies-empty-icon">📋</div>
          <h3>No policies found</h3>
          <p>
            {searchTerm || filter !== "All"
              ? "Try adjusting your search or filter criteria."
              : "No insurance policies are currently available. Please check back later."}
          </p>
        </div>
      ) : (
        <div className="available-policies-grid">
          {filteredPolicies.map((policy) => (
            <div key={policy.id} className="available-policies-card">
              <div className="available-policies-card-header">
                <div className="available-policies-card-type">
                  {policy.vehicleType === "Two-Wheeler" ? "🏍️" : "🚗"}
                </div>
                <div className="available-policies-card-badge">
                  {policy.coverageType}
                </div>
              </div>

              <h3 className="available-policies-card-title">
                {policy.policyName}
              </h3>

              <div className="available-policies-card-pricing">
                <div className="available-policies-card-premium">
                  <span className="available-policies-card-label">Premium</span>
                  <span className="available-policies-card-amount">
                    {formatCurrency(policy.premiumAmount)}
                  </span>
                </div>
                <div className="available-policies-card-coverage">
                  <span className="available-policies-card-label">
                    Coverage
                  </span>
                  <span className="available-policies-card-amount">
                    {formatCurrency(policy.coverageAmount)}
                  </span>
                </div>
                <div className="available-policies-card-duration">
                  <span className="available-policies-card-label">
                    Duration
                  </span>
                  <span className="available-policies-card-value">
                    {formatDuration(policy.duration)}
                  </span>
                </div>
              </div>

              <div className="available-policies-card-description">
                <p>{policy.description}</p>
              </div>

              {policy.benefits && (
                <div className="available-policies-card-benefits">
                  <h4>Key Benefits:</h4>
                  <ul>
                    {policy.benefits
                      .split("\n")
                      .filter((benefit) => benefit.trim())
                      .map((benefit, index) => (
                        <li key={index}>{benefit.trim()}</li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="available-policies-card-actions">
                <button
                  className="available-policies-card-btn available-policies-card-btn-primary"
                  onClick={() => {
                    if (!user) {
                      alert("Please login to apply for policies.");
                      return;
                    }
                    setSelectedPolicy(policy);
                    setApplyMessage("");
                    setDialogMode("apply");
                    setShowDialog(true);
                  }}
                >
                  {user ? "Apply Now" : "Login to Apply"}
                </button>
                <button
                  className="available-policies-card-btn available-policies-card-btn-secondary"
                  onClick={() => {
                    setSelectedPolicy(policy);
                    setApplyMessage("");
                    setDialogMode("view");
                    setShowDialog(true);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDialog && selectedPolicy && (
        <div className="policy-dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="policy-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="policy-dialog-header">
              <h3>{selectedPolicy.policyName}</h3>
              <button className="dialog-close-btn" onClick={() => setShowDialog(false)}>×</button>
            </div>
            <div className="policy-dialog-body">
              {dialogMode === "view" && (
                <>
                  <div className="policy-dialog-row">
                    <div><strong>Vehicle:</strong> {selectedPolicy.vehicleType}</div>
                    <div><strong>Coverage:</strong> {selectedPolicy.coverageType}</div>
                    <div><strong>Duration:</strong> {formatDuration(selectedPolicy.duration)}</div>
                  </div>
                  <div className="policy-dialog-row">
                    <div><strong>Premium:</strong> {formatCurrency(selectedPolicy.premiumAmount)}</div>
                    <div><strong>Coverage Amount:</strong> {formatCurrency(selectedPolicy.coverageAmount)}</div>
                  </div>
                  <div className="policy-dialog-section">
                    <div className="h4">Description</div>
                    <p>{selectedPolicy.description}</p>
                  </div>
                  {selectedPolicy.benefits && (
                    <div className="policy-dialog-section">
                      <div className="h4">Benefits</div>
                      <ul>
                        {selectedPolicy.benefits
                          .split("\n")
                          .filter((b) => b.trim())
                          .map((b, idx) => (
                            <li key={idx}>{b.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  {selectedPolicy.terms && (
                    <div className="policy-dialog-section">
                      <div className="h4">Terms & Conditions</div>
                      <p>{selectedPolicy.terms}</p>
                    </div>
                  )}
                </>
              )}

              {dialogMode === "apply" && !paymentMode && (
                <>
                  <div className="policy-dialog-section">
                    <div className="h4">Application Details</div>
                    <div className="policy-form-grid">
                      <label>
                        <span>Vehicle Number *</span>
                        <input 
                          value={applyForm.vehicleNumber} 
                          onChange={(e)=>setApplyForm({...applyForm, vehicleNumber:e.target.value.toUpperCase()})} 
                          placeholder="TN59CH0876" 
                          style={{borderColor: applyForm.vehicleNumber && !validateVehicleNumber(applyForm.vehicleNumber) ? '#dc2626' : '#ddd'}}
                        />
                        {applyForm.vehicleNumber && !validateVehicleNumber(applyForm.vehicleNumber) && (
                          <span style={{color: '#dc2626', fontSize: '12px'}}>Invalid format. Use: TN59CH0876</span>
                        )}
                      </label>
                      <label>
                        <span>Manufacturer *</span>
                        <input 
                          value={applyForm.manufacturer} 
                          onChange={(e)=>{
                            const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                            setApplyForm({...applyForm, manufacturer:value});
                          }} 
                          placeholder="Honda" 
                          style={{borderColor: applyForm.manufacturer && !validateManufacturer(applyForm.manufacturer) ? '#dc2626' : '#ddd'}}
                        />
                        {applyForm.manufacturer && !validateManufacturer(applyForm.manufacturer) && (
                          <span style={{color: '#dc2626', fontSize: '12px'}}>Only letters and spaces allowed</span>
                        )}
                      </label>
                      <label>
                        <span>Model *</span>
                        <input value={applyForm.model} onChange={(e)=>setApplyForm({...applyForm, model:e.target.value})} placeholder="City" />
                      </label>
                      <label>
                        <span>Manufacture Year *</span>
                        <input 
                          type="number" 
                          value={applyForm.manufactureYear} 
                          onChange={(e)=>setApplyForm({...applyForm, manufactureYear:e.target.value})} 
                          placeholder="2022" 
                          max={new Date().getFullYear()}
                          min="1900"
                          style={{borderColor: applyForm.manufactureYear && !validateManufactureYear(applyForm.manufactureYear) ? '#dc2626' : '#ddd'}}
                        />
                        {applyForm.manufactureYear && !validateManufactureYear(applyForm.manufactureYear) && (
                          <span style={{color: '#dc2626', fontSize: '12px'}}>Year must be current year or earlier</span>
                        )}
                      </label>
                      <label>
                        <span>Start Date *</span>
                        <input 
                          type="date" 
                          value={applyForm.startDate} 
                          onChange={(e)=>setApplyForm({...applyForm, startDate:e.target.value})} 
                          min={applyForm.manufactureYear ? `${applyForm.manufactureYear}-01-01` : new Date().toISOString().split('T')[0]}
                          style={{borderColor: applyForm.startDate && applyForm.manufactureYear && new Date(applyForm.startDate).getFullYear() < parseInt(applyForm.manufactureYear) ? '#dc2626' : '#ddd'}}
                        />
                        {applyForm.startDate && applyForm.manufactureYear && new Date(applyForm.startDate).getFullYear() < parseInt(applyForm.manufactureYear) && (
                          <span style={{color: '#dc2626', fontSize: '12px'}}>Start date must be after manufacture year</span>
                        )}
                      </label>
                      <label>
                        <span>End Date *</span>
                        <input type="date" value={applyForm.endDate} onChange={(e)=>setApplyForm({...applyForm, endDate:e.target.value})} />
                      </label>
                      <label>
                        <span>Vehicle Value (₹) *</span>
                        <input 
                          type="number" 
                          value={applyForm.vehicleValue} 
                          onChange={(e)=>setApplyForm({...applyForm, vehicleValue:e.target.value})} 
                          placeholder="500000" 
                        />
                      </label>

                      <div className="premium-info" style={{gridColumn: '1 / -1', padding: '12px', background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px'}}>
                        <div style={{fontWeight: 'bold', color: '#0369a1'}}>Premium: ₹{selectedPolicy.premiumAmount.toLocaleString()}</div>
                        <div style={{fontWeight: 'bold', color: '#0369a1'}}>Coverage: ₹{selectedPolicy.coverageAmount.toLocaleString()}</div>
                        <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>Fixed premium as per policy terms</div>
                      </div>

                    </div>
                  </div>
                </>
              )}
              {dialogMode === "apply" && paymentMode && (
                <>
                  <div className="policy-dialog-section">
                    <div className="h4">Payment</div>
                    <div className="policy-form-grid">
                      <label className="full">
                        <span>Premium Amount (₹)</span>
                        <input value={selectedPolicy.premiumAmount} disabled style={{fontWeight: 'bold', background: '#f0f9ff'}} />
                      </label>
                      <label className="full">
                        <span>Card Number</span>
                        <input 
                          value={card.number} 
                          onChange={(e)=>setCard({...card, number:formatCardNumber(e.target.value)})} 
                          placeholder="1234 5678 9012 3456" 
                          maxLength="19"
                        />
                      </label>
                      <label>
                        <span>Expiry</span>
                        <input 
                          type="month" 
                          value={card.expiry} 
                          onChange={(e)=>setCard({...card, expiry:e.target.value})} 
                          min={new Date().toISOString().slice(0,7)}
                        />
                      </label>
                      <label>
                        <span>CVV</span>
                        <input 
                          value={card.cvv} 
                          onChange={(e)=>{
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0,3);
                            setCard({...card, cvv:value});
                          }} 
                          placeholder="123" 
                          maxLength="3"
                          style={{borderColor: card.cvv && !validateCVV(card.cvv) ? '#dc2626' : '#ddd'}}
                        />
                        {card.cvv && !validateCVV(card.cvv) && (
                          <span style={{color: '#dc2626', fontSize: '12px'}}>Must be exactly 3 digits</span>
                        )}
                      </label>
                    </div>
                  </div>
                </>
              )}
              {applyMessage && (
                <div className="available-policies-error" style={{marginTop: 12}}>
                  <p>{applyMessage}</p>
                </div>
              )}
            </div>
            <div className="policy-dialog-footer">
              {dialogMode === "view" ? (
                <button
                  className="available-policies-card-btn available-policies-card-btn-primary"
                  onClick={() => setDialogMode("apply")}
                >
                  Continue to Application
                </button>
              ) : !paymentMode ? (
                <button
                  className="available-policies-card-btn available-policies-card-btn-primary"
                  disabled={applyLoading}
                  onClick={async () => {
                    try {
                      if (!applyForm.vehicleNumber || !applyForm.manufacturer || !applyForm.model || !applyForm.manufactureYear || !applyForm.startDate || !applyForm.endDate || !applyForm.vehicleValue) {
                        setApplyMessage("Please fill all required fields.");
                        return;
                      }
                      if (new Date(applyForm.startDate).getFullYear() < parseInt(applyForm.manufactureYear)) {
                        setApplyMessage("Start date must be after the manufacture year.");
                        return;
                      }
                      if (!validateVehicleNumber(applyForm.vehicleNumber)) {
                        setApplyMessage("Please enter a valid vehicle number (e.g., TN59CH0876).");
                        return;
                      }
                      if (!validateManufacturer(applyForm.manufacturer)) {
                        setApplyMessage("Manufacturer name should contain only letters.");
                        return;
                      }
                      if (!validateInsuranceDuration(applyForm.startDate, applyForm.endDate)) {
                        setApplyMessage("Insurance duration must be at least 1 year.");
                        return;
                      }
                      if (!validateManufactureYear(applyForm.manufactureYear)) {
                        setApplyMessage("Manufacture year must be current year or earlier.");
                        return;
                      }
                      setApplyMessage("");
                      setPaymentMode(true);
                    } catch (err) {
                      console.error("Apply error", err);
                      setApplyMessage(
                        err.response?.data?.message || "Could not apply. Please try again."
                      );
                    }
                  }}
                >
                  Proceed to Payment
                </button>
              ) : (
                <button
                  className="available-policies-card-btn available-policies-card-btn-primary"
                  disabled={applyLoading}
                  onClick={async () => {
                    try {
                      // Check authentication first
                      if (!user) {
                        setApplyMessage("Please login to apply for policies.");
                        return;
                      }
                      
                      if (!card.number || !card.expiry || !card.cvv) {
                        setApplyMessage("Enter valid payment details.");
                        return;
                      }
                      if (!validateCVV(card.cvv)) {
                        setApplyMessage("CVV must be exactly 3 digits.");
                        return;
                      }
                      setApplyLoading(true);
                      console.log('Submitting policy application...');
                      console.log('Current user:', user);
                      
                      const response = await client.post("/api/user-policies", {
                        policyId: selectedPolicy.id,
                        type: selectedPolicy.vehicleType,
                        details: JSON.stringify({
                          policyName: selectedPolicy.policyName,
                          coverageType: selectedPolicy.coverageType,
                          durationMonths: selectedPolicy.duration,
                          coverageAmount: selectedPolicy.coverageAmount,
                          premiumAmount: selectedPolicy.premiumAmount,
                          applicationDate: new Date().toISOString(),
                          vehicleValue: applyForm.vehicleValue,
                          paymentMaskedCard: `**** ${String(card.number).slice(-4)}`,
                          ...applyForm,
                        }),
                      });
                      console.log('Policy application response:', response.data);
                      setApplyMessage("Applied successfully!");
                      setTimeout(() => {
                        setShowDialog(false);
                        window.location.href = "/user/applied-policies";
                      }, 600);
                    } catch (err) {
                      console.error("Apply error", err);
                      console.error("Error response:", err.response);
                      console.error("Error status:", err.response?.status);
                      console.error("Error data:", err.response?.data);
                      
                      let errorMessage = "Could not apply. Please try again.";
                      if (err.response?.status === 401) {
                        errorMessage = "Please login to apply for policies. Your session may have expired.";
                      } else if (err.response?.status === 500) {
                        errorMessage = "Server error. Please try again later.";
                      } else if (typeof err.response?.data === 'string') {
                        errorMessage = err.response.data;
                      } else if (err.response?.data?.message) {
                        errorMessage = err.response.data.message;
                      } else if (err.message) {
                        errorMessage = err.message;
                      }
                      
                      setApplyMessage(errorMessage);
                    } finally {
                      setApplyLoading(false);
                    }
                  }}
                >
                  {applyLoading ? "Paying..." : "Pay Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailablePolicies;
