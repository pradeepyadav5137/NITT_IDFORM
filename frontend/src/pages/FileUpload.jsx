// // // 'use client';

// // // import { useState } from 'react'
// // // import { useNavigate } from 'react-router-dom'
// // // import './Form.css'

// // // export default function FileUpload() {
// // //   const navigate = useNavigate()
// // //   const userType = localStorage.getItem('userType')
// // //   const [files, setFiles] = useState({
// // //     photo: null,
// // //     fir: null,
// // //     payment: null
// // //   })
// // //   const [error, setError] = useState('')

// // //   const handleFileChange = (e) => {
// // //     const { name, files: fileList } = e.target
// // //     if (fileList.length > 0) {
// // //       const file = fileList[0]
// // //       if (file.size > 5 * 1024 * 1024) {
// // //         setError(`${name} file size exceeds 5MB limit`)
// // //         return
// // //       }
// // //       setFiles(prev => ({ ...prev, [name]: file }))
// // //       setError('')
// // //     }
// // //   }

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault()
// // //     setError('')

// // //     if (!files.photo) {
// // //       setError('Please upload a photo')
// // //       return
// // //     }

// // //     if (!files.fir) {
// // //       setError('Please upload FIR/Lost document report')
// // //       return
// // //     }

// // //     if (userType !== 'faculty' && !files.payment) {
// // //       setError('Please upload payment receipt')
// // //       return
// // //     }

// // //     localStorage.setItem('uploadedFiles', JSON.stringify({
// // //       photo: files.photo,
// // //       fir: files.fir,
// // //       payment: files.payment
// // //     }))

// // //     navigate('/preview')
// // //   }

// // //   return (
// // //     <div className="form-container">
// // //       <div className="form-card">
// // //         <h2>Upload Documents</h2>
// // //         <p className="form-description">Please upload all required documents</p>

// // //         {error && <div className="error-message">{error}</div>}

// // //         <form onSubmit={handleSubmit}>
// // //           <div className="form-group">
// // //             <label htmlFor="photo">Passport Photo * (JPG, PNG - Max 5MB)</label>
// // //             <input
// // //               type="file"
// // //               id="photo"
// // //               name="photo"
// // //               onChange={handleFileChange}
// // //               accept=".jpg,.jpeg,.png"
// // //               required
// // //             />
// // //             {files.photo && <small className="file-check">✓ {files.photo.name}</small>}
// // //           </div>

// // //           <div className="form-group">
// // //             <label htmlFor="fir">FIR Copy / Lost Document Report * (PDF, JPG, PNG - Max 5MB)</label>
// // //             <input
// // //               type="file"
// // //               id="fir"
// // //               name="fir"
// // //               onChange={handleFileChange}
// // //               accept=".pdf,.jpg,.jpeg,.png"
// // //               required
// // //             />
// // //             {files.fir && <small className="file-check">✓ {files.fir.name}</small>}
// // //           </div>

// // //           {userType !== 'faculty' && (
// // //             <div className="form-group">
// // //               <label htmlFor="payment">Payment Receipt - Rs. 500 * (PDF, JPG, PNG - Max 5MB)</label>
// // //               <input
// // //                 type="file"
// // //                 id="payment"
// // //                 name="payment"
// // //                 onChange={handleFileChange}
// // //                 accept=".pdf,.jpg,.jpeg,.png"
// // //                 required
// // //               />
// // //               {files.payment && <small className="file-check">✓ {files.payment.name}</small>}
// // //             </div>
// // //           )}

// // //           <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
// // //             <button type="submit" className="btn btn-primary">
// // //               Review Application
// // //             </button>
// // //             <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
// // //               Back
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // import { useState, useEffect } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import './StudentFlow.css'

// // export default function FileUpload() {
// //   const navigate = useNavigate()
// //   const userType = localStorage.getItem('userType')
// //   const [files, setFiles] = useState({
// //     photo: null,
// //     fir: null,
// //     payment: null
// //   })
// //   const [previews, setPreviews] = useState({
// //     photo: null,
// //     fir: null,
// //     payment: null
// //   })
// //   const [error, setError] = useState('')
// //   const [loading, setLoading] = useState(false)

// //   const isStudent = userType === 'student'

// //   useEffect(() => {
// //     // Check if user has completed the form
// //     const formData = localStorage.getItem('formData')
// //     if (!formData) {
// //       navigate(isStudent ? '/student-form' : '/faculty-form')
// //     }
// //   }, [navigate, isStudent])

