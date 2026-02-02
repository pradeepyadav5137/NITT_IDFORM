
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import './StudentFlow.css'

// export default function StudentForm() {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState(() => {
//     const savedData = localStorage.getItem('formData');
//     if (savedData) {
//       try {
//         return JSON.parse(savedData);
//       } catch (e) {
//         console.error('Error parsing saved formData:', e);
//       }
//     }
//     return {
//       // Personal Information
//       name: '',
//       rollNo: localStorage.getItem('rollNo') || '',
//       fatherName: '',
//       motherName: '',
//       dob: '',
//       gender: '',
//       bloodGroup: '',

//       // Contact Information
//       email: localStorage.getItem('email') || '',
//       phone: '',
//       parentMobile: '',
//       permanentAddress: '',

//       // Academic Information
//       programme: '',
//       branch: '',
//       batch: '',
//       semester: '',
//       hostel: '',
//       roomNo: '',
//       issuedBooks: '',

//       // Request Details
//       requestCategory: '',
//       reasonDetails: '',
//       firNumber: '',
//       firDate: '',
//       policeStation: ''
//     };
//   })

//   const [errors, setErrors] = useState({})

//   useEffect(() => {
//     // Check if user is verified
//     const token = localStorage.getItem('token')
//     const email = localStorage.getItem('email')
//     const userType = localStorage.getItem('userType')

//     if (!token || !email || userType !== 'student') {
//       // If not student or not verified, clear and redirect
//       if (userType !== 'student') {
//         localStorage.removeItem('token')
//         localStorage.removeItem('email')
//         localStorage.removeItem('userType')
//         localStorage.removeItem('rollNo')
//       }
//       navigate('/apply/student')
//     }
//   }, [navigate])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     const updatedData = { ...formData, [name]: value };
//     setFormData(updatedData)

//     // Save to localStorage immediately for persistence
//     localStorage.setItem('formData', JSON.stringify(updatedData));

//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     // Phone validation
//     if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
//       newErrors.phone = 'Phone number must be 10 digits'
//     }

//     if (formData.parentMobile && !/^\d{10}$/.test(formData.parentMobile)) {
//       newErrors.parentMobile = 'Mobile number must be 10 digits'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     // Save form data to localStorage
//     localStorage.setItem('formData', JSON.stringify(formData))

//     // Navigate to document upload
//     navigate('/upload-documents')
//   }

//   return (
//     <div className="form-container">
//       <div className="form-card">
//         {/* Header */}
//         <h2>Student Application Form</h2>
//         <p className="form-description">
//           Please fill in all required fields marked with <span style={{ color: '#e53e3e' }}>*</span>
//         </p>

//         <form onSubmit={handleSubmit}>
//           {/* Personal Information */}
//           <h3>Personal Information</h3>
//           <div className="form-grid">
//             <div className="form-group full-width">
//               <label htmlFor="name">
//                 Full Name (as per institute records) <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="rollNo">
//                 Roll Number <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="rollNo"
//                 name="rollNo"
//                 value={formData.rollNo}
//                 disabled
//                 style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed' }}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="email">
//                 Email Address <span className="required">*</span>
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 disabled
//                 style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed' }}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="fatherName">
//                 Father's Name <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="fatherName"
//                 name="fatherName"
//                 value={formData.fatherName}
//                 onChange={handleChange}
//                 placeholder="Enter father's name"
//                 required
//               />
//             </div>

//             {/* <div className="form-group">
//               <label htmlFor="motherName">
//                 Mother's Name <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="motherName"
//                 name="motherName"
//                 value={formData.motherName}
//                 onChange={handleChange}
//                 placeholder="Enter mother's name"
//                 required
//               />
//             </div> */}

