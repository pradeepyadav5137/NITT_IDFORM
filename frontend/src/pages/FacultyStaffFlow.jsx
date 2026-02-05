// 'use client';

// import { useState, useEffect, useRef } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { jsPDF } from 'jspdf'
// import StepIndicator from '../components/StepIndicator'
// import { authAPI, applicationAPI } from '../services/api'
// import { generateFacultyStaffPDF } from '../services/pdfGenerator'
// import './FacultyFlow.css'

// const FACULTY_STAFF_STEPS = ['Email Verification', 'Application Form', 'Preview & Submit']

// const formatDate = (dateString) => {
//   if (!dateString) return ''
//   try {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-GB')
//   } catch {
//     return dateString
//   }
// }

// const INITIAL_FORM_STATE = {
//   requestCategory: '',
//   dataToChange: [],
//   otherDataChange: '',
//   title: '',
//   staffName: '',
//   staffNo: '',
//   designation: '',
//   department: '',
//   dob: '',
//   joiningDate: '',
//   retirementDate: '',
//   gender: '',
//   bloodGroup: '',
//   phone: '',
//   address: '',
//   correctionDetails: '',
//   officeOrderAttached: false
// };

// export default function FacultyStaffFlow() {
//   const { userType } = useParams() 
//   const navigate = useNavigate()

//   // Determine Role
//   const isGenericUrl = !userType || userType === 'faculty-staff';
//   const [role, setRole] = useState((!isGenericUrl && userType) ? userType : 'staff');

//   const [step, setStep] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
  
//   const [email, setEmail] = useState('')
//   const [otp, setOtp] = useState('')
//   const [verificationSubstep, setVerificationSubstep] = useState('email')
//   const [verifiedEmail, setVerifiedEmail] = useState('')
  
//   const [photo, setPhoto] = useState(null)
//   const [photoPreview, setPhotoPreview] = useState('')
//   const fileInputRef = useRef(null)
  
//   // Clean start on load
//   useEffect(() => {
//     localStorage.clear();
//     sessionStorage.clear();
//     setFormData(INITIAL_FORM_STATE);
//   }, []);

//   const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
//   const departmentOptions = [
//     'Civil Engineering', 'Computer Science & Engineering', 'Electrical & Electronics Engineering',
//     'Electronics & Communication Engineering', 'Instrumentation & Control Engineering', 'Mechanical Engineering',
//     'Metallurgical and Materials Engineering', 'Production Engineering', 'Chemical Engineering', 'Architecture',
//     'Integrated Teacher Education Programme (ITEP)', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science',
//     'Computer Applications', 'English', 'Management Studies', 'Other'
//   ]
  
//   const dataChangeOptions = [
//     'Name', 'Address', 'Designation', 'Email ID', 'Date Of Birth', 'Contact No', 'Transfer / Promotion / Redesignation', 'Other'
//   ]
  
//   const handleSendOtp = async (e) => {
//     e.preventDefault()
//     setError('')
//     const emailTrimmed = String(email).trim().toLowerCase()
    
//     if (!emailTrimmed.endsWith('@nitt.edu')) {
//       setError('Only @nitt.edu institute email is allowed')
//       return
//     }
    
//     setLoading(true)
//     localStorage.removeItem('token');
    
//     try {
//       await authAPI.sendOTP({ 
//         email: emailTrimmed, 
//         userType: role || 'staff'
//       })
//       setVerificationSubstep('otp')
//     } catch (err) {
//       setError(err.message || 'Failed to send OTP')
//     }
//     setLoading(false)
//   }
  
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
    
//     try {
//       const finalEmail = String(email).trim().toLowerCase();
//       const finalOtp = String(otp).trim();
//       const finalRole = role || 'staff'; 

//       // Send arguments separately to ensure API receives them correctly
//       const res = await authAPI.verifyEmail(finalEmail, finalOtp, finalRole);
      