// //   const validateFile = (file, maxSize = 5) => {
// //     const maxSizeInBytes = maxSize * 1024 * 1024
    
// //     if (file.size > maxSizeInBytes) {
// //       return `File size exceeds ${maxSize}MB limit`
// //     }
    
// //     return null
// //   }

// //   const handleFileChange = (e) => {
// //     const { name, files: fileList } = e.target
// //     setError('')
    
// //     if (fileList.length > 0) {
// //       const file = fileList[0]
      
// //       // Validate file size
// //       const validationError = validateFile(file)
// //       if (validationError) {
// //         setError(validationError)
// //         e.target.value = ''
// //         return
// //       }
      
// //       // Update files state
// //       setFiles(prev => ({ ...prev, [name]: file }))
      
// //       // Create preview for images
// //       if (file.type.startsWith('image/')) {
// //         const reader = new FileReader()
// //         reader.onloadend = () => {
// //           setPreviews(prev => ({ ...prev, [name]: reader.result }))
// //         }
// //         reader.readAsDataURL(file)
// //       } else {
// //         setPreviews(prev => ({ ...prev, [name]: null }))
// //       }
// //     }
// //   }

// //   const removeFile = (fieldName) => {
// //     setFiles(prev => ({ ...prev, [fieldName]: null }))
// //     setPreviews(prev => ({ ...prev, [fieldName]: null }))
// //     setError('')
    
// //     // Clear the file input
// //     const fileInput = document.querySelector(`input[name="${fieldName}"]`)
// //     if (fileInput) {
// //       fileInput.value = ''
// //     }
// //   }

// //   const handleSubmit = (e) => {
// //     e.preventDefault()
// //     setError('')
// //     setLoading(true)

// //     // Validate required files
// //     if (!files.photo) {
// //       setError('Please upload your passport-sized photograph')
// //       setLoading(false)
// //       return
// //     }

// //     if (!files.fir) {
// //       setError('Please upload FIR copy or lost document report')
// //       setLoading(false)
// //       return
// //     }

// //     if (isStudent && !files.payment) {
// //       setError('Please upload payment receipt')
// //       setLoading(false)
// //       return
// //     }

// //     // Save files to localStorage (in production, upload to server)
// //     const filesData = {
// //       photo: files.photo.name,
// //       fir: files.fir.name,
// //       payment: files.payment?.name || null
// //     }
    
// //     localStorage.setItem('uploadedFiles', JSON.stringify(filesData))

// //     // Simulate upload delay
// //     setTimeout(() => {
// //       setLoading(false)
// //       navigate('/preview')
// //     }, 1000)
// //   }

// //   const formatFileSize = (bytes) => {
// //     if (bytes === 0) return '0 Bytes'
// //     const k = 1024
// //     const sizes = ['Bytes', 'KB', 'MB']
// //     const i = Math.floor(Math.log(bytes) / Math.log(k))
// //     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
// //   }

// //   return (
// //     <div className="form-container">
// //       <div className="form-card">
// //         {/* Header */}
// //         <h2>Upload Required Documents</h2>
// //         <p className="form-description">
// //           Please upload all mandatory documents. Ensure files are clear and legible.
// //         </p>

// //         {/* Error Message */}
// //         {error && <div className="error-message">{error}</div>}

// //         {/* Instructions */}
// //         <div className="info-box">
// //           <h4>File Requirements</h4>
// //           <ul>
// //             <li>Supported formats: JPG, PNG, PDF</li>
// //             <li>Maximum file size: 5MB per file</li>
// //             <li>Ensure documents are clear and readable</li>
// //             <li>All files are mandatory unless marked optional</li>
// //           </ul>
// //         </div>

// //         <form onSubmit={handleSubmit}>
// //           {/* Passport Photo */}
// //           <h3>Passport Photograph</h3>
// //           <div className="form-grid full">
// //             <div className="form-group">
// //               <label htmlFor="photo">
// //                 Recent Passport Photo <span className="required">*</span>
// //               </label>
// //               <p style={{ fontSize: '13px', color: '#4a5568', marginBottom: '10px' }}>
// //                 Upload a recent passport-sized photograph with white background (JPG/PNG, max 5MB)
// //               </p>
              
