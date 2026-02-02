
// 'use client';

// import { useState, useEffect, useRef } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { jsPDF } from 'jspdf'
// import StepIndicator from '../components/StepIndicator'
// import { authAPI, applicationAPI } from '../services/api'
// import { generateFacultyStaffPDF } from '../services/pdfGenerator'
// import './FacultyFlow.css'
// // import  './StudentFlow.css';

// // Single flow steps for faculty/staff
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

// const generateFacultyStaffPdf = (data, userType) => {
//   const doc = new jsPDF('p', 'mm', 'a4')
  
//   // Header
//   doc.setFontSize(16)
//   doc.setFont('helvetica', 'bold')
//   doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', 105, 20, { align: 'center' })
//   doc.setFontSize(11)
//   doc.text('TAMIL NADU, INDIA-620015', 105, 27, { align: 'center' })
//   doc.setFontSize(14)
//   doc.text(`ID CARD FORM FOR ${userType.toUpperCase()}`, 105, 37, { align: 'center' })
  
//   // Instructions
//   doc.setFontSize(10)
//   doc.setFont('helvetica', 'italic')
//   doc.text('Instructions:', 20, 50)
//   doc.setFont('helvetica', 'normal')
//   doc.text('The printed form must be submitted to the library for verification', 20, 57)
//   doc.text('after being duly signed by the Registrar', 20, 64)
  
//   let y = 80
//   doc.setFontSize(11)
  
//   const addField = (label, value) => {
//     doc.setFont('helvetica', 'bold')
//     doc.text(`${label}:`, 20, y)
//     doc.setFont('helvetica', 'normal')
//     doc.text(value || '', 70, y)
//     y += 7
//   }
  
//   addField('Request Category', data.requestCategory)
//   if (data.dataToChange && data.dataToChange.length > 0) {
//     addField('Data to be Changed', data.dataToChange.join(', '))
//   }
//   addField('Title', data.title)
//   addField('Name', data.staffName)
//   addField('Staff No', data.staffNo)
//   addField('Designation', data.designation)
//   addField('Department / Section', data.department)
//   addField('Date of Birth', formatDate(data.dob))
//   addField('Date of Joining', formatDate(data.joiningDate))
//   if (data.retirementDate) {
//     addField('Date of Retirement', formatDate(data.retirementDate))
//   }
//   addField('Gender', data.gender)
//   addField('Blood Group', data.bloodGroup || 'Not specified')
//   addField('Email ID', data.email)
//   addField('Mobile Number', data.phone)
//   addField('Address', data.address)
//   addField('Photo Attached', data.photo ? 'Yes' : 'No')
  
//   // Signature note
//   y += 15
//   doc.setFont('helvetica', 'italic')
//   doc.setFontSize(9)
//   doc.text('Note: This form must be printed and submitted with a passport-size photo', 20, y)
//   doc.text('to the library after obtaining necessary signatures.', 20, y + 5)
  
//   const fileName = `${data.staffNo}_${userType}_form.pdf`
//   doc.save(fileName)
// }

// export default function FacultyStaffFlow() {
//   const { userType } = useParams() // 'faculty' or 'staff'
//   const navigate = useNavigate()
//   const type = userType || 'staff'
  
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
  
//   const [formData, setFormData] = useState(() => {
//     const saved = localStorage.getItem('facultyFormData');
//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch (e) {
//         console.error('Error parsing saved facultyFormData:', e);
//       }
//     }
//     return {
//       // Request details
//       requestCategory: '',
//       dataToChange: [],
//       otherDataChange: '',

//       // Personal details
//       title: '',
//       staffName: '',
//       staffNo: '',
//       designation: '',
//       department: '',
//       dob: '',
//       joiningDate: '',
//       retirementDate: '',
//       gender: '',
//       bloodGroup: '',

//       // Contact details
//       phone: '',
//       address: '',

//       // Additional for specific categories
//       correctionDetails: '',
//       officeOrderAttached: false
//     };
//   })
  
//   // Check if user is already verified
//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const savedEmail = localStorage.getItem('email')
//     const savedUserType = localStorage.getItem('userType')
    