//       // Save session data
//       localStorage.setItem('token', res.token)
//       localStorage.setItem('email', res.email)
//       localStorage.setItem('userType', finalRole)
      
//       setVerifiedEmail(res.email)
//       setStep(1) 
//     } catch (err) {
//       const backendMsg = err.response?.data?.message || err.message || 'Invalid OTP';
//       setError(backendMsg);
//     }
//     setLoading(false)
//   }
  
//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     if (!file.type.startsWith('image/')) { setError('Please upload an image file (JPG, JPEG, PNG)'); return }
//     if (file.size > 1024 * 1024) { setError('File size must be less than 1MB'); return }
//     setPhoto(file)
//     const reader = new FileReader()
//     reader.onloadend = () => { setPhotoPreview(reader.result) }
//     reader.readAsDataURL(file)
//   }
  
//   const handleInputChange = (e) => {
//     const { name, value, type: inputType, checked } = e.target
//     let updatedData;
//     if (inputType === 'checkbox') {
//       if (name === 'dataToChange') {
//         const updatedCheckboxData = formData.dataToChange.includes(value)
//           ? formData.dataToChange.filter(item => item !== value)
//           : [...formData.dataToChange, value]
//         updatedData = { ...formData, dataToChange: updatedCheckboxData };
//       } else {
//         updatedData = { ...formData, [name]: checked };
//       }
//     } else {
//       updatedData = { ...formData, [name]: value };
//     }
//     setFormData(updatedData);
//   }
  
//   const handleFormSubmit = (e) => {
//     e.preventDefault()
//     if (!formData.requestCategory) { setError('Please select a request category'); return }
//     if (!formData.title || !formData.staffName || !formData.staffNo || !formData.designation || !formData.department) {
//       setError('Please fill all required fields'); return
//     }
//     if (!photo) { setError('Please upload a passport-size photo'); return }
//     setStep(2)
//   }
  
//   const handleFinalSubmit = async () => {
//     setError('')
//     setLoading(true)
    
//     try {
//       const formDataToSend = new FormData()
//       const finalRole = role || 'staff';
//       formDataToSend.append('userType', finalRole) 
//       formDataToSend.append('email', verifiedEmail)
      
//       Object.keys(formData).forEach(key => {
//         if (formData[key] !== undefined && formData[key] !== null) {
//           if (Array.isArray(formData[key])) {
//             formDataToSend.append(key, JSON.stringify(formData[key]))
//           } else {
//             formDataToSend.append(key, formData[key])
//           }
//         }
//       })
      
//       if (photo) formDataToSend.append('photo', photo)
//       formDataToSend.append('submittedAt', new Date().toISOString())
      
//       // Generate temp ID for PDF
//       const year = new Date().getFullYear()
//       const randomNum = Math.floor(10000 + Math.random() * 90000)
//       const prefix = finalRole === 'faculty' ? 'FAC' : 'STF';
//       const tempApplicationId = `NITT-${prefix}-${year}-${randomNum}`
      
//       const pdfDoc = await generateFacultyStaffPDF({
//         ...formData,
//         email: verifiedEmail,
//         userType: finalRole
//       }, false);
//       const pdfBlob = pdfDoc.output('blob');
//       formDataToSend.append('applicationPdf', pdfBlob, `application_${formData.staffNo || tempApplicationId}.pdf`);

//       const result = await applicationAPI.submit(formDataToSend)
//       const realApplicationId = result.applicationId || result.id || tempApplicationId
      
//       // Clear session and redirect
//       localStorage.clear();
//       sessionStorage.clear();
      
//       navigate(`/success/${realApplicationId}`, { state: { application: result.application } })
//     } catch (err) {
//       const backendMsg = err.response?.data?.message || err.message;
//       setError(backendMsg);
//     } finally {
//       setLoading(false)
//     }
//   }
  
//   // STEP 0: EMAIL VERIFICATION
//   if (step === 0) {
//     return (
//       <div className="faculty-form-container">
//         <StepIndicator current={0} total={FACULTY_STAFF_STEPS.length} labels={FACULTY_STAFF_STEPS} />
        