// //               {previews.photo && (
// //                 <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
// //                   <img
// //                     src={previews.photo}
// //                     alt="Photo preview"
// //                     style={{
// //                       width: '120px',
// //                       height: '150px',
// //                       objectFit: 'cover',
// //                       borderRadius: '8px',
// //                       border: '2px solid #cbd5e0'
// //                     }}
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => removeFile('photo')}
// //                     className="btn btn-secondary"
// //                     style={{ padding: '8px 16px', fontSize: '13px' }}
// //                   >
// //                     Remove
// //                   </button>
// //                 </div>
// //               )}
              
// //               {!files.photo && (
// //                 <input
// //                   type="file"
// //                   id="photo"
// //                   name="photo"
// //                   onChange={handleFileChange}
// //                   accept="image/jpeg,image/png,image/jpg"
// //                   required
// //                 />
// //               )}
              
// //               {files.photo && (
// //                 <div className="file-check">
// //                   ✓ {files.photo.name} ({formatFileSize(files.photo.size)})
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* FIR Copy */}
// //           <h3>FIR / Lost Document Report</h3>
// //           <div className="form-grid full">
// //             <div className="form-group">
// //               <label htmlFor="fir">
// //                 FIR Copy or Lost Document Report <span className="required">*</span>
// //               </label>
// //               <p style={{ fontSize: '13px', color: '#4a5568', marginBottom: '10px' }}>
// //                 Upload the First Information Report (FIR) filed with police or lost document report (PDF/Image, max 5MB)
// //               </p>
              
// //               {!files.fir && (
// //                 <input
// //                   type="file"
// //                   id="fir"
// //                   name="fir"
// //                   onChange={handleFileChange}
// //                   accept=".pdf,image/jpeg,image/png,image/jpg"
// //                   required
// //                 />
// //               )}
              
// //               {files.fir && (
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //                   <div className="file-check" style={{ flex: 1 }}>
// //                     ✓ {files.fir.name} ({formatFileSize(files.fir.size)})
// //                   </div>
// //                   <button
// //                     type="button"
// //                     onClick={() => removeFile('fir')}
// //                     className="btn btn-secondary"
// //                     style={{ padding: '8px 16px', fontSize: '13px' }}
// //                   >
// //                     Remove
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Payment Receipt - Only for Students */}
// //           {isStudent && (
// //             <>
// //               <h3>Payment Receipt</h3>
// //               <div className="form-grid full">
// //                 <div className="form-group">
// //                   <label htmlFor="payment">
// //                     Fee Payment Receipt - ₹500 <span className="required">*</span>
// //                   </label>
// //                   <p style={{ fontSize: '13px', color: '#4a5568', marginBottom: '10px' }}>
// //                     Upload payment receipt for duplicate ID card fee of ₹500 (PDF/Image, max 5MB)
// //                   </p>
                  
// //                   {!files.payment && (
// //                     <input
// //                       type="file"
// //                       id="payment"
// //                       name="payment"
// //                       onChange={handleFileChange}
// //                       accept=".pdf,image/jpeg,image/png,image/jpg"
// //                       required
// //                     />
// //                   )}
                  
// //                   {files.payment && (
// //                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //                       <div className="file-check" style={{ flex: 1 }}>
// //                         ✓ {files.payment.name} ({formatFileSize(files.payment.size)})
// //                       </div>
// //                       <button
// //                         type="button"
// //                         onClick={() => removeFile('payment')}
// //                         className="btn btn-secondary"
// //                         style={{ padding: '8px 16px', fontSize: '13px' }}
// //                       >
// //                         Remove
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </>
// //           )}

// //           {/* Submit Buttons */}
// //           <div className="button-group" style={{ marginTop: '35px' }}>
// //             <button 
// //               type="submit" 
// //               disabled={loading}
// //               className="btn btn-primary"
// //             >
// //               {loading ? (
// //                 <>
// //                   <span className="loading-spinner"></span> Processing...
// //                 </>
// //               ) : (
// //                 'Continue to Preview →'
// //               )}
// //             </button>
// //             <button
// //               type="button"
// //               onClick={() => navigate(-1)}
// //               className="btn btn-secondary"
// //             >
// //               ← Back to Form
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   )
// // }

// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import './StudentFlow.css'

