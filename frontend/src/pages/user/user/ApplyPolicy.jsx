// import React, { useEffect, useState } from "react";
// import client from "../../../api/client";
// import "./ApplyPolicy.css";

// const ApplyPolicy = () => {
//   const [form, setForm] = useState({
//     type: "Two-Wheeler",
//     vehicleNumber: "",
//     model: "",
//     manufacturer: "",
//     manufactureYear: new Date().getFullYear(),
//     insuranceType: "Comprehensive",
//     durationMonths: 12,
//     coverageAmount: "",
//     previousClaims: "No",
//     drivingExperience: "",
//   });
//   const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
//   const [loading, setLoading] = useState(false);
//   const [paymentDialog, setPaymentDialog] = useState(false);
//   const [processingFee] = useState("199");
//   const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
//   const [validationErrors, setValidationErrors] = useState({});

//   const validateForm = () => {
//     const errors = {};
    
//     if (!form.vehicleNumber.trim()) {
//       errors.vehicleNumber = "Vehicle number is required";
//     } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(form.vehicleNumber.toUpperCase())) {
//       errors.vehicleNumber = "Please enter a valid vehicle number (e.g., TN01AB1234)";
//     }
    
//     if (!form.model.trim()) {
//       errors.model = "Vehicle model is required";
//     }
    
//     if (!form.manufacturer.trim()) {
//       errors.manufacturer = "Manufacturer is required";
//     }
    
//     if (form.manufactureYear < 1990 || form.manufactureYear > new Date().getFullYear()) {
//       errors.manufactureYear = "Please enter a valid manufacture year";
//     }
    
//     if (!form.coverageAmount || form.coverageAmount < 100000) {
//       errors.coverageAmount = "Coverage amount must be at least ₹1,00,000";
//     }
    
//     if (!form.drivingExperience) {
//       errors.drivingExperience = "Driving experience is required";
//     }
    
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setValidationErrors({});
    
//     if (!validateForm()) {
//       return;
//     }
//     setPaymentDialog(true);
//   };

//   const confirmSubmit = async () => {
//     if (!card.number || !card.expiry || !card.cvv) {
//       setSnack({ open: true, message: "Enter valid payment details.", severity: "error" });
//       return;
//     }
//     setLoading(true);
//     try {
//       const details = JSON.stringify({
//         ...form,
//         vehicleNumber: form.vehicleNumber.toUpperCase(),
//         applicationDate: new Date().toISOString(),
//         processingFee: Number(processingFee),
//         paymentMaskedCard: card.number ? `**** ${card.number.slice(-4)}` : "",
//       });
//       const payload = { type: form.type, details };
//       await client.post("/api/user-policies", payload);
//       setSnack({ open: true, message: "Application submitted with processing fee.", severity: "success" });
//       setPaymentDialog(false);
//       setForm({
//         type: "Two-Wheeler",
//         vehicleNumber: "",
//         model: "",
//         manufacturer: "",
//         manufactureYear: new Date().getFullYear(),
//         insuranceType: "Comprehensive",
//         durationMonths: 12,
//         coverageAmount: "",
//         previousClaims: "No",
//         drivingExperience: "",
//       });
//     } catch (err) {
//       console.error("Policy application error:", err);
//       setSnack({ open: true, message: err.response?.data?.message || "Application submission failed.", severity: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="apply-policy-container">
//       <div className="apply-policy-card">
//         <h2 className="apply-policy-title">Apply for Insurance Policy</h2>
//         <p className="apply-policy-description">
//           Fill out the form below to apply for your vehicle insurance policy. All fields marked with * are required.
//         </p>
        
//         <form onSubmit={submit} className="apply-policy-form">
//           <div className="apply-policy-grid">
//             {/* Vehicle Type */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Vehicle Type *</label>
//               <select
//                 className="apply-policy-select"
//                 value={form.type}
//                 onChange={(e) => setForm({ ...form, type: e.target.value })}
//               >
//                 <option value="Two-Wheeler">Two-Wheeler</option>
//                 <option value="Four-Wheeler">Four-Wheeler</option>
//               </select>
//             </div>

//             {/* Vehicle Number */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Vehicle Registration Number *</label>
//               <input
//                 className={`apply-policy-input ${validationErrors.vehicleNumber ? 'error' : ''}`}
//                 value={form.vehicleNumber}
//                 onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })}
//                 placeholder="TN01AB1234"
//               />
//               {validationErrors.vehicleNumber ? (
//                 <span className="apply-policy-error-text">{validationErrors.vehicleNumber}</span>
//               ) : (
//                 <span className="apply-policy-helper-text">Format: TN01AB1234</span>
//               )}
//             </div>

//             {/* Manufacturer */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Manufacturer *</label>
//               <input
//                 className={`apply-policy-input ${validationErrors.manufacturer ? 'error' : ''}`}
//                 value={form.manufacturer}
//                 onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
//                 placeholder="e.g., Honda, Toyota, Bajaj"
//               />
//               {validationErrors.manufacturer && (
//                 <span className="apply-policy-error-text">{validationErrors.manufacturer}</span>
//               )}
//             </div>

//             {/* Model */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Vehicle Model *</label>
//               <input
//                 className={`apply-policy-input ${validationErrors.model ? 'error' : ''}`}
//                 value={form.model}
//                 onChange={(e) => setForm({ ...form, model: e.target.value })}
//                 placeholder="e.g., Activa 6G, Swift, Pulsar"
//               />
//               {validationErrors.model && (
//                 <span className="apply-policy-error-text">{validationErrors.model}</span>
//               )}
//             </div>