//             <div className="form-group">
//               <label htmlFor="dob">
//                 Date of Birth <span className="required">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="dob"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="gender">
//                 Gender <span className="required">*</span>
//               </label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="bloodGroup">
//                 Blood Group <span className="optional">(Optional)</span>
//               </label>
//               <select
//                 id="bloodGroup"
//                 name="bloodGroup"
//                 value={formData.bloodGroup}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Blood Group</option>
//                 <option value="A+">A+</option>
//                 <option value="A-">A-</option>
//                 <option value="B+">B+</option>
//                 <option value="B-">B-</option>
//                 <option value="AB+">AB+</option>
//                 <option value="AB-">AB-</option>
//                 <option value="O+">O+</option>
//                 <option value="O-">O-</option>
//               </select>
//             </div>
//           </div>

//           {/* Contact Information */}
//           <h3>Contact Information</h3>
//           <div className="form-grid">
//             <div className="form-group">
//               <label htmlFor="phone">
//                 Mobile Number <span className="required">*</span>
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="10-digit mobile number"
//                 maxLength="10"
//                 required
//               />
//               {errors.phone && (
//                 <small style={{ color: '#e53e3e', marginTop: '4px' }}>{errors.phone}</small>
//               )}
//             </div>

//             <div className="form-group">
//               <label htmlFor="parentMobile">
//                 Parent/Guardian Mobile <span className="required">*</span>
//               </label>
//               <input
//                 type="tel"
//                 id="parentMobile"
//                 name="parentMobile"
//                 value={formData.parentMobile}
//                 onChange={handleChange}
//                 placeholder="10-digit mobile number"
//                 maxLength="10"
//                 required
//               />
//               {errors.parentMobile && (
//                 <small style={{ color: '#e53e3e', marginTop: '4px' }}>{errors.parentMobile}</small>
//               )}
//             </div>

//             <div className="form-group full-width">
//               <label htmlFor="permanentAddress">
//                 Permanent Address <span className="required">*</span>
//               </label>
//               <textarea
//                 id="permanentAddress"
//                 name="permanentAddress"
//                 value={formData.permanentAddress}
//                 onChange={handleChange}
//                 placeholder="Enter your complete permanent address"
//                 rows="3"
//                 required
//               />
//             </div>
//           </div>

//           {/* Academic Information */}
//           <h3>Academic Information</h3>
//           {/* <div className="form-grid">
//             <div className="form-group">
//               <label htmlFor="programme">
//                 Programme <span className="required">*</span>
//               </label>
//               <select
//                 id="programme"
//                 name="programme"
//                 value={formData.programme}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Programme</option>
//                 <option value="B.Tech">B.Tech</option>
//                 <option value="M.Tech">M.Tech</option>
//                 <option value="M.Sc">M.Sc</option>
//                 <option value="MBA">MBA</option>
//                 <option value="Ph.D">Ph.D</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="branch">
//                 Branch/Department <span className="required">*</span>
//               </label>
//               <select
//                 id="branch"
//                 name="branch"
//                 value={formData.branch}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Branch</option>
//                 <option value="CSE">Computer Science & Engineering</option>
//                 <option value="ECE">Electronics & Communication Engineering</option>
//                 <option value="EEE">Electrical & Electronics Engineering</option>
//                 <option value="ME">Mechanical Engineering</option>
//                 <option value="CE">Civil Engineering</option>
//                 <option value="ICE">Instrumentation & Control Engineering</option>
//                 <option value="MME">Metallurgical & Materials Engineering</option>
//                 <option value="CHE">Chemical Engineering</option>
//                 <option value="PRO">Production Engineering</option>
//                 <option value="ARCH">Architecture</option>
//               </select>
//             </div> */}

//           <div className="form-grid">
//             <div className="form-group">
//               <label htmlFor="programme">
//                 Programme <span className="required">*</span>
//               </label>
//               <select
//                 id="programme"
//                 name="programme"
//                 value={formData.programme}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Programme</option>

//                 <optgroup label="Under Graduate Programmes">
//                   <option value="B.Tech">B.Tech</option>
//                   <option value="B.Arch">B.Arch</option>
//                   <option value="B.Sc B.Ed">B.Sc B.Ed</option>
//                 </optgroup>