// export default function FileUpload() {
//   const navigate = useNavigate()
//   const userType = localStorage.getItem('userType')
//   const [files, setFiles] = useState({
//     photo: null,
//     fir: null,
//     payment: null
//   })
//   const [previews, setPreviews] = useState({
//     photo: null,
//     fir: null,
//     payment: null
//   })
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const isStudent = userType === 'student'

//   useEffect(() => {
//     const formData = localStorage.getItem('formData')
//     if (!formData) {
//       navigate(isStudent ? '/student-form' : '/faculty-form')
//     }
//   }, [navigate, isStudent])

//   const validateFile = (file, maxSize = 5) => {
//     const maxSizeInBytes = maxSize * 1024 * 1024
//     if (file.size > maxSizeInBytes) {
//       return `File size exceeds ${maxSize}MB limit`
//     }
//     return null
//   }

//   const handleFileChange = (e) => {
//     const { name, files: fileList } = e.target
//     setError('')
    
//     if (fileList.length > 0) {
//       const file = fileList[0]
//       const validationError = validateFile(file)
//       if (validationError) {
//         setError(validationError)
//         e.target.value = ''
//         return
//       }
      
//       setFiles(prev => ({ ...prev, [name]: file }))
      
//       if (file.type.startsWith('image/')) {
//         const reader = new FileReader()
//         reader.onloadend = () => {
//           setPreviews(prev => ({ ...prev, [name]: reader.result }))
//         }
//         reader.readAsDataURL(file)
//       } else {
//         setPreviews(prev => ({ ...prev, [name]: null }))
//       }
//     }
//   }

//   const removeFile = (fieldName) => {
//     setFiles(prev => ({ ...prev, [fieldName]: null }))
//     setPreviews(prev => ({ ...prev, [fieldName]: null }))
//     setError('')
//     const fileInput = document.querySelector(`input[name="${fieldName}"]`)
//     if (fileInput) fileInput.value = ''
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)

//     // Validate only Photo. FIR is optional.
//     if (!files.photo) {
//       setError('Please upload your passport-sized photograph')
//       setLoading(false)
//       return
//     }

//     // Payment is mandatory for students
//     if (isStudent && !files.payment) {
//       setError('Please upload payment receipt')
//       setLoading(false)
//       return
//     }

//     const filesData = {
//       photo: files.photo.name,
//       fir: files.fir?.name || null, // Allow null FIR
//       payment: files.payment?.name || null
//     }
    
//     localStorage.setItem('uploadedFiles', JSON.stringify(filesData))

//     setTimeout(() => {
//       setLoading(false)
//       navigate('/preview')
//     }, 1000)
//   }

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes'
//     const k = 1024
//     const sizes = ['Bytes', 'KB', 'MB']
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
//   }

//   return (
//     <div className="form-container">
//       <div className="form-card">
//         <h2>Upload Required Documents</h2>
//         <p className="form-description">
//           Please upload your photo and payment receipt. FIR is optional.
//         </p>

//         {error && <div className="error-message">{error}</div>}

//         <div className="info-box">
//           <h4>File Requirements</h4>
//           <ul>
//             <li>Supported formats: JPG, PNG, PDF</li>
//             <li>Maximum file size: 5MB per file</li>
//           </ul>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* Photo Section */}
//           <h3>Passport Photograph</h3>
//           <div className="form-grid full">
//             <div className="form-group">
//               <label htmlFor="photo">Recent Passport Photo <span className="required">*</span></label>
//               {previews.photo && (
//                 <div style={{ marginBottom: '15px' }}>
//                   <img src={previews.photo} alt="Photo preview" style={{ width: '100px', height: '120px', objectFit: 'cover' }} />
//                   <button type="button" onClick={() => removeFile('photo')} className="btn btn-secondary">Remove</button>
//                 </div>
//               )}
//               {!files.photo && (
//                 <input type="file" id="photo" name="photo" onChange={handleFileChange} accept="image/*" required />
//               )}
//             </div>
//           </div>