//         <div className="faculty-form-card">
//           <h2>Email Verification</h2>
//           <p className="form-description">Enter your institute email (@nitt.edu) to receive verification OTP</p>

//           <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
//             <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>Applying as:</label>
//             <div style={{ display: 'flex', gap: '20px' }}>
//               <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//                 <input 
//                   type="radio" name="role" value="staff" 
//                   checked={role === 'staff'} onChange={() => setRole('staff')}
//                   disabled={loading || verificationSubstep === 'otp'}
//                   style={{ marginRight: '8px' }}
//                 /> Staff
//               </label>
//               <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//                 <input 
//                   type="radio" name="role" value="faculty" 
//                   checked={role === 'faculty'} onChange={() => setRole('faculty')}
//                   disabled={loading || verificationSubstep === 'otp'}
//                   style={{ marginRight: '8px' }}
//                 /> Faculty
//               </label>
//             </div>
//           </div>
          
//           <div className="info-box">
//             <h4>Email Verification Instructions:</h4>
//             <ul>
//               <li>Use your institute email address (@nitt.edu)</li>
//               <li>A 6-digit OTP will be sent to your email</li>
//               <li>OTP is valid for 5 minutes</li>
//               <li style={{color: '#e53e3e', fontWeight: 'bold'}}>Do NOT use Student Roll No email</li>
//             </ul>
//           </div>
          
//           {error && <div className="error-message">{error}</div>}
          
//           {verificationSubstep === 'email' ? (
//             <form onSubmit={handleSendOtp}>
//               <div className="form-group">
//                 <label>Institute Email *</label>
//                 <input
//                   type="email" value={email} onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@nitt.edu" required disabled={loading}
//                 />
//                 <small>Only @nitt.edu emails are allowed</small>
//               </div>
//               <div className="button-group">
//                 <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP'}</button>
//                 <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
//               </div>
//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOtp}>
//               <div className="form-group">
//                 <label>OTP sent to {email}</label>
//                 <input
//                   type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter 6-digit OTP" maxLength={6} required disabled={loading}
//                 />
//               </div>
//               <div className="button-group">
//                 <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
//                 <button type="button" className="btn btn-secondary" onClick={() => { setVerificationSubstep('email'); setOtp(''); setError(''); }}>Change Email</button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     )
//   }
  
//   // STEP 1: FORM
//   if (step === 1) {
//     return (
//       <div className="faculty-form-container">
//         <StepIndicator current={1} total={FACULTY_STAFF_STEPS.length} labels={FACULTY_STAFF_STEPS} />
//         <div className="faculty-form-card">
//           <h2>ID Card Form for {role === 'faculty' ? 'Faculty' : 'Staff'}</h2>
//           <p className="form-description">The printed form must be submitted to the library for verification after being duly signed by the Registrar</p>
//           {error && <div className="error-message">{error}</div>}
          
//           <form onSubmit={handleFormSubmit}>
//             <h3>Request Details</h3>
//             <div className="form-group">
//               <label>Request Category *</label>
//               <select name="requestCategory" value={formData.requestCategory} onChange={handleInputChange} required>
//                 <option value="">Select Category</option>
//                 <option value="New">New ID Card</option>
//                 <option value="Correction">Correction</option>
//                 <option value="Update">Update</option>
//                 <option value="Replacement">Replacement</option>
//               </select>
//             </div>
            