//     // Check if verified and if userType matches (either faculty or staff)
//     if (token && savedEmail) {
//       if (savedUserType === 'faculty' || savedUserType === 'staff') {
//         setVerifiedEmail(savedEmail)
//         setStep(1) // Skip verification if already verified
//       } else {
//         // Wrong user type (e.g. student), clear and stay on step 0
//         localStorage.removeItem('token')
//         localStorage.removeItem('email')
//         localStorage.removeItem('userType')
//         localStorage.removeItem('rollNo')
//       }
//     }
//   }, [type])
  
//   // Department options
//   const departmentOptions = [
//     'Civil Engineering',
//     'Computer Science & Engineering',
//     'Electrical & Electronics Engineering',
//     'Electronics & Communication Engineering',
//     'Instrumentation & Control Engineering',
//     'Mechanical Engineering',
//     'Metallurgical and Materials Engineering',
//     'Production Engineering',
//     'Chemical Engineering',
//     'Architecture',
//     'Integrated Teacher Education Programme (ITEP)',
//     'Physics',
//     'Chemistry',
//     'Mathematics',
//     'Computer Science',
//     'Computer Applications',
//     'English',
//     'Management Studies',
//     'Other'
//   ]
  
//   // Data change options
//   const dataChangeOptions = [
//     'Name',
//     'Address',
//     'Designation',
//     'Email ID',
//     'Date Of Birth',
//     'Contact No',
//     'Transfer / Promotion / Redesignation',
//     'Other'
//   ]
  
//   // Handle Send OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault()
//     setError('')
//     const emailTrimmed = email.trim().toLowerCase()
    
//     if (!emailTrimmed.endsWith('@nitt.edu')) {
//       setError('Only @nitt.edu institute email is allowed')
//       return
//     }
    
//     setLoading(true)
//     try {
//       await authAPI.sendOTP({ 
//         email: emailTrimmed, 
//         userType: type 
//       })
//       setVerificationSubstep('otp')
//     } catch (err) {
//       setError(err.message || 'Failed to send OTP')
//     }
//     setLoading(false)
//   }
  
//   // Handle Verify OTP - SIMPLIFIED
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
    
//     try {
//       // For testing - bypass actual API call
//       const mockResponse = {
//         token: 'mock-token-12345',
//         email: email.trim().toLowerCase()
//       }
      
//       // If you want to use actual API, uncomment below:
//       // const res = await authAPI.verifyEmail(
//       //   email.trim().toLowerCase(),  // email
//       //   otp.trim(),                   // otp  
//       //   type                         // userType
//       // )
      
//       localStorage.setItem('token', mockResponse.token)
//       localStorage.setItem('email', mockResponse.email)
//       localStorage.setItem('userType', type)
      
//       setVerifiedEmail(mockResponse.email)
//       setStep(1) // Move to form step
//     } catch (err) {
//       setError(err.message || 'Invalid OTP. Please try again.')
//     }
//     setLoading(false)
//   }
  
//   // Handle photo upload
//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0]
//     if (!file) return
    
//     // Check file type
//     if (!file.type.startsWith('image/')) {
//       setError('Please upload an image file (JPG, JPEG, PNG)')
//       return
//     }
    
//     // Check file size (max 1MB)
//     if (file.size > 1024 * 1024) {
//       setError('File size must be less than 1MB')
//       return
//     }
    
//     setPhoto(file)
    
//     // Create preview
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       setPhotoPreview(reader.result)
//     }
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
//     localStorage.setItem('facultyFormData', JSON.stringify(updatedData));
//   }
  
//   const handleFormSubmit = (e) => {
//     e.preventDefault()
    
//     // Validation
//     if (!formData.requestCategory) {
//       setError('Please select a request category')
//       return
//     }
    
//     if (!formData.title || !formData.staffName || !formData.staffNo || !formData.designation || !formData.department) {
//       setError('Please fill all required fields')
//       return
//     }
    
//     if (!photo) {
//       setError('Please upload a passport-size photo')
//       return
//     }
    
//     setStep(2)
//   }
  
//   const handleFinalSubmit = async () => {
//     setError('')
//     setLoading(true)
    
//     try {
//       // Create FormData
//       const formDataToSend = new FormData()
      