//           {/* FIR Section (OPTIONAL) */}
//           <h3>FIR / Lost Document Report (Optional)</h3>
//           <div className="form-grid full">
//             <div className="form-group">
//               <label htmlFor="fir">FIR Copy / Lost Report</label>
//               <p style={{ fontSize: '13px', color: '#666' }}>Upload only if required.</p>
//               {!files.fir && (
//                 <input type="file" id="fir" name="fir" onChange={handleFileChange} accept=".pdf,image/*" />
//               )}
//               {files.fir && (
//                 <div>
//                    ✓ {files.fir.name} <button type="button" onClick={() => removeFile('fir')}>Remove</button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Payment Section (Mandatory for Student) */}
//           {isStudent && (
//             <>
//               <h3>Payment Receipt</h3>
//               <div className="form-grid full">
//                 <div className="form-group">
//                   <label htmlFor="payment">Fee Payment Receipt - ₹500 <span className="required">*</span></label>
//                   {!files.payment && (
//                     <input type="file" id="payment" name="payment" onChange={handleFileChange} accept=".pdf,image/*" required />
//                   )}
//                   {files.payment && (
//                      <div>✓ {files.payment.name} <button type="button" onClick={() => removeFile('payment')}>Remove</button></div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="button-group" style={{ marginTop: '35px' }}>
//             <button type="submit" disabled={loading} className="btn btn-primary">
//               {loading ? 'Processing...' : 'Continue to Preview →'}
//             </button>
//             <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">← Back</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentFlow.css'