//             {(formData.requestCategory === 'Correction' || formData.requestCategory === 'Update') && (
//               <div className="form-group">
//                 <label>Data to be Changed *</label>
//                 <div className="checkbox-group">
//                   {dataChangeOptions.map(option => (
//                     <label key={option} className="checkbox-label">
//                       <input type="checkbox" name="dataToChange" value={option} checked={formData.dataToChange.includes(option)} onChange={handleInputChange} />
//                       <span>{option}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             <h3>Personal Information</h3>
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Title *</label>
//                 <select name="title" value={formData.title} onChange={handleInputChange} required>
//                   <option value="">Select Title</option>
//                   <option value="Prof">Prof.</option>
//                   <option value="Dr">Dr.</option>
//                   <option value="Mr">Mr.</option>
//                   <option value="Ms">Ms.</option>
//                   <option value="Mrs">Mrs.</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Name *</label>
//                 <input type="text" name="staffName" value={formData.staffName} onChange={handleInputChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Staff No. *</label>
//                 <input type="text" name="staffNo" value={formData.staffNo} onChange={handleInputChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Designation *</label>
//                 <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Department / Section *</label>
//                 <select name="department" value={formData.department} onChange={handleInputChange} required>
//                   <option value="">Select Department</option>
//                   {departmentOptions.map(dept => <option key={dept} value={dept}>{dept}</option>)}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Date of Birth *</label>
//                 <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Date of Joining *</label>
//                 <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Date of Retirement</label>
//                 <input type="date" name="retirementDate" value={formData.retirementDate} onChange={handleInputChange} />
//               </div>
//               <div className="form-group">
//                 <label>Gender *</label>
//                 <select name="gender" value={formData.gender} onChange={handleInputChange} required>
//                   <option value="">Select</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Blood Group *</label>
//                 <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} required>
//                   <option value="">Select</option>
//                   <option value="A+">A+</option>
//                   <option value="A-">A-</option>
//                   <option value="B+">B+</option>
//                   <option value="B-">B-</option>
//                   <option value="AB+">AB+</option>
//                   <option value="AB-">AB-</option>
//                   <option value="O+">O+</option>
//                   <option value="O-">O-</option>
//                 </select>
//               </div>
//             </div>
            
//             <h3>Contact Information</h3>
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Email ID *</label>
//                 <input type="email" value={verifiedEmail} readOnly disabled className="disabled-input" />
//               </div>
//               <div className="form-group">
//                 <label>Mobile Number *</label>
//                 <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} maxLength="10" required />
//               </div>
//             </div>
//             <div className="form-group">
//               <label>Address *</label>
//               <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" required />
//             </div>
            
//             <h3>Photo Upload</h3>
//             <div className="form-group">
//               <label>Passport Size Photo * (Max 1MB)</label>
//               <div className="photo-upload-area">
//                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} />
//                 {photoPreview ? (
//                   <div className="photo-preview">
//                     <img src={photoPreview} alt="Preview" />
//                     <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(''); if (fileInputRef.current) fileInputRef.current.value = '' }} className="btn-remove">Remove</button>
//                   </div>
//                 ) : (
//                   <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
//                     <p>Click to upload photo</p>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="button-group">
//               <button type="button" onClick={() => { setStep(0); setError('') }} className="btn btn-secondary">← Back</button>
//               <button type="submit" className="btn btn-primary">Preview Application →</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )
//   }
  
//   // STEP 2: PREVIEW & SUBMIT
//   if (step === 2) {
//     return (
//       <div className="faculty-form-container">
//         <StepIndicator current={2} total={FACULTY_STAFF_STEPS.length} labels={FACULTY_STAFF_STEPS} />
//         <div className="faculty-form-card">
//           <h2>Preview Your Application</h2>
//           {error && <div className="error-message">{error}</div>}
//           <div className="preview-section">
//             <h3>Summary for {formData.staffName} ({role})</h3>
            