//       // Add all form data
//       formDataToSend.append('userType', type)
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
      
//       // Add photo
//       if (photo) {
//         formDataToSend.append('photo', photo)
//       }
      
//       // Add timestamp
//       formDataToSend.append('submittedAt', new Date().toISOString())
      
//       // Generate application ID (will be overridden by backend but used for PDF)
//       const year = new Date().getFullYear()
//       const randomNum = Math.floor(10000 + Math.random() * 90000)
//       const tempApplicationId = `NITT-${type.toUpperCase()}-${year}-${randomNum}`
      
//       // Generate application PDF
//       const pdfDoc = await generateFacultyStaffPDF({
//         ...formData,
//         email: verifiedEmail,
//         userType: type
//       }, false);
//       const pdfBlob = pdfDoc.output('blob');
//       formDataToSend.append('applicationPdf', pdfBlob, `application_${formData.staffNo || tempApplicationId}.pdf`);

//       // Submit to backend
//       const result = await applicationAPI.submit(formDataToSend)
//       const realApplicationId = result.applicationId || result.id || applicationId
      
//       // Show success and redirect
//       alert('Application submitted successfully!')
      
//       // Clear local storage
//       localStorage.removeItem('token')
//       localStorage.removeItem('email')
//       localStorage.removeItem('userType')
//       localStorage.removeItem('facultyFormData')
      
//       // Navigate to success page
//       navigate(`/success/${realApplicationId}`, { state: { application: result.application } })
//     } catch (err) {
//       setError(err.message || 'Submission failed. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }
  
//   // Step 0: Email Verification
//   if (step === 0) {
//     return (
//       <div className="faculty-form-container">
//         <StepIndicator 
//           current={0} 
//           total={FACULTY_STAFF_STEPS.length} 
//           labels={FACULTY_STAFF_STEPS} 
//         />
        
//         <div className="faculty-form-card">
//           <h2>Email Verification</h2>
//           <p className="form-description">
//             Enter your institute email (@nitt.edu) to receive verification OTP
//           </p>
          
//           <div className="info-box">
//             <h4>Email Verification Instructions:</h4>
//             <ul>
//               <li>Use your institute email address (@nitt.edu)</li>
//               <li>A 6-digit OTP will be sent to your email</li>
//               <li>OTP is valid for 5 minutes</li>
//             </ul>
//           </div>
          
//           {error && <div className="error-message">{error}</div>}
          
//           {verificationSubstep === 'email' ? (
//             <form onSubmit={handleSendOtp}>
//               <div className="form-group">
//                 <label>Institute Email *</label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your.name@nitt.edu"
//                   required
//                   disabled={loading}
//                 />
//                 <small>Only @nitt.edu emails are allowed</small>
//               </div>
              
//               <div className="button-group">
//                 <button 
//                   type="submit" 
//                   className="btn btn-primary"
//                   disabled={loading}
//                 >
//                   {loading ? 'Sending OTP...' : 'Send OTP'}
//                 </button>
                
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary"
//                   onClick={() => navigate('/')}
//                 >
//                   Back to Home
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOtp}>
//               <div className="form-group">
//                 <label>OTP sent to {email}</label>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter 6-digit OTP"
//                   maxLength={6}
//                   required
//                   disabled={loading}
//                 />
//                 <small>For testing, enter any 6-digit number</small>
//               </div>
              
//               <div className="button-group">
//                 <button 
//                   type="submit" 
//                   className="btn btn-primary"
//                   disabled={loading}
//                 >
//                   {loading ? 'Verifying...' : 'Verify OTP'}
//                 </button>
                
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary"
//                   onClick={() => {
//                     setVerificationSubstep('email')
//                     setOtp('')
//                     setError('')
//                   }}
//                 >
//                   Change Email
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     )
//   }
  
//   // Step 1: Application Form (Opens directly after verification)
//   if (step === 1) {
//     return (
//       <div className="faculty-form-container">
//         <StepIndicator 
//           current={1} 
//           total={FACULTY_STAFF_STEPS.length} 
//           labels={FACULTY_STAFF_STEPS} 
//         />
        