//                 <optgroup label="Post Graduate Programmes">
//                   <option value="M.Tech">M.Tech</option>
//                   <option value="M.Arch">M.Arch</option>
//                   <option value="M.Sc">M.Sc</option>
//                   <option value="MBA">MBA</option>
//                   <option value="MCA">MCA</option>
//                   <option value="M.A">M.A</option>
//                 </optgroup>

//                 <optgroup label="Research Programmes">
//                   <option value="M.Sc (Research)">M.Sc (By Research)</option>
//                   <option value="Ph.D">Ph.D</option>
//                 </optgroup>
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="branch">
//                 Branch/Department <span className="required">*</span>
//               </label>
//               <select
//                 id="branch"
//                 name="branch"
//                 value={formData.branch}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Branch/Department</option>

//                 <optgroup label="Engineering Departments">
//                   <option value="Chemical Engineering">Chemical Engineering</option>
//                   <option value="Civil Engineering">Civil Engineering</option>
//                   <option value="Computer Science and Engineering">Computer Science and Engineering</option>
//                   <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
//                   <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
//                   <option value="Instrumentation and Control Engineering">Instrumentation and Control Engineering</option>
//                   <option value="Mechanical Engineering">Mechanical Engineering</option>
//                   <option value="Metallurgical and Materials Engineering">Metallurgical and Materials Engineering</option>
//                   <option value="Production Engineering">Production Engineering</option>
//                   <option value="Architecture">Architecture</option>
//                 </optgroup>

//                 <optgroup label="Science Departments">
//                   <option value="Chemistry">Chemistry</option>
//                   <option value="Physics">Physics</option>
//                   <option value="Mathematics">Mathematics</option>
//                   <option value="Computer Science">Computer Science</option>
//                 </optgroup>

//                 <optgroup label="Humanities & Management">
//                   <option value="English">English (Language and Literature)</option>
//                   <option value="Humanities">Humanities</option>
//                   <option value="Management Studies">Management Studies</option>
//                 </optgroup>

//                 <optgroup label="Other Departments">
//                   <option value="Computer Applications">Computer Applications</option>
//                   <option value="Energy and Environment">Energy and Environment</option>
//                 </optgroup>
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="batch">
//                 Batch/Year <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="batch"
//                 name="batch"
//                 value={formData.batch}
//                 onChange={handleChange}
//                 placeholder="e.g., 2021-2025"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="semester">
//                 Current Semester <span className="required">*</span>
//               </label>
//               <select
//                 id="semester"
//                 name="semester"
//                 value={formData.semester}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Semester</option>
//                 <option value="1">1st Semester</option>
//                 <option value="2">2nd Semester</option>
//                 <option value="3">3rd Semester</option>
//                 <option value="4">4th Semester</option>
//                 <option value="5">5th Semester</option>
//                 <option value="6">6th Semester</option>
//                 <option value="7">7th Semester</option>
//                 <option value="8">8th Semester</option>
//                 <option value="8">9th Semester</option>
//                 <option value="8">10th Semester</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="hostel">
//                 Hostel Name <span className="optional">(If Applicable)</span>
//               </label>
//               <input
//                 type="text"
//                 id="hostel"
//                 name="hostel"
//                 value={formData.hostel}
//                 onChange={handleChange}
//                 placeholder="e.g., Diamond Jubilee"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="roomNo">
//                 Room Number <span className="optional">(If Applicable)</span>
//               </label>
//               <input
//                 type="text"
//                 id="roomNo"
//                 name="roomNo"
//                 value={formData.roomNo}
//                 onChange={handleChange}
//                 placeholder="e.g., 101"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="issuedBooks">
//                 No. of Issued Books <span className="required">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="issuedBooks"
//                 name="issuedBooks"
//                 value={formData.issuedBooks}
//                 onChange={handleChange}
//                 placeholder="0"
//                 min="0"
//                 required
//               />
//             </div>
//           </div>