//             {/* FULL PREVIEW GRID */}
//             <div className="preview-grid">
//                <div className="preview-item"><strong>Request Category:</strong> {formData.requestCategory}</div>
//                {formData.dataToChange.length > 0 && (
//                  <div className="preview-item"><strong>Data to Change:</strong> {formData.dataToChange.join(', ')}</div>
//                )}
//                <div className="preview-item"><strong>Title:</strong> {formData.title}</div>
//                <div className="preview-item"><strong>Name:</strong> {formData.staffName}</div>
//                <div className="preview-item"><strong>Staff No:</strong> {formData.staffNo}</div>
//                <div className="preview-item"><strong>Designation:</strong> {formData.designation}</div>
//                <div className="preview-item"><strong>Department:</strong> {formData.department}</div>
//                <div className="preview-item"><strong>Date of Birth:</strong> {formatDate(formData.dob)}</div>
//                <div className="preview-item"><strong>Joining Date:</strong> {formatDate(formData.joiningDate)}</div>
//                {formData.retirementDate && <div className="preview-item"><strong>Retirement Date:</strong> {formatDate(formData.retirementDate)}</div>}
//                <div className="preview-item"><strong>Gender:</strong> {formData.gender}</div>
//                <div className="preview-item"><strong>Blood Group:</strong> {formData.bloodGroup}</div>
//                <div className="preview-item"><strong>Email:</strong> {verifiedEmail}</div>
//                <div className="preview-item"><strong>Mobile:</strong> {formData.phone}</div>
//                <div className="preview-item full-width"><strong>Address:</strong> {formData.address}</div>
//                <div className="preview-item"><strong>Photo:</strong> {photo ? photo.name : 'Not Uploaded'}</div>
//             </div>
//           </div>
          
//           <div className="button-group">
//             <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">← Edit</button>
//             <button type="button" onClick={handleFinalSubmit} disabled={loading} className="btn btn-primary">{loading ? 'Submitting...' : 'Submit Application'}</button>
//           </div>
//         </div>
//       </div>
//     )
//   }
//   return null;
// }

'use client';

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator'
import { authAPI, applicationAPI } from '../services/api'
import { generateFacultyStaffPDF } from '../services/pdfGenerator'
import './FacultyFlow.css'

const FACULTY_STAFF_STEPS = ['Email Verification', 'Application Form', 'Preview & Submit']

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  } catch {
    return dateString
  }
}

const INITIAL_FORM_STATE = {
  requestCategory: '',
  dataToChange: [],
  otherDataChange: '',
  title: '',
  staffName: '',
  staffNo: '',
  designation: '',
  department: '',
  dob: '',
  joiningDate: '',
  retirementDate: '',
  gender: '',
  bloodGroup: '',
  phone: '',
  address: '',
  correctionDetails: '',
  officeOrderAttached: false
};