//         <div className="faculty-form-card">
//           <h2>ID Card Form for {type === 'faculty' ? 'Faculty' : 'Staff'}</h2>
//           <p className="form-description">
//             The printed form must be submitted to the library for verification after being duly signed by the Registrar
//           </p>
          
//           {error && <div className="error-message">{error}</div>}
          
//           <form onSubmit={handleFormSubmit}>
//             {/* Request Category Section */}
//             <h3>Request Details</h3>
//             <div className="form-group">
//               <label>Request Category *</label>
//               <select
//                 name="requestCategory"
//                 value={formData.requestCategory}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 <option value="New">New ID Card</option>
//                 <option value="Correction">Correction - Specify details to be modified</option>
//                 <option value="Update">Update - For change in Department/Section/Designation</option>
//                 <option value="Replacement">Replacement (Lost/Damaged)</option>
//               </select>
//               <small>For Correction: Submit old ID card. For Update: Attach office order</small>
//             </div>
            
//             {/* Data to be Changed (for Correction/Update) */}
//             {(formData.requestCategory === 'Correction' || formData.requestCategory === 'Update') && (
//               <div className="form-group">
//                 <label>Data to be Changed *</label>
//                 <div className="checkbox-group">
//                   {dataChangeOptions.map(option => (
//                     <label key={option} className="checkbox-label">
//                       <input
//                         type="checkbox"
//                         name="dataToChange"
//                         value={option}
//                         checked={formData.dataToChange.includes(option)}
//                         onChange={handleInputChange}
//                       />
//                       <span>{option}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             {/* Personal Information */}
//             <h3>Personal Information</h3>
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Title *</label>
//                 <select
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                 >
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
//                 <input
//                   type="text"
//                   name="staffName"
//                   value={formData.staffName}
//                   onChange={handleInputChange}
//                   placeholder="Enter full name"
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Staff No. *</label>
//                 <input
//                   type="text"
//                   name="staffNo"
//                   value={formData.staffNo}
//                   onChange={handleInputChange}
//                   placeholder="Enter staff number"
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Designation *</label>
//                 <input
//                   type="text"
//                   name="designation"
//                   value={formData.designation}
//                   onChange={handleInputChange}
//                   placeholder="Enter designation"
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Department / Section *</label>
//                 <select
//                   name="department"
//                   value={formData.department}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select Department</option>
//                   {departmentOptions.map(dept => (
//                     <option key={dept} value={dept}>{dept}</option>
//                   ))}
//                 </select>
//               </div>
              
//               <div className="form-group">
//                 <label>Date of Birth *</label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Date of Joining *</label>
//                 <input
//                   type="date"
//                   name="joiningDate"
//                   value={formData.joiningDate}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Date of Retirement (if applicable)</label>
//                 <input
//                   type="date"
//                   name="retirementDate"
//                   value={formData.retirementDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Gender *</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//               </div>
              
//               <div className="form-group">
//                 <label>Blood Group *</label>
//                 <select
//                   name="bloodGroup"
//                   value={formData.bloodGroup}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select Blood Group</option>
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
            
//             {/* Contact Information */}
//             <h3>Contact Information</h3>
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Email ID *</label>
//                 <input
//                   type="email"
//                   value={verifiedEmail}
//                   readOnly
//                   disabled
//                   className="disabled-input"
//                 />
//                 <small>Verified email from previous step</small>
//               </div>
              
//               <div className="form-group">
//                 <label>Mobile Number *</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   placeholder="10-digit mobile number"
//                   maxLength="10"
//                   required
//                 />
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label>Address *</label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 placeholder="Enter complete address"
//                 rows="3"
//                 required
//               />
//             </div>
            
//             {/* Photo Upload */}
//             <h3>Photo Upload</h3>
//             <div className="form-group">
//               <label>Passport Size Photo * (Max 1MB, JPG/JPEG/PNG)</label>
//               <div className="photo-upload-area">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handlePhotoUpload}
//                   accept=".jpg,.jpeg,.png,.webp"
//                   style={{ display: 'none' }}
//                 />
                