//           {/* Request Details */}
//           <h3>Request Details</h3>
//           <div className="form-grid">
//             <div className="form-group">
//               <label htmlFor="requestCategory">
//                 Reason for Duplicate ID <span className="required">*</span>
//               </label>
//               <select
//                 id="requestCategory"
//                 name="requestCategory"
//                 value={formData.requestCategory}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Reason</option>
//                 <option value="Lost">Lost</option>
//                 <option value="Damaged">Damaged</option>
//                 <option value="Stolen">Stolen</option>
//                 <option value="Correction">Data Correction</option>
//               </select>
//             </div>

//             <div className="form-group full-width">
//               <label htmlFor="reasonDetails">
//                 Additional Details
//               </label>
//               <textarea
//                 id="reasonDetails"
//                 name="reasonDetails"
//                 value={formData.reasonDetails}
//                 onChange={handleChange}
//                 placeholder="Please provide detailed explanation of the incident"
//                 rows="4"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="firNumber">
//                 FIR Number
//               </label>
//               <input
//                 type="text"
//                 id="firNumber"
//                 name="firNumber"
//                 value={formData.firNumber}
//                 onChange={handleChange}
//                 placeholder="Enter FIR number"

//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="firDate">
//                 FIR Date
//               </label>
//               <input
//                 type="date"
//                 id="firDate"
//                 name="firDate"
//                 value={formData.firDate}
//                 onChange={handleChange}

//               />
//             </div>

//             <div className="form-group full-width">
//               <label htmlFor="policeStation">
//                 Police Station Name
//               </label>
//               <input
//                 type="text"
//                 id="policeStation"
//                 name="policeStation"
//                 value={formData.policeStation}
//                 onChange={handleChange}
//                 placeholder="Enter police station name"

//               />
//             </div>
//           </div>

//           {/* Declaration */}
//           <div className="info-box" style={{ marginTop: '30px', backgroundColor: '#fffaf0', borderColor: '#f6e05e' }}>
//             <h4 style={{ color: '#744210' }}>Declaration</h4>
//             <p style={{ fontSize: '13px', color: '#744210', lineHeight: '1.7' }}>
//               I hereby declare that the information provided above is true and correct to the best of my knowledge.
//               I understand that providing false information may result in rejection of my application and
//               disciplinary action as per institute rules.
//             </p>
//           </div>

//           {/* Submit Button */}
//           <div className="button-group">
//             <button type="submit" className="btn btn-primary">
//               Continue to Upload Documents →
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate('/')}
//               className="btn btn-secondary"
//             >
//               Save as Draft & Exit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentFlow.css'