//             {/* Manufacture Year */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Manufacture Year *</label>
//               <input
//                 className={`apply-policy-input ${validationErrors.manufactureYear ? 'error' : ''}`}
//                 type="number"
//                 value={form.manufactureYear}
//                 onChange={(e) => setForm({ ...form, manufactureYear: parseInt(e.target.value) })}
//                 min="1990"
//                 max={new Date().getFullYear()}
//               />
//               {validationErrors.manufactureYear && (
//                 <span className="apply-policy-error-text">{validationErrors.manufactureYear}</span>
//               )}
//             </div>

//             {/* Driving Experience */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Driving Experience *</label>
//               <select
//                 className={`apply-policy-select ${validationErrors.drivingExperience ? 'error' : ''}`}
//                 value={form.drivingExperience}
//                 onChange={(e) => setForm({ ...form, drivingExperience: e.target.value })}
//               >
//                 <option value="">Select experience</option>
//                 <option value="Less than 1 year">Less than 1 year</option>
//                 <option value="1-3 years">1-3 years</option>
//                 <option value="3-5 years">3-5 years</option>
//                 <option value="5-10 years">5-10 years</option>
//                 <option value="More than 10 years">More than 10 years</option>
//               </select>
//               {validationErrors.drivingExperience && (
//                 <span className="apply-policy-error-text">{validationErrors.drivingExperience}</span>
//               )}
//             </div>
//           </div>

//           <div className="apply-policy-divider"></div>
//           <h3 className="apply-policy-section-title">Insurance Details</h3>

//           <div className="apply-policy-grid">
//             {/* Insurance Type */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Insurance Type *</label>
//               <select
//                 className="apply-policy-select"
//                 value={form.insuranceType}
//                 onChange={(e) => setForm({ ...form, insuranceType: e.target.value })}
//               >
//                 <option value="Comprehensive">Comprehensive</option>
//                 <option value="Third-Party">Third-Party</option>
//                 <option value="Zero Depreciation">Zero Depreciation</option>
//               </select>
//             </div>

//             {/* Duration */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Policy Duration *</label>
//               <select
//                 className="apply-policy-select"
//                 value={form.durationMonths}
//                 onChange={(e) => setForm({ ...form, durationMonths: e.target.value })}
//               >
//                 <option value={12}>12 months</option>
//                 <option value={24}>24 months</option>
//                 <option value={36}>36 months</option>
//               </select>
//             </div>

//             {/* Coverage Amount */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Coverage Amount (₹) *</label>
//               <input
//                 className={`apply-policy-input ${validationErrors.coverageAmount ? 'error' : ''}`}
//                 type="number"
//                 value={form.coverageAmount}
//                 onChange={(e) => setForm({ ...form, coverageAmount: parseInt(e.target.value) })}
//                 min="100000"
//                 step="10000"
//               />
//               {validationErrors.coverageAmount ? (
//                 <span className="apply-policy-error-text">{validationErrors.coverageAmount}</span>
//               ) : (
//                 <span className="apply-policy-helper-text">Minimum ₹1,00,000</span>
//               )}
//             </div>

//             {/* Previous Claims */}
//             <div className="apply-policy-field">
//               <label className="apply-policy-label">Previous Claims *</label>
//               <select
//                 className="apply-policy-select"
//                 value={form.previousClaims}
//                 onChange={(e) => setForm({ ...form, previousClaims: e.target.value })}
//               >
//                 <option value="No">No previous claims</option>
//                 <option value="Yes">Has previous claims</option>
//               </select>
//             </div>
//           </div>

//           <button type="submit" className="apply-policy-button" disabled={loading}>
//             {loading ? (<><div className="apply-policy-loading"></div>Processing...</>) : "Proceed to Payment"}
//           </button>
//         </form>
//       </div>

//       {paymentDialog && (
//         <div className="apply-policy-snackbar" style={{position:"fixed", inset:0, background:"rgba(0,0,0,.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000}}>
//           <div className="card" style={{width:"min(520px,92vw)"}}>
//             <div className="card-body">
//               <div className="between mb-2"><div className="h4">Payment</div><button className="btn btn-outline" onClick={()=>setPaymentDialog(false)}>Close</button></div>
//               <div className="field"><label className="label">Processing Fee (₹)</label><input className="input" value={processingFee} disabled /></div>
//               <div className="row">
//                 <div className="field" style={{flex:1}}>
//                   <label className="label">Card Number</label>
//                   <input className="input" value={card.number} onChange={(e)=>setCard({...card, number:e.target.value})} placeholder="1234 5678 9012 3456" />
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="field" style={{flex:1}}>
//                   <label className="label">Expiry</label>
//                   <input className="input" value={card.expiry} onChange={(e)=>setCard({...card, expiry:e.target.value})} placeholder="MM/YY" />
//                 </div>
//                 <div className="field" style={{flex:1}}>
//                   <label className="label">CVV</label>
//                   <input className="input" value={card.cvv} onChange={(e)=>setCard({...card, cvv:e.target.value})} placeholder="123" />
//                 </div>
//               </div>
//               <div className="between mt-3">
//                 <button className="btn btn-outline" onClick={()=>setPaymentDialog(false)}>Cancel</button>
//                 <button className="btn btn-primary" disabled={loading} onClick={confirmSubmit}>{loading?"Submitting...":"Pay & Submit"}</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {snack.open && (
//         <div className="apply-policy-snackbar">
//           <div className={`apply-policy-snackbar-content ${snack.severity}`}>
//             <span>{snack.message}</span>
//             <button
//               className="apply-policy-snackbar-close"
//               onClick={() => setSnack({ ...snack, open: false })}
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ApplyPolicy;