//                 {photoPreview ? (
//                   <div className="photo-preview">
//                     <img src={photoPreview} alt="Preview" />
//                     <div className="photo-info">
//                       <p>{photo.name}</p>
//                       <p>{(photo.size / 1024).toFixed(2)} KB</p>
//                       <button 
//                         type="button" 
//                         onClick={() => {
//                           setPhoto(null)
//                           setPhotoPreview('')
//                           if (fileInputRef.current) {
//                             fileInputRef.current.value = ''
//                           }
//                         }}
//                         className="btn-remove"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div 
//                     className="upload-placeholder"
//                     onClick={() => fileInputRef.current.click()}
//                   >
//                     <div className="upload-icon">📸</div>
//                     <p>Click to upload passport size photo</p>
//                     <small>Max 1MB, JPG/JPEG/PNG format</small>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Declaration */}
//             <div className="declaration-box">
//               <h4>Declaration</h4>
//               <p>
//                 I hereby declare that the information provided above is true and correct to the best of my knowledge.
//                 I understand that providing false information may result in rejection of my application and
//                 disciplinary action as per institute rules.
//               </p>
//             </div>
            
//             {/* Navigation Buttons */}
//             <div className="button-group">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setStep(0)
//                   setError('')
//                 }}
//                 className="btn btn-secondary"
//               >
//                 ← Back to Verification
//               </button>
              
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//               >
//                 Preview Application →
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )
//   }
  
//   // Step 2: Preview
//   return (
//     <div className="faculty-form-container">
//       <StepIndicator 
//         current={2} 
//         total={FACULTY_STAFF_STEPS.length} 
//         labels={FACULTY_STAFF_STEPS} 
//       />
      
//       <div className="faculty-form-card">
//         <h2>Preview Your Application</h2>
//         <p className="form-description">
//           Review all information before submission
//         </p>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <div className="preview-section">
//           <h3>Application Summary</h3>
          
//           <div className="preview-grid">
//             <div className="preview-item">
//               <strong>Request Category:</strong> {formData.requestCategory}
//             </div>
            
//             {formData.dataToChange.length > 0 && (
//               <div className="preview-item">
//                 <strong>Data to be Changed:</strong> {formData.dataToChange.join(', ')}
//               </div>
//             )}
            
//             <div className="preview-item">
//               <strong>Title:</strong> {formData.title}
//             </div>
            
//             <div className="preview-item">
//               <strong>Name:</strong> {formData.staffName}
//             </div>
            
//             <div className="preview-item">
//               <strong>Staff No:</strong> {formData.staffNo}
//             </div>
            
//             <div className="preview-item">
//               <strong>Designation:</strong> {formData.designation}
//             </div>
            
//             <div className="preview-item">
//               <strong>Department:</strong> {formData.department}
//             </div>
            
//             <div className="preview-item">
//               <strong>Date of Birth:</strong> {formatDate(formData.dob)}
//             </div>
            
//             <div className="preview-item">
//               <strong>Date of Joining:</strong> {formatDate(formData.joiningDate)}
//             </div>
            
//             {formData.retirementDate && (
//               <div className="preview-item">
//                 <strong>Date of Retirement:</strong> {formatDate(formData.retirementDate)}
//               </div>
//             )}
            
//             <div className="preview-item">
//               <strong>Gender:</strong> {formData.gender}
//             </div>
            
//             <div className="preview-item">
//               <strong>Blood Group:</strong> {formData.bloodGroup || 'Not specified'}
//             </div>
            
//             <div className="preview-item">
//               <strong>Email:</strong> {verifiedEmail}
//             </div>
            
//             <div className="preview-item">
//               <strong>Mobile:</strong> {formData.phone}
//             </div>
            
//             <div className="preview-item full-width">
//               <strong>Address:</strong> {formData.address}
//             </div>
            
//             <div className="preview-item">
//               <strong>Photo Uploaded:</strong> {photo ? 'Yes' : 'No'}
//               {photo && (
//                 <div style={{ marginTop: '10px' }}>
//                   <small>File: {photo.name}</small><br />
//                   <small>Size: {(photo.size / 1024).toFixed(2)} KB</small>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div className="instruction-box">
//             <h4>Important Instructions:</h4>
//             <ol>
//               <li>Print this application form</li>
//               <li>Attach a recent passport-size photograph</li>
//               <li>{formData.requestCategory === 'Correction' ? 'Submit the old ID card along with this form' : ''}</li>
//               <li>{formData.requestCategory === 'Update' ? 'Attach the office order with this form' : ''}</li>
//               <li>Get the form duly signed by the Registrar</li>
//               <li>Submit the complete set to the library for verification</li>
//             </ol>
//           </div>
//         </div>
        