export default function StudentForm() {
  const navigate = useNavigate()

  // 1. GET VERIFIED CREDENTIALS (The "Truth")
  // These were set by StudentFlow.jsx after OTP verification
  const verifiedRollNo = localStorage.getItem('rollNo');
  const verifiedEmail = localStorage.getItem('email');

  // 2. INITIALIZE STATE WITH SAFETY CHECK
  const [formData, setFormData] = useState(() => {
    // Try to retrieve saved data from a UNIQUE key
    const savedDataString = localStorage.getItem('studentFormData'); 
    
    if (savedDataString) {
      try {
        const savedData = JSON.parse(savedDataString);
        
        // --- THE CRITICAL FIX ---
        // We only use the saved data if the Roll No inside it matches 
        // the Roll No we just verified via OTP.
        if (savedData.rollNo === verifiedRollNo) {
          console.log("Restoring session for:", verifiedRollNo);
          return savedData;
        } else {
          console.log("Found old data for a different user. Clearing form.");
          // We intentionally ignore the saved data here.
        }
      } catch (e) {
        console.error('Error parsing saved formData:', e);
      }
    }

    // Default / Fresh Start (If no valid saved data found)
    return {
      // Personal Information
      name: '',
      // FORCE the form to use the Verified Roll No & Email
      rollNo: verifiedRollNo || '', 
      fatherName: '',
      motherName: '',
      dob: '',
      gender: '',
      bloodGroup: '',

      // Contact Information
      email: verifiedEmail || '', 
      phone: '',
      parentMobile: '',
      permanentAddress: '',

      // Academic Information
      programme: '',
      branch: '',
      batch: '',
      semester: '',
      hostel: '',
      roomNo: '',
      issuedBooks: '',

      // Request Details
      requestCategory: '',
      reasonDetails: '',
      firNumber: '',
      firDate: '',
      policeStation: ''
    };
  })

  const [errors, setErrors] = useState({})

  // 3. SECURITY REDIRECT
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('userType')

    // If we don't have a token OR a verified roll number, kick them out
    if (!token || !verifiedRollNo || userType !== 'student') {
      console.log("Unauthorized access or missing session data. Redirecting.");
      
      if (userType !== 'student') {
        localStorage.clear(); // Safety wipe
      }
      navigate('/apply/student')
    }
  }, [navigate, verifiedRollNo])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData)

    // Save to the UNIQUE key
    localStorage.setItem('studentFormData', JSON.stringify(updatedData));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits'
    }
    if (formData.parentMobile && !/^\d{10}$/.test(formData.parentMobile)) {
      newErrors.parentMobile = 'Mobile number must be 10 digits'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    // Save final state
    localStorage.setItem('studentFormData', JSON.stringify(formData))
    navigate('/upload-documents')
  }

  return (
    <div className="form-container">
      <div className="form-card">
        {/* Header */}
        <h2>Student Application Form</h2>
        <p className="form-description">
          Please fill in all required fields marked with <span style={{ color: '#e53e3e' }}>*</span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">Full Name (as per institute records) <span className="required">*</span></label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
            </div>

            <div className="form-group">
              <label htmlFor="rollNo">Roll Number <span className="required">*</span></label>
              {/* READ ONLY FIELD USING STATE */}
              <input 
                type="text" 
                id="rollNo" 
                name="rollNo" 
                value={formData.rollNo} 
                disabled 
                style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed', fontWeight: 'bold' }} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address <span className="required">*</span></label>
              {/* READ ONLY FIELD USING STATE */}
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                disabled 
                style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed' }} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="fatherName">Father's Name <span className="required">*</span></label>
              <input type="text" id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father's name" required />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth <span className="required">*</span></label>
              <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender <span className="required">*</span></label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group <span className="optional">(Optional)</span></label>
              <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="">Select Blood Group</option>
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

          {/* Contact Information */}
          <h3>Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="phone">Mobile Number <span className="required">*</span></label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" maxLength="10" required />
              {errors.phone && <small style={{ color: '#e53e3e', marginTop: '4px' }}>{errors.phone}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="parentMobile">Parent/Guardian Mobile <span className="required">*</span></label>
              <input type="tel" id="parentMobile" name="parentMobile" value={formData.parentMobile} onChange={handleChange} placeholder="10-digit mobile number" maxLength="10" required />
              {errors.parentMobile && <small style={{ color: '#e53e3e', marginTop: '4px' }}>{errors.parentMobile}</small>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="permanentAddress">Permanent Address <span className="required">*</span></label>
              <textarea id="permanentAddress" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Enter your complete permanent address" rows="3" required />
            </div>
          </div>

          {/* Academic Information */}
          <h3>Academic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="programme">Programme <span className="required">*</span></label>
              <select id="programme" name="programme" value={formData.programme} onChange={handleChange} required>
                <option value="">Select Programme</option>
                <optgroup label="Under Graduate Programmes">
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.Arch">B.Arch</option>
                  <option value="B.Sc B.Ed">B.Sc B.Ed</option>
                </optgroup>
                <optgroup label="Post Graduate Programmes">
                  <option value="M.Tech">M.Tech</option>
                  <option value="M.Arch">M.Arch</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="M.A">M.A</option>
                </optgroup>
                <optgroup label="Research Programmes">
                  <option value="M.Sc (Research)">M.Sc (By Research)</option>
                  <option value="Ph.D">Ph.D</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="branch">Branch/Department <span className="required">*</span></label>
              <select id="branch" name="branch" value={formData.branch} onChange={handleChange} required>
                <option value="">Select Branch/Department</option>
                <optgroup label="Engineering Departments">
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                  <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                  <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                  <option value="Instrumentation and Control Engineering">Instrumentation and Control Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Metallurgical and Materials Engineering">Metallurgical and Materials Engineering</option>
                  <option value="Production Engineering">Production Engineering</option>
                  <option value="Architecture">Architecture</option>
                </optgroup>
                <optgroup label="Science Departments">
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                </optgroup>
                <optgroup label="Humanities & Management">
                  <option value="English">English</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Management Studies">Management Studies</option>
                </optgroup>
                <optgroup label="Other Departments">
                  <option value="Computer Applications">Computer Applications</option>
                  <option value="Energy and Environment">Energy and Environment</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="batch">Batch/Year <span className="required">*</span></label>
              <input type="text" id="batch" name="batch" value={formData.batch} onChange={handleChange} placeholder="e.g., 2021-2025" required />
            </div>

            <div className="form-group">
              <label htmlFor="semester">Current Semester <span className="required">*</span></label>
              <select id="semester" name="semester" value={formData.semester} onChange={handleChange} required>
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sem => (
                   <option key={sem} value={sem}>{sem}{sem === 1 ? 'st' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Semester</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hostel">Hostel Name <span className="optional">(If Applicable)</span></label>
              <input type="text" id="hostel" name="hostel" value={formData.hostel} onChange={handleChange} placeholder="e.g., Diamond Jubilee" />
            </div>

            <div className="form-group">
              <label htmlFor="roomNo">Room Number <span className="optional">(If Applicable)</span></label>
              <input type="text" id="roomNo" name="roomNo" value={formData.roomNo} onChange={handleChange} placeholder="e.g., 101" />
            </div>

            <div className="form-group">
              <label htmlFor="issuedBooks">No. of Issued Books <span className="required">*</span></label>
              <input type="number" id="issuedBooks" name="issuedBooks" value={formData.issuedBooks} onChange={handleChange} placeholder="0" min="0" required />
            </div>
          </div>

          {/* Request Details */}
          <h3>Request Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="requestCategory">Reason for Duplicate ID <span className="required">*</span></label>
              <select id="requestCategory" name="requestCategory" value={formData.requestCategory} onChange={handleChange} required>
                <option value="">Select Reason</option>
                <option value="Lost">Lost</option>
                <option value="Damaged">Damaged</option>
                <option value="Stolen">Stolen</option>
                <option value="Correction">Data Correction</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="reasonDetails">Additional Details</label>
              <textarea id="reasonDetails" name="reasonDetails" value={formData.reasonDetails} onChange={handleChange} placeholder="Please provide detailed explanation..." rows="4" />
            </div>

            <div className="form-group">
              <label htmlFor="firNumber">FIR Number</label>
              <input type="text" id="firNumber" name="firNumber" value={formData.firNumber} onChange={handleChange} placeholder="Enter FIR number" />
            </div>

            <div className="form-group">
              <label htmlFor="firDate">FIR Date</label>
              <input type="date" id="firDate" name="firDate" value={formData.firDate} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label htmlFor="policeStation">Police Station Name</label>
              <input type="text" id="policeStation" name="policeStation" value={formData.policeStation} onChange={handleChange} placeholder="Enter police station name" />
            </div>
          </div>

          {/* Declaration */}
          <div className="info-box" style={{ marginTop: '30px', backgroundColor: '#fffaf0', borderColor: '#f6e05e' }}>
            <h4 style={{ color: '#744210' }}>Declaration</h4>
            <p style={{ fontSize: '13px', color: '#744210', lineHeight: '1.7' }}>
              I hereby declare that the information provided above is true and correct to the best of my knowledge.
            </p>
          </div>

          {/* Submit Button */}
          <div className="button-group">
            <button type="submit" className="btn btn-primary">Continue to Upload Documents →</button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Save as Draft & Exit</button>
          </div>
        </form>
      </div>
    </div>
  )
}