export default function FacultyStaffFlow() {
  const { userType } = useParams() 
  const navigate = useNavigate()

  // Determine Role
  const isGenericUrl = !userType || userType === 'faculty-staff';
  const [role, setRole] = useState((!isGenericUrl && userType) ? userType : 'staff');

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationSubstep, setVerificationSubstep] = useState('email')
  const [verifiedEmail, setVerifiedEmail] = useState('')
  
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const fileInputRef = useRef(null)

  // --- TOAST STATE ---
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    // Scroll to top to ensure toast is seen
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };
  
  // Clean start on load
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    authAPI.logout();
    setFormData(INITIAL_FORM_STATE);
  }, []);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  const departmentOptions = [
    'Civil Engineering', 'Computer Science & Engineering', 'Electrical & Electronics Engineering',
    'Electronics & Communication Engineering', 'Instrumentation & Control Engineering', 'Mechanical Engineering',
    'Metallurgical and Materials Engineering', 'Production Engineering', 'Chemical Engineering', 'Architecture',
    'Integrated Teacher Education Programme (ITEP)', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science',
    'Computer Applications', 'English', 'Management Studies', 'Other'
  ]
  
  const dataChangeOptions = [
    'Name', 'Address', 'Designation', 'Email ID', 'Date Of Birth', 'Contact No', 'Transfer / Promotion / Redesignation', 'Other'
  ]
  
  const handleSendOtp = async (e) => {
    e.preventDefault()
    const emailTrimmed = String(email).trim().toLowerCase()
    
    if (!emailTrimmed.endsWith('@nitt.edu')) {
      showToast('Only @nitt.edu institute email is allowed', 'error')
      return
    }
    
    setLoading(true)
    localStorage.removeItem('token');
    
    try {
      await authAPI.sendOTP({ 
        email: emailTrimmed, 
        userType: role || 'staff'
      })
      showToast(`OTP sent to ${emailTrimmed}`, 'success')
      setVerificationSubstep('otp')
    } catch (err) {
      showToast(err.message || 'Failed to send OTP', 'error')
    }
    setLoading(false)
  }
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const finalEmail = String(email).trim().toLowerCase();
      const finalOtp = String(otp).trim();
      const finalRole = role || 'staff'; 

      const res = await authAPI.verifyEmail(finalEmail, finalOtp, finalRole);
      
      // Save session data
      // localStorage.setItem('token', res.token)
      localStorage.setItem('email', res.email)
      localStorage.setItem('userType', finalRole)
      
      setVerifiedEmail(res.email)
      showToast('Verification Successful!', 'success')
      
      setTimeout(() => {
        setStep(1)
      }, 500)
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message || 'Invalid OTP';
      showToast(backendMsg, 'error')
    }
    setLoading(false)
  }
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { showToast('Please upload an image file (JPG, JPEG, PNG)', 'error'); return }
    if (file.size > 1024 * 1024) { showToast('File size must be less than 1MB', 'error'); return }
    setPhoto(file)
    const reader = new FileReader()
    reader.onloadend = () => { setPhotoPreview(reader.result) }
    reader.readAsDataURL(file)
  }
  
  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target
    let updatedData;
    if (inputType === 'checkbox') {
      if (name === 'dataToChange') {
        const updatedCheckboxData = formData.dataToChange.includes(value)
          ? formData.dataToChange.filter(item => item !== value)
          : [...formData.dataToChange, value]
        updatedData = { ...formData, dataToChange: updatedCheckboxData };
      } else {
        updatedData = { ...formData, [name]: checked };
      }
    } else {
      updatedData = { ...formData, [name]: value };
    }
    setFormData(updatedData);
  }
  
  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    // 1. Check Request Category
    if (!formData.requestCategory) { 
      showToast('Please select a request category', 'error'); 
      return 
    }
    
    // 2. Check Required Fields
    const requiredFields = ['title', 'staffName', 'staffNo', 'designation', 'department', 'dob', 'joiningDate', 'gender', 'bloodGroup', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      showToast('Please fill all required fields', 'error'); 
      return
    }
    
    // 3. Check Photo
    if (!photo) { 
      showToast('Please upload a passport-size photo', 'error'); 
      return 
    }
    
    setStep(2)
  }
  
  const handleFinalSubmit = async () => {
    setLoading(true)
    
    try {
      const formDataToSend = new FormData()
      const finalRole = role || 'staff';
      formDataToSend.append('userType', finalRole) 
      formDataToSend.append('email', verifiedEmail)
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          if (Array.isArray(formData[key])) {
            formDataToSend.append(key, JSON.stringify(formData[key]))
          } else {
            formDataToSend.append(key, formData[key])
          }
        }
      })
      
      if (photo) formDataToSend.append('photo', photo)
      formDataToSend.append('submittedAt', new Date().toISOString())
      
      // Generate temp ID for PDF
      const year = new Date().getFullYear()
      const randomNum = Math.floor(10000 + Math.random() * 90000)
      const prefix = finalRole === 'faculty' ? 'FAC' : 'STF';
      const tempApplicationId = `NITT-${prefix}-${year}-${randomNum}`
      
      const pdfDoc = await generateFacultyStaffPDF({
        ...formData,
        email: verifiedEmail,
        userType: finalRole
      }, false);
      const pdfBlob = pdfDoc.output('blob');
      formDataToSend.append('applicationPdf', pdfBlob, `application_${formData.staffNo || tempApplicationId}.pdf`);

      const result = await applicationAPI.submit(formDataToSend)
      const realApplicationId = result.applicationId || result.id || tempApplicationId
      
      showToast('Application submitted successfully!', 'success')
      
      localStorage.clear();
      sessionStorage.clear();
      
      setTimeout(() => {
         navigate(`/success/${realApplicationId}`, { state: { application: result.application } })
      }, 1000)
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message;
      showToast(`Submission Error: ${backendMsg}`, 'error');
    } finally {
      setLoading(false)
    }
  }
  
  // STEP 0: EMAIL VERIFICATION
  if (step === 0) {
    return (
      <div className="faculty-form-container">
        {/* TOAST COMPONENT */}
        {toast && (
          <div className={`toast-notification ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
            {toast.message}
          </div>
        )}

        <StepIndicator current={0} total={FACULTY_STAFF_STEPS.length} labels={FACULTY_STAFF_STEPS} />
        
        <div className="faculty-form-card">
          <h2>Email Verification</h2>
          <p className="form-description">Enter your institute email (@nitt.edu) to receive verification OTP</p>

          <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>Applying as:</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="radio" name="role" value="staff" 
                  checked={role === 'staff'} onChange={() => setRole('staff')}
                  disabled={loading || verificationSubstep === 'otp'}
                  style={{ marginRight: '8px' }}
                /> Staff
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="radio" name="role" value="faculty" 
                  checked={role === 'faculty'} onChange={() => setRole('faculty')}
                  disabled={loading || verificationSubstep === 'otp'}
                  style={{ marginRight: '8px' }}
                /> Faculty
              </label>
            </div>
          </div>
          
          <div className="info-box">
            <h4>Email Verification Instructions:</h4>
            <ul>
              <li>Use your institute email address (@nitt.edu)</li>
              <li>A 6-digit OTP will be sent to your email</li>
              <li>OTP is valid for 5 minutes</li>
              <li style={{color: '#e53e3e', fontWeight: 'bold'}}>Do NOT use Student Roll No email</li>
            </ul>
          </div>
          
          {verificationSubstep === 'email' ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Institute Email *</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nitt.edu" required disabled={loading}
                />
                <small>Only @nitt.edu emails are allowed</small>
              </div>
              <div className="button-group">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>OTP sent to {email}</label>
                <input
                  type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP" maxLength={6} required disabled={loading}
                />
              </div>
              <div className="button-group">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setVerificationSubstep('email'); setOtp(''); }}>Change Email</button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }
  
  // STEP 1: FORM
  if (step === 1) {
    return (
      <div className="faculty-form-container">
        {/* TOAST COMPONENT */}
        {toast && (
          <div className={`toast-notification ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
            {toast.message}
          </div>
        )}

        <StepIndicator current={1} total={FACULTY_STAFF_STEPS.length} labels={FACULTY_STAFF_STEPS} />
        <div className="faculty-form-card">
          <h2>ID Card Form for {role === 'faculty' ? 'Faculty' : 'Staff'}</h2>
          <p className="form-description">The printed form must be submitted to the library for verification after being duly signed by the Registrar</p>
          
          <form onSubmit={handleFormSubmit}>
            <h3>Request Details</h3>
            <div className="form-group">
              <label>Request Category *</label>
              <select name="requestCategory" value={formData.requestCategory} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                <option value="New">New ID Card</option>
                <option value="Correction">Correction</option>
                <option value="Update">Update</option>
                <option value="Replacement">Replacement</option>
              </select>
            </div>
            
            {(formData.requestCategory === 'Correction' || formData.requestCategory === 'Update') && (
              <div className="form-group">
                <label>Data to be Changed *</label>
                <div className="checkbox-group">
                  {dataChangeOptions.map(option => (
                    <label key={option} className="checkbox-label">
                      <input type="checkbox" name="dataToChange" value={option} checked={formData.dataToChange.includes(option)} onChange={handleInputChange} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Title *</label>
                <select name="title" value={formData.title} onChange={handleInputChange} required>
                  <option value="">Select Title</option>
                  <option value="Prof">Prof.</option>
                  <option value="Dr">Dr.</option>
                  <option value="Mr">Mr.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Mrs">Mrs.</option>
                </select>
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="staffName" value={formData.staffName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Staff No. *</label>
                <input type="text" name="staffNo" value={formData.staffNo} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Designation *</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Department / Section *</label>
                <select name="department" value={formData.department} onChange={handleInputChange} required>
                  <option value="">Select Department</option>
                  {departmentOptions.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Date of Joining *</label>
                <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Date of Retirement</label>
                <input type="date" name="retirementDate" value={formData.retirementDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group *</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} required>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
            
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Email ID *</label>
                <input type="email" value={verifiedEmail} readOnly disabled className="disabled-input" />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} maxLength="10" required />
              </div>
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" required />
            </div>
            
            <h3>Photo Upload</h3>
            <div className="form-group">
              <label>Passport Size Photo * (Max 1MB)</label>
              <div className="photo-upload-area">
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} />
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" />
                    <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(''); if (fileInputRef.current) fileInputRef.current.value = '' }} className="btn-remove">Remove</button>
                  </div>
                ) : (
                  <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                    <p>Click to upload photo</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="button-group">
              <button type="button" onClick={() => { setStep(0) }} className="btn btn-secondary">← Back</button>
              <button type="submit" className="btn btn-primary">Preview Application →</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
  
  // STEP 2: PREVIEW & SUBMIT
  if (step === 2) {
    return (
      <div className="faculty-form-container">
        {/* TOAST COMPONENT */}
        {toast && (
          <div className={`toast-notification ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
            {toast.message}
          </div>
        )}

        <StepIndicator current={2} total={FACULTY_STAFF_STEPS.length} labels={FACULTY_STAFF_STEPS} />
        <div className="faculty-form-card">
          <h2>Preview Your Application</h2>
          <div className="preview-section">
            <h3>Summary for {formData.staffName} ({role})</h3>
            
            {/* FULL PREVIEW GRID */}
            <div className="preview-grid">
               <div className="preview-item"><strong>Request Category:</strong> {formData.requestCategory}</div>
               {formData.dataToChange.length > 0 && (
                 <div className="preview-item"><strong>Data to Change:</strong> {formData.dataToChange.join(', ')}</div>
               )}
               <div className="preview-item"><strong>Title:</strong> {formData.title}</div>
               <div className="preview-item"><strong>Name:</strong> {formData.staffName}</div>
               <div className="preview-item"><strong>Staff No:</strong> {formData.staffNo}</div>
               <div className="preview-item"><strong>Designation:</strong> {formData.designation}</div>
               <div className="preview-item"><strong>Department:</strong> {formData.department}</div>
               <div className="preview-item"><strong>Date of Birth:</strong> {formatDate(formData.dob)}</div>
               <div className="preview-item"><strong>Joining Date:</strong> {formatDate(formData.joiningDate)}</div>
               {formData.retirementDate && <div className="preview-item"><strong>Retirement Date:</strong> {formatDate(formData.retirementDate)}</div>}
               <div className="preview-item"><strong>Gender:</strong> {formData.gender}</div>
               <div className="preview-item"><strong>Blood Group:</strong> {formData.bloodGroup}</div>
               <div className="preview-item"><strong>Email:</strong> {verifiedEmail}</div>
               <div className="preview-item"><strong>Mobile:</strong> {formData.phone}</div>
               <div className="preview-item full-width"><strong>Address:</strong> {formData.address}</div>
               <div className="preview-item"><strong>Photo:</strong> {photo ? photo.name : 'Not Uploaded'}</div>
            </div>
          </div>
          
          <div className="button-group">
            <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">← Edit</button>
            <button type="button" onClick={handleFinalSubmit} disabled={loading} className="btn btn-primary">{loading ? 'Submitting...' : 'Submit Application'}</button>
          </div>
        </div>
      </div>
    )
  }
  return null;
}