export default function FileUpload() {
  const navigate = useNavigate()
  const userType = localStorage.getItem('userType')
  const [files, setFiles] = useState({
    photo: null,
    fir: null,
    payment: null
  })
  const [previews, setPreviews] = useState({
    photo: null,
    fir: null,
    payment: null
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isStudent = userType === 'student'

  useEffect(() => {
    const formData = localStorage.getItem('formData')
    if (!formData) {
      navigate(isStudent ? '/student-form' : '/faculty-form')
    }
  }, [navigate, isStudent])

  const validateFile = (file, maxSize = 5) => {
    const maxSizeInBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      return `File size exceeds ${maxSize}MB limit`
    }
    return null
  }

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target
    setError('')
    
    if (fileList.length > 0) {
      const file = fileList[0]
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        e.target.value = ''
        return
      }
      
      setFiles(prev => ({ ...prev, [name]: file }))
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [name]: reader.result }))
        }
        reader.readAsDataURL(file)
      } else {
        setPreviews(prev => ({ ...prev, [name]: null }))
      }
    }
  }

  const removeFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }))
    setPreviews(prev => ({ ...prev, [fieldName]: null }))
    setError('')
    const fileInput = document.querySelector(`input[name="${fieldName}"]`)
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate only Photo. FIR is optional.
    if (!files.photo) {
      setError('Please upload your passport-sized photograph')
      setLoading(false)
      return
    }

    // Payment is mandatory for students
    if (isStudent && !files.payment) {
      setError('Please upload payment receipt')
      setLoading(false)
      return
    }

    const filesData = {
      photo: files.photo.name,
      fir: files.fir?.name || null, // Allow null FIR
      payment: files.payment?.name || null
    }
    
    localStorage.setItem('uploadedFiles', JSON.stringify(filesData))

    setTimeout(() => {
      setLoading(false)
      navigate('/preview')
    }, 1000)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleSbiCollect = () => {
    window.open('https://www.onlinesbi.sbi/sbicollect/', '_blank')
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Upload Required Documents</h2>
        <p className="form-description">
          Please upload your photo and payment receipt. FIR is optional.
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="info-box">
          <h4>File Requirements</h4>
          <ul>
            <li>Supported formats: JPG, PNG, PDF</li>
            <li>Maximum file size: 5MB per file</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Photo Section */}
          <h3>Passport Photograph</h3>
          <div className="form-grid full">
            <div className="form-group">
              <label htmlFor="photo">
                Recent Passport Photo <span className="required">*</span>
              </label>
              {previews.photo && (
                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img 
                    src={previews.photo} 
                    alt="Photo preview" 
                    style={{ 
                      width: '120px', 
                      height: '150px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #cbd5e0'
                    }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => removeFile('photo')} 
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Remove
                  </button>
                </div>
              )}
              {!files.photo && (
                <input 
                  type="file" 
                  id="photo" 
                  name="photo" 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  required 
                />
              )}
              {files.photo && !previews.photo && (
                <div className="file-check">
                  ✓ {files.photo.name} ({formatFileSize(files.photo.size)})
                </div>
              )}
            </div>
          </div>

          {/* FIR Section (OPTIONAL) */}
          <h3>FIR / Lost Document Report (Optional)</h3>
          <div className="form-grid full">
            <div className="form-group">
              <label htmlFor="fir">
                FIR Copy / Lost Report
                <span className="optional"> (Optional)</span>
              </label>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                Required only if ID was lost or stolen. Upload FIR copy filed at police station.
              </p>
              {!files.fir && (
                <input 
                  type="file" 
                  id="fir" 
                  name="fir" 
                  onChange={handleFileChange} 
                  accept=".pdf,image/*" 
                />
              )}
              {files.fir && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="file-check" style={{ flex: 1 }}>
                    ✓ {files.fir.name} ({formatFileSize(files.fir.size)})
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeFile('fir')} 
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section (Mandatory for Student) */}
          {isStudent && (
            <>
              <h3>Payment Receipt</h3>
              
              {/* Payment Instructions */}
              <div className="payment-instructions" style={{ 
                backgroundColor: '#f0f9ff', 
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                fontfamily: 'Segoe UI',
              }}>
                <h4 style={{ color: '#1a365d', marginBottom: '10px' }}>Payment Instructions</h4>
                <p style={{ marginBottom: '15px', fontSize: '14px' }}>
                  <strong>Fee for Duplicate ID Card: ₹500/-</strong>
                </p>
                <ol style={{ marginLeft: '20px', fontSize: '13px' }}>
                  <li><strong>Click the button below to go to SBI Collect</strong></li>
                  <li>Select State: <strong>Tamil Nadu</strong></li>
                  <li>Select Type of Corporate/Institution: <strong>Educational Institutions</strong></li>
                  <li>Select Educational Institution Name: <strong>National Institute of Technology Tiruchirappalli</strong></li>
                  <li>Select Payment Category: <strong>Other Fees</strong></li>
                  <li>Enter the amount: <strong>₹500</strong></li>
                  <li>Fill in your details and complete the payment</li>
                  <li>Download/Save the payment receipt as PDF or image</li>
                </ol>
                
                <button 
                  type="button" 
                  onClick={handleSbiCollect}
                  className="btn btn-primary"
                  style={{ marginTop: '15px' }}
                >
                  Go to SBI Collect Website
                </button>
              </div>

              <div className="warning-box" style={{ 
                backgroundColor: '#fff5f5', 
                border: '1px solid #fc8181',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#c53030', marginBottom: '10px' }}>⚠ Important Warning</h4>
                <p style={{ fontSize: '13px', color: '#c53030', lineHeight: '1.6' }}>
                  <strong>Submission of fake/forged payment receipts is strictly prohibited.</strong><br />
                  As per NITT rules and regulations, any attempt to submit fraudulent documents will result in:
                </p>
                <ul style={{ marginLeft: '20px', marginTop: '8px', color: '#c53030' }}>
                  <li>Immediate rejection of application</li>
                  <li>Disciplinary action under institute code of conduct</li>
                  <li>Academic penalties including suspension</li>
                  <li>Legal action under IPC Section 420 (Cheating)</li>
                </ul>
                <p style={{ fontSize: '13px', color: '#c53030', marginTop: '10px', fontStyle: 'italic' }}>
                  Ensure you upload the genuine receipt from SBI Collect only.
                </p>
              </div>

              <div className="form-grid full">
                <div className="form-group">
                  <label htmlFor="payment">
                    Fee Payment Receipt - ₹500 <span className="required">*</span>
                  </label>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                    Upload the payment receipt downloaded from SBI Collect for ₹500.
                  </p>
                  {!files.payment && (
                    <input 
                      type="file" 
                      id="payment" 
                      name="payment" 
                      onChange={handleFileChange} 
                      accept=".pdf,image/*" 
                      required 
                    />
                  )}
                  {files.payment && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="file-check" style={{ flex: 1 }}>
                        ✓ {files.payment.name} ({formatFileSize(files.payment.size)})
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFile('payment')} 
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* For Faculty (No Payment Required) */}
          {!isStudent && (
            <div className="info-box" style={{ marginTop: '20px', backgroundColor: '#f0fff4', borderColor: '#68d391' }}>
              <h4 style={{ color: '#2f855a' }}>Note for Faculty/Staff</h4>
              <p style={{ fontSize: '13px', color: '#2f855a' }}>
                Faculty and Staff members are exempt from payment fees for duplicate ID cards.
                Only passport photo is required.
              </p>
            </div>
          )}

          <div className="button-group" style={{ marginTop: '35px' }}>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Processing...' : 'Continue to Preview →'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="btn btn-secondary"
            >
              ← Back to Form
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}