//         <div className="button-group">
//           <button
//             type="button"
//             onClick={() => setStep(1)}
//             className="btn btn-secondary"
//           >
//             ← Edit Application
//           </button>
          
          
//           <button
//             type="button"
//             onClick={handleFinalSubmit}
//             disabled={loading}
//             className="btn btn-primary"
//           >
//             {loading ? 'Submitting...' : 'Submit Application'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client';

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { jsPDF } from 'jspdf'
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
  const [error, setError] = useState('')
  
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationSubstep, setVerificationSubstep] = useState('email')
  const [verifiedEmail, setVerifiedEmail] = useState('')
  
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const fileInputRef = useRef(null)
  
  // Clean start on load
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
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
    setError('')
    const emailTrimmed = String(email).trim().toLowerCase()
    
    if (!emailTrimmed.endsWith('@nitt.edu')) {
      setError('Only @nitt.edu institute email is allowed')
      return
    }
    
    setLoading(true)
    localStorage.removeItem('token');
    
    try {
      await authAPI.sendOTP({ 
        email: emailTrimmed, 
        userType: role || 'staff'
      })
      setVerificationSubstep('otp')
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    }
    setLoading(false)
  }
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const finalEmail = String(email).trim().toLowerCase();
      const finalOtp = String(otp).trim();
      const finalRole = role || 'staff'; 

      // Send arguments separately to ensure API receives them correctly
      const res = await authAPI.verifyEmail(finalEmail, finalOtp, finalRole);
      
      // Save session data
      localStorage.setItem('token', res.token)
      localStorage.setItem('email', res.email)
      localStorage.setItem('userType', finalRole)
      
      setVerifiedEmail(res.email)
      setStep(1) 
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message || 'Invalid OTP';
      setError(backendMsg);
    }
    setLoading(false)
  }
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please upload an image file (JPG, JPEG, PNG)'); return }
    if (file.size > 1024 * 1024) { setError('File size must be less than 1MB'); return }
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
    if (!formData.requestCategory) { setError('Please select a request category'); return }
    if (!formData.title || !formData.staffName || !formData.staffNo || !formData.designation || !formData.department) {
      setError('Please fill all required fields'); return
    }
    if (!photo) { setError('Please upload a passport-size photo'); return }
    setStep(2)
  }
  
  const handleFinalSubmit = async () => {
    setError('')
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
      
      // Clear session and redirect
      localStorage.clear();
      sessionStorage.clear();
      
      navigate(`/success/${realApplicationId}`, { state: { application: result.application } })
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message;
      setError(backendMsg);
    } finally {
      setLoading(false)
    }
  }
  
  // STEP 0: EMAIL VERIFICATION
  if (step === 0) {
    return (
      <div className="faculty-form-container">
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
          
          {error && <div className="error-message">{error}</div>}
          
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
                <button type="button" className="btn btn-secondary" onClick={() => { setVerificationSubstep('email'); setOtp(''); setError(''); }}>Change Email</button>
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
        <StepIndicator current={1} total={FACULTY_STAFF_STEPS.length} labels={FACULTY_STAFF_STEPS} />
        <div className="faculty-form-card">
          <h2>ID Card Form for {role === 'faculty' ? 'Faculty' : 'Staff'}</h2>
          <p className="form-description">The printed form must be submitted to the library for verification after being duly signed by the Registrar</p>
          {error && <div className="error-message">{error}</div>}
          
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
              <button type="button" onClick={() => { setStep(0); setError('') }} className="btn btn-secondary">← Back</button>
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
        <StepIndicator current={2} total={FACULTY_STAFF_STEPS.length} labels={FACULTY_STAFF_STEPS} />
        <div className="faculty-form-card">
          <h2>Preview Your Application</h2>
          {error && <div className="error-message">{error}</div>}
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