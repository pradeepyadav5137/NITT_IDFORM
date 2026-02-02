// // 'use client';

// // import { useState, useEffect } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import { jsPDF } from 'jspdf'
// // import { applicationAPI, adminAPI, getUploadsBaseUrl } from '../services/api'
// // import './Admin.css'

// // const FILE_BASE_URL = getUploadsBaseUrl?.() || 'http://localhost:5000'

// // function docUrl(path) {
// //   if (!path) return null
// //   if (path.startsWith('http')) return path
// //   return `${FILE_BASE_URL}/uploads/${path}`
// // }

// // const formatDate = (value) => {
// //   if (!value) return ''
// //   try {
// //     const d = new Date(value)
// //     if (Number.isNaN(d.getTime())) return value
// //     return d.toLocaleDateString('en-IN')
// //   } catch {
// //     return value
// //   }
// // }

// // const generateStudentPdf = (app) => {
// //   const doc = new jsPDF('p', 'mm', 'a4')

// //   doc.setFont('helvetica', 'bold')
// //   doc.setFontSize(14)
// //   doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', 105, 20, { align: 'center' })
// //   doc.setFontSize(11)
// //   doc.text('TAMIL NADU, INDIA-620015', 105, 26, { align: 'center' })

// //   doc.setFontSize(12)
// //   doc.text('STUDENT APPLICATION FOR DUPLICATE IDENTITY CARD', 105, 36, { align: 'center' })
// //   doc.setFontSize(10)
// //   doc.text('(to be filled by the student)', 105, 42, { align: 'center' })

// //   let y = 55
// //   const lineGap = 7
// //   const addField = (label, value) => {
// //     doc.setFont('helvetica', 'bold')
// //     doc.text(label, 15, y)
// //     doc.setFont('helvetica', 'normal')
// //     doc.text(String(value || ''), 80, y)
// //     y += lineGap
// //   }

// //   addField('Application ID', app.applicationId)
// //   addField('Name of the Student', app.name)
// //   addField('Roll No.', app.rollNo)
// //   addField('Branch', app.branch)
// //   addField("Parent's Name", app.fatherName)
// //   addField('Blood Group', app.bloodGroup)
// //   addField('D.O.B', formatDate(app.dob))
// //   addField('Contact No.', app.phone)
// //   addField('Email ID', app.email)
// //   addField('Request Category', app.requestCategory)
// //   addField('Reason / Details', app.reasonDetails)
// //   addField('Status', app.status)

// //   const filename = `${app.applicationId || app.rollNo || 'student'}_duplicate_id_application.pdf`
// //   doc.save(filename)
// // }

// // const generateStaffPdf = (app) => {
// //   const doc = new jsPDF('p', 'mm', 'a4')

// //   doc.setFont('helvetica', 'bold')
// //   doc.setFontSize(14)
// //   doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', 105, 20, { align: 'center' })
// //   doc.setFontSize(11)
// //   doc.text('TAMIL NADU, INDIA-620015', 105, 26, { align: 'center' })

// //   doc.setFontSize(12)
// //   doc.text('STAFF APPLICATION FOR DUPLICATE IDENTITY CARD', 105, 36, { align: 'center' })
// //   doc.setFontSize(10)
// //   doc.text('(DESIGNATION/OTHER OFFICIAL CHANGES)', 105, 42, { align: 'center' })
// //   doc.text('(to be filled by the staff)', 105, 48, { align: 'center' })

// //   let y = 60
// //   const lineGap = 7
// //   const addField = (label, value) => {
// //     doc.setFont('helvetica', 'bold')
// //     doc.text(label, 15, y)
// //     doc.setFont('helvetica', 'normal')
// //     doc.text(String(value || ''), 80, y)
// //     y += lineGap
// //   }

// //   addField('Application ID', app.applicationId)
// //   addField('Name of the Staff', app.staffName || app.name)
// //   addField('Staff No.', app.staffNo)
// //   addField('Designation', app.designation)
// //   addField('Title', app.title)
// //   addField('Gender', app.gender)
// //   addField('Blood Group', app.bloodGroup)
// //   addField('Dept./ Section', app.department)
// //   addField('D.O.B', formatDate(app.dob))
// //   addField('Date of Joining', formatDate(app.joiningDate))
// //   addField('Date of Retirement', formatDate(app.retirementDate))
// //   addField('Contact No.', app.phone)
// //   addField('Email ID', app.email)
// //   addField('Request Category', app.requestCategory)
// //   addField('Reason / Details', app.reasonDetails)
// //   addField('Status', app.status)

// //   const filename = `${app.applicationId || app.staffNo || 'staff'}_duplicate_id_application.pdf`
// //   doc.save(filename)
// // }

// // export default function AdminDashboard() {
// //   const navigate = useNavigate()
// //   const [applications, setApplications] = useState([])
// //   const [stats, setStats] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [filter, setFilter] = useState('all')
// //   const [selectedApp, setSelectedApp] = useState(null)
// //   const [action, setAction] = useState(null)
// //   const [notes, setNotes] = useState('')
// //   const [showAddAdmin, setShowAddAdmin] = useState(false)
// //   const [addAdminUsername, setAddAdminUsername] = useState('')
// //   const [addAdminEmail, setAddAdminEmail] = useState('')
// //   const [addAdminPassword, setAddAdminPassword] = useState('')
// //   const [addAdminError, setAddAdminError] = useState('')
// //   const [addAdminLoading, setAddAdminLoading] = useState(false)
// //   const [addAdminSuccess, setAddAdminSuccess] = useState('')

// //   useEffect(() => {
// //     const token = localStorage.getItem('adminToken')
// //     if (!token) {
// //       navigate('/admin-login')
// //       return
// //     }

// //     fetchData()
// //   }, [navigate])

// //   const fetchData = async () => {
// //     try {
// //       const [appRes, statsRes] = await Promise.all([
// //         adminAPI.getAll(),
// //         adminAPI.getStats()
// //       ])
// //       setApplications(appRes.applications || [])
// //       setStats(statsRes.stats)
// //     } catch (err) {
// //       console.error('Error fetching data:', err)
// //     }
// //     setLoading(false)
// //   }

// //   const handleApprove = async () => {
// //     try {
// //       await adminAPI.approve(selectedApp.applicationId, notes)
// //       setSelectedApp(null)
// //       setAction(null)
// //       setNotes('')
// //       fetchData()
// //     } catch (err) {
// //       alert('Error approving application')
// //     }
// //   }

// //   const handleReject = async () => {
// //     if (!notes.trim()) {
// //       alert('Please provide a reason for rejection')
// //       return
// //     }
// //     try {
// //       await adminAPI.reject(selectedApp.applicationId, notes)
// //       setSelectedApp(null)
// //       setAction(null)
// //       setNotes('')
// //       fetchData()
// //     } catch (err) {
// //       alert('Error rejecting application')
// //     }
// //   }

// //   const handleLogout = () => {
// //     localStorage.removeItem('adminToken')
// //     localStorage.removeItem('adminUser')
// //     navigate('/')
// //   }

// //   const handleAddAdmin = async (e) => {
// //     e.preventDefault()
// //     setAddAdminError('')
// //     setAddAdminSuccess('')
// //     setAddAdminLoading(true)
// //     try {
// //       await adminAPI.addAdmin(addAdminUsername.trim(), addAdminEmail.trim(), addAdminPassword)
// //       setAddAdminSuccess('Admin added successfully.')
// //       setAddAdminUsername('')
// //       setAddAdminEmail('')
// //       setAddAdminPassword('')
// //       setTimeout(() => { setShowAddAdmin(false); setAddAdminSuccess(''); }, 2000)
// //     } catch (err) {
// //       setAddAdminError(err.message || 'Failed to add admin')
// //     }
// //     setAddAdminLoading(false)
// //   }

// //   const filteredApps = filter === 'all' 
// //     ? applications 
// //     : applications.filter(app => app.status === filter)

// //   if (loading) return <div className="loading">Loading...</div>

// //   return (
// //     <div className="admin-container">
// //       <div className="admin-header">
// //         <h2>Admin Dashboard</h2>
// //         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
// //           <button onClick={() => setShowAddAdmin(!showAddAdmin)} className="btn btn-secondary">
// //             {showAddAdmin ? 'Hide Add Admin' : 'Add new admin'}
// //           </button>
// //           <button onClick={handleLogout} className="btn btn-secondary">
// //             Logout
// //           </button>
// //         </div>
// //       </div>

// //       {showAddAdmin && (
// //         <div className="form-card" style={{ marginBottom: '20px', maxWidth: '400px' }}>
// //           <h3>Add new admin</h3>
// //           {addAdminError && <div className="error-message">{addAdminError}</div>}
// //           {addAdminSuccess && <div className="success-message">{addAdminSuccess}</div>}
// //           <form onSubmit={handleAddAdmin}>
// //             <div className="form-group">
// //               <label>Username *</label>
// //               <input type="text" value={addAdminUsername} onChange={(e) => setAddAdminUsername(e.target.value)} required />
// //             </div>
// //             <div className="form-group">
// //               <label>Email *</label>
// //               <input type="email" value={addAdminEmail} onChange={(e) => setAddAdminEmail(e.target.value)} required />
// //             </div>
// //             <div className="form-group">
// //               <label>Password *</label>
// //               <input type="password" value={addAdminPassword} onChange={(e) => setAddAdminPassword(e.target.value)} minLength={6} required />
// //             </div>
// //             <button type="submit" disabled={addAdminLoading} className="btn btn-primary">
// //               {addAdminLoading ? 'Adding...' : 'Add admin'}
// //             </button>
// //           </form>
// //         </div>
// //       )}

// //       {stats && (
// //         <div className="stats-grid">
// //           <div className="stat-card">
// //             <div className="stat-number">{stats.total}</div>
// //             <div className="stat-label">Total Applications</div>
// //           </div>
// //           <div className="stat-card">
// //             <div className="stat-number">{stats.pending}</div>
// //             <div className="stat-label">Pending</div>
// //           </div>
// //           <div className="stat-card">
// //             <div className="stat-number">{stats.approved}</div>
// //             <div className="stat-label">Approved</div>
// //           </div>
// //           <div className="stat-card">
// //             <div className="stat-number">{stats.rejected}</div>
// //             <div className="stat-label">Rejected</div>
// //           </div>
// //         </div>
// //       )}

// //       <div className="filter-section">
// //         <button
// //           className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
// //           onClick={() => setFilter('all')}
// //         >
// //           All
// //         </button>
// //         <button
// //           className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
// //           onClick={() => setFilter('pending')}
// //         >
// //           Pending
// //         </button>
// //         <button
// //           className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
// //           onClick={() => setFilter('approved')}
// //         >
// //           Approved
// //         </button>
// //         <button
// //           className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
// //           onClick={() => setFilter('rejected')}
// //         >
// //           Rejected
// //         </button>
// //       </div>

// //       <div className="applications-table">
// //         <table>
// //           <thead>
// //             <tr>
// //               <th>Application ID</th>
// //               <th>Name</th>
// //               <th>Email</th>
// //               <th>Type</th>
// //               <th>Status</th>
// //               <th>Action</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredApps.map(app => (
// //               <tr key={app._id}>
// //                 <td>{app.applicationId}</td>
// //                 <td>{app.userType === 'student' ? app.name : app.staffName}</td>
// //                 <td>{app.email}</td>
// //                 <td className="type-badge">{app.userType}</td>
// //                 <td>
// //                   <span className={`status-badge ${app.status}`}>
// //                     {app.status}
// //                   </span>
// //                 </td>
// //                 <td>
// //                   <button
// //                     className="action-btn"
// //                     onClick={() => {
// //                       setSelectedApp(app)
// //                       setAction(null)
// //                     }}
// //                   >
// //                     View
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {selectedApp && (
// //         <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
// //           <div className="modal-content" onClick={e => e.stopPropagation()}>
// //             <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
// //             <h3>Application Details</h3>
// //             <div className="app-details">
// //               <div><strong>ID:</strong> {selectedApp.applicationId}</div>
// //               <div><strong>Email:</strong> {selectedApp.email}</div>
// //               <div><strong>Phone:</strong> {selectedApp.phone}</div>
// //               <div><strong>Type:</strong> {selectedApp.userType}</div>
// //               <div><strong>Status:</strong> {selectedApp.status}</div>
// //               <div><strong>Created:</strong> {new Date(selectedApp.createdAt).toLocaleDateString()}</div>
// //             </div>

// //             <div className="app-details">
// //               {selectedApp.userType === 'student' ? (
// //                 <>
// //                   <div><strong>Name of the Student:</strong> {selectedApp.name}</div>
// //                   <div><strong>Roll No.:</strong> {selectedApp.rollNo}</div>
// //                   <div><strong>Branch:</strong> {selectedApp.branch}</div>
// //                   <div><strong>Parent&apos;s Name:</strong> {selectedApp.fatherName}</div>
// //                 </>
// //               ) : (
// //                 <>
// //                   <div><strong>Name of the Staff:</strong> {selectedApp.staffName || selectedApp.name}</div>
// //                   <div><strong>Staff No.:</strong> {selectedApp.staffNo}</div>
// //                   <div><strong>Designation:</strong> {selectedApp.designation}</div>
// //                   <div><strong>Title:</strong> {selectedApp.title}</div>
// //                   <div><strong>Dept./ Section:</strong> {selectedApp.department}</div>
// //                 </>
// //               )}
// //               <div><strong>Blood Group:</strong> {selectedApp.bloodGroup}</div>
// //               <div><strong>D.O.B:</strong> {formatDate(selectedApp.dob)}</div>
// //               <div><strong>Request Category:</strong> {selectedApp.requestCategory}</div>
// //               <div><strong>Reason / Details:</strong> {selectedApp.reasonDetails}</div>
// //             </div>

// //             <div className="app-details">
// //               <h4>Uploaded Documents</h4>
// //               {selectedApp.photoPath && (
// //                 <div className="doc-row">
// //                   <strong>Photo:</strong>
// //                   <img
// //                     src={docUrl(selectedApp.photoPath)}
// //                     alt="Applicant"
// //                     style={{ maxWidth: '120px', maxHeight: '150px', display: 'block', marginTop: '8px' }}
// //                   />
// //                 </div>
// //               )}
// //               {selectedApp.firPath && (
// //                 <div className="doc-row">
// //                   <strong>FIR Copy:</strong>{' '}
// //                   <a
// //                     href={`${FILE_BASE_URL}/uploads/${selectedApp.firPath}`}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                   >
// //                     View FIR
// //                   </a>
// //                 </div>
// //               )}
// //               {selectedApp.paymentPath && (
// //                 <div className="doc-row">
// //                   <strong>Payment Receipt:</strong>{' '}
// //                   <a
// //                     href={docUrl(selectedApp.paymentPath)}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                   >
// //                     View Receipt
// //                   </a>
// //                 </div>
// //               )}
// //               {selectedApp.applicationPdfUrl && (
// //                 <div className="doc-row">
// //                   <strong>Application PDF:</strong>{' '}
// //                   <a
// //                     href={docUrl(selectedApp.applicationPdfUrl)}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                   >
// //                     Download application PDF
// //                   </a>
// //                 </div>
// //               )}
// //             </div>

// //             <div style={{ marginTop: '15px', marginBottom: '10px' }}>
// //               <button
// //                 className="btn btn-secondary"
// //                 onClick={() => {
// //                   if (!selectedApp) return
// //                   if (selectedApp.userType === 'student') {
// //                     generateStudentPdf(selectedApp)
// //                   } else {
// //                     generateStaffPdf(selectedApp)
// //                   }
// //                 }}
// //               >
// //                 Download Application PDF
// //               </button>
// //             </div>

// //             {selectedApp.status === 'pending' && (
// //               <>
// //                 {!action ? (
// //                   <div className="action-buttons">
// //                     <button
// //                       className="btn btn-primary"
// //                       onClick={() => setAction('approve')}
// //                     >
// //                       Approve
// //                     </button>
// //                     <button
// //                       className="btn btn-danger"
// //                       onClick={() => setAction('reject')}
// //                     >
// //                       Reject
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <div className="action-form">
// //                     <label>
// //                       {action === 'approve' ? 'Approval Notes' : 'Reason for Rejection'} {action === 'reject' && '*'}
// //                     </label>
// //                     <textarea
// //                       value={notes}
// //                       onChange={(e) => setNotes(e.target.value)}
// //                       placeholder={action === 'reject' ? 'Please provide reason for rejection' : 'Add any notes...'}
// //                       rows="3"
// //                     />
// //                     <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
// //                       <button
// //                         className="btn btn-primary"
// //                         onClick={action === 'approve' ? handleApprove : handleReject}
// //                       >
// //                         {action === 'approve' ? 'Approve' : 'Reject'}
// //                       </button>
// //                       <button
// //                         className="btn btn-secondary"
// //                         onClick={() => {
// //                           setAction(null)
// //                           setNotes('')
// //                         }}
// //                       >
// //                         Cancel
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// 'use client';

// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { jsPDF } from 'jspdf'
// import { applicationAPI, adminAPI  } from '../services/api'

// import './Admin.css'

// const FILE_BASE_URL = window.location.origin.includes('localhost') 
//   ? 'http://localhost:5000' 
//   : window.location.origin
// // const FILE_BASE_URL = getUploadsBaseUrl?.() || 'http://localhost:5000'

// function docUrl(path) {
//   if (!path) return null
//   if (path.startsWith('http')) return path
//   return `${FILE_BASE_URL}/uploads/${path}`
// }

// const formatDate = (value) => {
//   if (!value) return ''
//   try {
//     const d = new Date(value)
//     if (Number.isNaN(d.getTime())) return value
//     return d.toLocaleDateString('en-IN')
//   } catch {
//     return value
//   }
// }

// const generateStudentPdf = (app) => {
//   const doc = new jsPDF('p', 'mm', 'a4')

//   doc.setFont('helvetica', 'bold')
//   doc.setFontSize(14)
//   doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', 105, 20, { align: 'center' })
//   doc.setFontSize(11)
//   doc.text('TAMIL NADU, INDIA-620015', 105, 26, { align: 'center' })

//   doc.setFontSize(12)
//   doc.text('STUDENT APPLICATION FOR DUPLICATE IDENTITY CARD', 105, 36, { align: 'center' })
//   doc.setFontSize(10)
//   doc.text('(to be filled by the student)', 105, 42, { align: 'center' })

//   let y = 55
//   const lineGap = 7
//   const addField = (label, value) => {
//     doc.setFont('helvetica', 'bold')
//     doc.text(label, 15, y)
//     doc.setFont('helvetica', 'normal')
//     doc.text(String(value || ''), 80, y)
//     y += lineGap
//   }

//   addField('Application ID', app.applicationId)
//   addField('Name of the Student', app.name)
//   addField('Roll No.', app.rollNo)
//   addField('Branch', app.branch)
//   addField("Parent's Name", app.fatherName)
//   addField('Blood Group', app.bloodGroup)
//   addField('D.O.B', formatDate(app.dob))
//   addField('Contact No.', app.phone)
//   addField('Email ID', app.email)
//   addField('Request Category', app.requestCategory)
//   addField('Reason / Details', app.reasonDetails)
//   addField('Status', app.status)

//   const filename = `${app.applicationId || app.rollNo || 'student'}_duplicate_id_application.pdf`
//   doc.save(filename)
// }

// const generateStaffPdf = (app) => {
//   const doc = new jsPDF('p', 'mm', 'a4')

//   doc.setFont('helvetica', 'bold')
//   doc.setFontSize(14)
//   doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', 105, 20, { align: 'center' })
//   doc.setFontSize(11)
//   doc.text('TAMIL NADU, INDIA-620015', 105, 26, { align: 'center' })

//   doc.setFontSize(12)
//   doc.text('STAFF APPLICATION FOR DUPLICATE IDENTITY CARD', 105, 36, { align: 'center' })
//   doc.setFontSize(10)
//   doc.text('(DESIGNATION/OTHER OFFICIAL CHANGES)', 105, 42, { align: 'center' })
//   doc.text('(to be filled by the staff)', 105, 48, { align: 'center' })

//   let y = 60
//   const lineGap = 7
//   const addField = (label, value) => {
//     doc.setFont('helvetica', 'bold')
//     doc.text(label, 15, y)
//     doc.setFont('helvetica', 'normal')
//     doc.text(String(value || ''), 80, y)
//     y += lineGap
//   }

//   addField('Application ID', app.applicationId)
//   addField('Name of the Staff', app.staffName || app.name)
//   addField('Staff No.', app.staffNo)
//   addField('Designation', app.designation)
//   addField('Title', app.title)
//   addField('Gender', app.gender)
//   addField('Blood Group', app.bloodGroup)
//   addField('Dept./ Section', app.department)
//   addField('D.O.B', formatDate(app.dob))
//   addField('Date of Joining', formatDate(app.joiningDate))
//   addField('Date of Retirement', formatDate(app.retirementDate))
//   addField('Contact No.', app.phone)
//   addField('Email ID', app.email)
//   addField('Request Category', app.requestCategory)
//   addField('Reason / Details', app.reasonDetails)
//   addField('Status', app.status)

//   const filename = `${app.applicationId || app.staffNo || 'staff'}_duplicate_id_application.pdf`
//   doc.save(filename)
// }

// export default function AdminDashboard() {
//   const navigate = useNavigate()
//   const [applications, setApplications] = useState([])
//   const [stats, setStats] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState('all')
//   const [selectedApp, setSelectedApp] = useState(null)
//   const [action, setAction] = useState(null)
//   const [notes, setNotes] = useState('')
//   const [showAddAdmin, setShowAddAdmin] = useState(false)
//   const [addAdminUsername, setAddAdminUsername] = useState('')
//   const [addAdminEmail, setAddAdminEmail] = useState('')
//   const [addAdminPassword, setAddAdminPassword] = useState('')
//   const [addAdminError, setAddAdminError] = useState('')
//   const [addAdminLoading, setAddAdminLoading] = useState(false)
//   const [addAdminSuccess, setAddAdminSuccess] = useState('')

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken')
//     if (!token) {
//       navigate('/admin-login')
//       return
//     }

//     fetchData()
//   }, [navigate])

//   const fetchData = async () => {
//     try {
//       const [appRes, statsRes] = await Promise.all([
//         adminAPI.getAll(),
//         adminAPI.getStats()
//       ])
//       setApplications(appRes.applications || [])
//       setStats(statsRes.stats)
//     } catch (err) {
//       console.error('Error fetching data:', err)
//     }
//     setLoading(false)
//   }

//   const handleApprove = async () => {
//     try {
//       await adminAPI.approve(selectedApp.applicationId, notes)
//       setSelectedApp(null)
//       setAction(null)
//       setNotes('')
//       fetchData()
//     } catch (err) {
//       alert('Error approving application')
//     }
//   }

//   const handleReject = async () => {
//     if (!notes.trim()) {
//       alert('Please provide a reason for rejection')
//       return
//     }
//     try {
//       await adminAPI.reject(selectedApp.applicationId, notes)
//       setSelectedApp(null)
//       setAction(null)
//       setNotes('')
//       fetchData()
//     } catch (err) {
//       alert('Error rejecting application')
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken')
//     localStorage.removeItem('adminUser')
//     navigate('/')
//   }

//   const handleAddAdmin = async (e) => {
//     e.preventDefault()
//     setAddAdminError('')
//     setAddAdminSuccess('')
//     setAddAdminLoading(true)
//     try {
//       await adminAPI.addAdmin(addAdminUsername.trim(), addAdminEmail.trim(), addAdminPassword)
//       setAddAdminSuccess('Admin added successfully.')
//       setAddAdminUsername('')
//       setAddAdminEmail('')
//       setAddAdminPassword('')
//       setTimeout(() => { setShowAddAdmin(false); setAddAdminSuccess(''); }, 2000)
//     } catch (err) {
//       setAddAdminError(err.message || 'Failed to add admin')
//     }
//     setAddAdminLoading(false)
//   }

//   const filteredApps = filter === 'all' 
//     ? applications 
//     : applications.filter(app => app.status === filter)

//   if (loading) return (
//     <div className="form-container">
//       <div className="form-card">
//         <div className="loading-spinner" style={{ 
//           width: '40px', 
//           height: '40px', 
//           margin: '40px auto',
//           border: '3px solid rgba(201, 162, 39, 0.3)',
//           borderTopColor: '#c9a227'
//         }}></div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="form-container admin-dashboard">
//       <div className="form-card">
//         {/* Admin Header */}
//         <div className="admin-header">
//           <div>
//             <h2>Admin Dashboard</h2>
//             <p className="form-description">Manage all ID card applications from students, faculty, and staff</p>
//           </div>
//           <div className="admin-header-actions">
//             <button 
//               onClick={() => setShowAddAdmin(!showAddAdmin)} 
//               className={`btn btn-secondary ${showAddAdmin ? 'active' : ''}`}
//             >
//               {showAddAdmin ? '✕ Hide Add Admin' : '➕ Add new admin'}
//             </button>
//             <button onClick={handleLogout} className="btn btn-secondary">
//               🚪 Logout
//             </button>
//           </div>
//         </div>

//         {/* Add Admin Form */}
//         {showAddAdmin && (
//           <div className="info-box admin-form" style={{ marginBottom: '30px' }}>
//             <h3>Add New Admin Account</h3>
//             {addAdminError && <div className="error-message">{addAdminError}</div>}
//             {addAdminSuccess && <div className="success-message">{addAdminSuccess}</div>}
//             <form onSubmit={handleAddAdmin}>
//               <div className="form-grid">
//                 <div className="form-group">
//                   <label>Username *</label>
//                   <input 
//                     type="text" 
//                     value={addAdminUsername} 
//                     onChange={(e) => setAddAdminUsername(e.target.value)} 
//                     placeholder="Enter username"
//                     required 
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Email *</label>
//                   <input 
//                     type="email" 
//                     value={addAdminEmail} 
//                     onChange={(e) => setAddAdminEmail(e.target.value)} 
//                     placeholder="admin@example.com"
//                     required 
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Password *</label>
//                   <input 
//                     type="password" 
//                     value={addAdminPassword} 
//                     onChange={(e) => setAddAdminPassword(e.target.value)} 
//                     minLength={6} 
//                     placeholder="Minimum 6 characters"
//                     required 
//                   />
//                 </div>
//               </div>
//               <div className="button-group" style={{ marginTop: '20px' }}>
//                 <button type="submit" disabled={addAdminLoading} className="btn btn-primary">
//                   {addAdminLoading ? (
//                     <>
//                       <span className="loading-spinner" style={{ marginRight: '8px' }}></span>
//                       Adding...
//                     </>
//                   ) : 'Add Admin'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Statistics Cards */}
//         {stats && (
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-icon">📊</div>
//               <div className="stat-number">{stats.total}</div>
//               <div className="stat-label">Total Applications</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon">⏳</div>
//               <div className="stat-number">{stats.pending}</div>
//               <div className="stat-label">Pending Review</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon">✅</div>
//               <div className="stat-number">{stats.approved}</div>
//               <div className="stat-label">Approved</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon">❌</div>
//               <div className="stat-number">{stats.rejected}</div>
//               <div className="stat-label">Rejected</div>
//             </div>
//           </div>
//         )}

//         {/* Filter Section */}
//         <div className="filter-section">
//           <div className="filter-title">
//             <h3>Applications</h3>
//             <small>Showing {filter === 'all' ? 'all' : filter} applications</small>
//           </div>
//           <div className="filter-buttons">
//             <button
//               className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
//               onClick={() => setFilter('all')}
//             >
//               All ({applications.length})
//             </button>
//             <button
//               className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
//               onClick={() => setFilter('pending')}
//             >
//               Pending ({stats?.pending || 0})
//             </button>
//             <button
//               className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
//               onClick={() => setFilter('approved')}
//             >
//               Approved ({stats?.approved || 0})
//             </button>
//             <button
//               className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
//               onClick={() => setFilter('rejected')}
//             >
//               Rejected ({stats?.rejected || 0})
//             </button>
//           </div>
//         </div>

//         {/* Applications Table */}
//         <div className="applications-table-container">
//           <table className="applications-table">
//             <thead>
//               <tr>
//                 <th>Application ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Type</th>
//                 <th>Status</th>
//                 <th>Submitted On</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredApps.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
//                     <div style={{ color: '#718096', fontSize: '14px' }}>
//                       No applications found for this filter
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredApps.map(app => (
//                   <tr key={app._id}>
//                     <td>
//                       <strong>{app.applicationId}</strong>
//                     </td>
//                     <td>
//                       <div className="applicant-name">
//                         {app.userType === 'student' ? app.name : app.staffName}
//                       </div>
//                     </td>
//                     <td>{app.email}</td>
//                     <td>
//                       <span className={`type-badge type-${app.userType}`}>
//                         {app.userType}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`status-badge status-${app.status}`}>
//                         {app.status}
//                       </span>
//                     </td>
//                     <td>
//                       {new Date(app.createdAt).toLocaleDateString('en-IN')}
//                     </td>
//                     <td>
//                       <button
//                         className="action-btn view-btn"
//                         onClick={() => {
//                           setSelectedApp(app)
//                           setAction(null)
//                         }}
//                       >
//                         👁️ View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Application Detail Modal */}
//       {selectedApp && (
//         <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Application Details</h3>
//               <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
//             </div>
            
//             <div className="modal-body">
//               <div className="app-details-section">
//                 <h4>Basic Information</h4>
//                 <div className="form-grid three-cols">
//                   <div className="form-group">
//                     <label>Application ID</label>
//                     <div className="detail-value">{selectedApp.applicationId}</div>
//                   </div>
//                   <div className="form-group">
//                     <label>User Type</label>
//                     <div className="detail-value">
//                       <span className={`type-badge type-${selectedApp.userType}`}>
//                         {selectedApp.userType}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <label>Status</label>
//                     <div className="detail-value">
//                       <span className={`status-badge status-${selectedApp.status}`}>
//                         {selectedApp.status}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <label>Email</label>
//                     <div className="detail-value">{selectedApp.email}</div>
//                   </div>
//                   <div className="form-group">
//                     <label>Phone</label>
//                     <div className="detail-value">{selectedApp.phone}</div>
//                   </div>
//                   <div className="form-group">
//                     <label>Submitted On</label>
//                     <div className="detail-value">
//                       {new Date(selectedApp.createdAt).toLocaleString('en-IN')}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="app-details-section">
//                 <h4>
//                   {selectedApp.userType === 'student' ? 'Student Details' : 'Staff Details'}
//                 </h4>
//                 <div className="form-grid three-cols">
//                   {selectedApp.userType === 'student' ? (
//                     <>
//                       <div className="form-group">
//                         <label>Name</label>
//                         <div className="detail-value">{selectedApp.name}</div>
//                       </div>
//                       <div className="form-group">
//                         <label>Roll No.</label>
//                         <div className="detail-value">{selectedApp.rollNo}</div>
//                       </div>
//                       <div className="form-group">
//                         <label>Branch</label>
//                         <div className="detail-value">{selectedApp.branch}</div>
//                       </div>
//                       <div className="form-group">
//                         <label>Parent's Name</label>
//                         <div className="detail-value">{selectedApp.fatherName}</div>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="form-group">
//                         <label>Name</label>
//                         <div className="detail-value">{selectedApp.staffName || selectedApp.name}</div>
//                       </div>
//                       <div className="form-group">
//                         <label>Staff No.</label>
//                         <div className="detail-value">{selectedApp.staffNo}</div>
//                       </div>
//                       <div className="form-group">
//                         <label>Designation</label>
//                         <div className="detail-value">{selectedApp.designation}</div>
//                       </div>
//                       <div className="form-group">
//                         <label>Title</label>
//                         <div className="detail-value">{selectedApp.title}</div>
//                       </div>
//                       <div className="form-group">
//                         <label>Department</label>
//                         <div className="detail-value">{selectedApp.department}</div>
//                       </div>
//                     </>
//                   )}
//                   <div className="form-group">
//                     <label>Blood Group</label>
//                     <div className="detail-value">{selectedApp.bloodGroup || 'Not specified'}</div>
//                   </div>
//                   <div className="form-group">
//                     <label>Date of Birth</label>
//                     <div className="detail-value">{formatDate(selectedApp.dob)}</div>
//                   </div>
//                   <div className="form-group">
//                     <label>Request Category</label>
//                     <div className="detail-value">{selectedApp.requestCategory}</div>
//                   </div>
//                   <div className="form-group full-width">
//                     <label>Reason / Details</label>
//                     <div className="detail-value">{selectedApp.reasonDetails}</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="app-details-section">
//                 <h4>Uploaded Documents</h4>
//                 <div className="documents-grid">
//                   {selectedApp.photoPath && (
//                     <div className="document-item">
//                       <div className="doc-icon">📷</div>
//                       <div className="doc-info">
//                         <strong>Photograph</strong>
//                         <a
//                           href={docUrl(selectedApp.photoPath)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="doc-link"
//                         >
//                           View Image
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                   {selectedApp.firPath && (
//                     <div className="document-item">
//                       <div className="doc-icon">📄</div>
//                       <div className="doc-info">
//                         <strong>FIR Copy</strong>
//                         <a
//                           href={`${FILE_BASE_URL}/uploads/${selectedApp.firPath}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="doc-link"
//                         >
//                           View Document
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                   {selectedApp.paymentPath && (
//                     <div className="document-item">
//                       <div className="doc-icon">💰</div>
//                       <div className="doc-info">
//                         <strong>Payment Receipt</strong>
//                         <a
//                           href={docUrl(selectedApp.paymentPath)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="doc-link"
//                         >
//                           View Receipt
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                   {selectedApp.applicationPdfUrl && (
//                     <div className="document-item">
//                       <div className="doc-icon">📋</div>
//                       <div className="doc-info">
//                         <strong>Application Form</strong>
//                         <a
//                           href={docUrl(selectedApp.applicationPdfUrl)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="doc-link"
//                         >
//                           Download PDF
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="action-section">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => {
//                     if (!selectedApp) return
//                     if (selectedApp.userType === 'student') {
//                       generateStudentPdf(selectedApp)
//                     } else {
//                       generateStaffPdf(selectedApp)
//                     }
//                   }}
//                 >
//                   📥 Download Application PDF
//                 </button>
//               </div>

//               {selectedApp.status === 'pending' && (
//                 <div className="decision-section">
//                   {!action ? (
//                     <div className="action-buttons">
//                       <button
//                         className="btn btn-success"
//                         onClick={() => setAction('approve')}
//                       >
//                         ✅ Approve Application
//                       </button>
//                       <button
//                         className="btn btn-danger"
//                         onClick={() => setAction('reject')}
//                       >
//                         ❌ Reject Application
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="action-form">
//                       <h4>{action === 'approve' ? 'Approve Application' : 'Reject Application'}</h4>
//                       <div className="form-group">
//                         <label>
//                           {action === 'approve' ? 'Approval Notes' : 'Reason for Rejection *'}
//                         </label>
//                         <textarea
//                           value={notes}
//                           onChange={(e) => setNotes(e.target.value)}
//                           placeholder={
//                             action === 'reject' 
//                               ? 'Please provide a detailed reason for rejection...'
//                               : 'Add any notes or comments (optional)...'
//                           }
//                           rows="3"
//                           required={action === 'reject'}
//                         />
//                       </div>
//                       <div className="button-group">
//                         <button
//                           className={action === 'approve' ? 'btn btn-success' : 'btn btn-danger'}
//                           onClick={action === 'approve' ? handleApprove : handleReject}
//                         >
//                           {action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
//                         </button>
//                         <button
//                           className="btn btn-secondary"
//                           onClick={() => {
//                             setAction(null)
//                             setNotes('')
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../services/api'
import { generateStudentPDF, generateFacultyStaffPDF } from '../services/pdfGenerator'
import './Admin.css'

const FILE_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:5000' 
  : window.location.origin

function docUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${FILE_BASE_URL}/uploads/${path}`
}

const formatDate = (value) => {
  if (!value) return ''
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString('en-IN')
  } catch {
    return value
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState(null)
  const [action, setAction] = useState(null)
  const [notes, setNotes] = useState('')
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [addAdminUsername, setAddAdminUsername] = useState('')
  const [addAdminEmail, setAddAdminEmail] = useState('')
  const [addAdminPassword, setAddAdminPassword] = useState('')
  const [addAdminError, setAddAdminError] = useState('')
  const [addAdminLoading, setAddAdminLoading] = useState(false)
  const [addAdminSuccess, setAddAdminSuccess] = useState('')

  const [admins, setAdmins] = useState([])
  const [currentAdmin, setCurrentAdmin] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin-login')
      return
    }

    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      const [appRes, statsRes, adminsRes] = await Promise.all([
        adminAPI.getApplications(),
        adminAPI.getDashboardStats(),
        adminAPI.getAllAdmins()
      ])
      
      setApplications(appRes.applications || appRes || [])
      setStats(statsRes.stats || statsRes || { 
        total: 0, 
        pending: 0, 
        approved: 0, 
        rejected: 0 
      })
      setAdmins(adminsRes.admins || [])

      // Get current admin from localStorage
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')
      setCurrentAdmin(adminUser)

    } catch (err) {
      console.error('Error fetching data:', err)
    }
    setLoading(false)
  }

  const handleApprove = async () => {
    try {
      // FIXED: Changed from adminAPI.approve() to adminAPI.updateStatus()
      await adminAPI.updateStatus(selectedApp.applicationId, 'approved', notes)
      setSelectedApp(null)
      setAction(null)
      setNotes('')
      fetchData()
      alert('Application approved successfully!')
    } catch (err) {
      alert('Error approving application: ' + err.message)
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    try {
      // FIXED: Changed from adminAPI.reject() to adminAPI.updateStatus()
      await adminAPI.updateStatus(selectedApp.applicationId, 'rejected', notes)
      setSelectedApp(null)
      setAction(null)
      setNotes('')
      fetchData()
      alert('Application rejected successfully!')
    } catch (err) {
      alert('Error rejecting application: ' + err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/')
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setAddAdminError('')
    setAddAdminSuccess('')
    setAddAdminLoading(true)
    try {
      await adminAPI.createAdmin(addAdminUsername.trim(), addAdminEmail.trim(), addAdminPassword)
      setAddAdminSuccess('Admin added successfully.')
      setAddAdminUsername('')
      setAddAdminEmail('')
      setAddAdminPassword('')
      fetchData() // Refresh list
      setTimeout(() => { 
        setShowAddAdmin(false); 
        setAddAdminSuccess(''); 
      }, 2000)
    } catch (err) {
      setAddAdminError(err.message || 'Failed to add admin')
    }
    setAddAdminLoading(false)
  }

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return

    try {
      await adminAPI.deleteAdmin(adminId)
      alert('Admin deleted successfully')
      fetchData()
    } catch (err) {
      alert(err.message || 'Failed to delete admin')
    }
  }

  const handleHardDelete = async (appId) => {
    if (!window.confirm('⚠ WARNING: This will permanently delete all data and files for this application. This action cannot be undone. Are you sure?')) return

    try {
      await adminAPI.hardDelete(appId)
      alert('Application and all associated files deleted permanently')
      setSelectedApp(null)
      fetchData()
    } catch (err) {
      alert(err.message || 'Failed to delete application')
    }
  }

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  if (loading) return (
    <div className="form-container">
      <div className="form-card">
        <div className="loading-spinner" style={{ 
          width: '40px', 
          height: '40px', 
          margin: '40px auto',
          border: '3px solid rgba(201, 162, 39, 0.3)',
          borderTopColor: '#c9a227'
        }}></div>
      </div>
    </div>
  )

  return (
    <div className="form-container admin-dashboard">
      <div className="form-card">
        {/* Admin Header */}
        <div className="admin-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p className="form-description">Manage all ID card applications from students, faculty, and staff</p>
          </div>
          <div className="admin-header-actions">
            <button 
              onClick={() => setShowAddAdmin(!showAddAdmin)} 
              className={`btn btn-secondary ${showAddAdmin ? 'active' : ''}`}
            >
              {showAddAdmin ? '✕ Hide Add Admin' : '➕ Add new admin'}
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Add Admin Form */}
        {showAddAdmin && (
          <div className="info-box admin-form" style={{ marginBottom: '30px' }}>
            <div className="admin-mgmt-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
              <div>
                <h3>Add New Admin Account</h3>
                {addAdminError && <div className="error-message">{addAdminError}</div>}
                {addAdminSuccess && <div className="success-message">{addAdminSuccess}</div>}
                <form onSubmit={handleAddAdmin}>
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      value={addAdminUsername}
                      onChange={(e) => setAddAdminUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={addAdminEmail}
                      onChange={(e) => setAddAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={addAdminPassword}
                      onChange={(e) => setAddAdminPassword(e.target.value)}
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>
                  <div className="button-group" style={{ marginTop: '20px' }}>
                    <button type="submit" disabled={addAdminLoading} className="btn btn-primary">
                      {addAdminLoading ? 'Adding...' : 'Add Admin'}
                    </button>
                  </div>
                </form>
              </div>

              <div>
                <h3>Manage Existing Admins</h3>
                <div className="admin-list" style={{ marginTop: '15px' }}>
                  {admins.length === 0 ? (
                    <p>No other admins found</p>
                  ) : (
                    <table style={{ width: '100%', fontSize: '14px' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Username</th>
                          <th style={{ textAlign: 'left' }}>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map(admin => (
                          <tr key={admin._id}>
                            <td>{admin.username}</td>
                            <td>{admin.email}</td>
                            <td style={{ textAlign: 'center' }}>
                              {admin.username !== currentAdmin?.username ? (
                                <button
                                  onClick={() => handleDeleteAdmin(admin._id)}
                                  style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}
                                >
                                  Delete
                                </button>
                              ) : (
                                <span style={{ color: '#718096', fontSize: '12px' }}>(You)</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-number">{stats.total || 0}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-number">{stats.pending || 0}</div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-number">{stats.approved || 0}</div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-number">{stats.rejected || 0}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-title">
            <h3>Applications ({applications.length})</h3>
            <small>Showing {filter === 'all' ? 'all' : filter} applications</small>
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({applications.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({applications.filter(a => a.status === 'pending').length})
            </button>
            <button
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({applications.filter(a => a.status === 'approved').length})
            </button>
            <button
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({applications.filter(a => a.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="applications-table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: '#718096', fontSize: '14px' }}>
                      {applications.length === 0 ? 'No applications found in database' : 'No applications match the selected filter'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app._id || app.applicationId}>
                    <td>
                      <strong>{app.applicationId || 'N/A'}</strong>
                    </td>
                    <td>
                      <div className="applicant-name">
                        {app.userType === 'student' ? app.name : (app.staffName || app.name || 'N/A')}
                      </div>
                    </td>
                    <td>{app.email || 'N/A'}</td>
                    <td>
                      <span className={`type-badge type-${app.userType}`}>
                        {app.userType || 'unknown'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${app.status}`}>
                        {app.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => {
                          setSelectedApp(app)
                          setAction(null)
                        }}
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Application Details</h3>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="app-details-section">
                <h4>Basic Information</h4>
                <div className="form-grid three-cols">
                  <div className="form-group">
                    <label>Application ID</label>
                    <div className="detail-value">{selectedApp.applicationId || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <label>User Type</label>
                    <div className="detail-value">
                      <span className={`type-badge type-${selectedApp.userType}`}>
                        {selectedApp.userType || 'unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <div className="detail-value">
                      <span className={`status-badge status-${selectedApp.status}`}>
                        {selectedApp.status || 'pending'}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <div className="detail-value">{selectedApp.email || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <div className="detail-value">{selectedApp.phone || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <label>Submitted On</label>
                    <div className="detail-value">
                      {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString('en-IN') : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="app-details-section">
                <h4>
                  {selectedApp.userType === 'student' ? 'Student Details' : 'Staff Details'}
                </h4>
                <div className="form-grid three-cols">
                  {selectedApp.userType === 'student' ? (
                    <>
                      <div className="form-group">
                        <label>Name</label>
                        <div className="detail-value">{selectedApp.name || 'N/A'}</div>
                      </div>
                      <div className="form-group">
                        <label>Roll No.</label>
                        <div className="detail-value">{selectedApp.rollNo || 'N/A'}</div>
                      </div>
                      <div className="form-group">
                        <label>Branch</label>
                        <div className="detail-value">{selectedApp.branch || 'N/A'}</div>
                      </div>
                      <div className="form-group">
                        <label>Parent's Name</label>
                        <div className="detail-value">{selectedApp.fatherName || 'N/A'}</div>
                      </div>
                      <div className="form-group">
                        <label>No. of Issued Books</label>
                        <div className="detail-value">{selectedApp.issuedBooks || '0'}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Name</label>
                        <div className="detail-value">{selectedApp.staffName || selectedApp.name || 'N/A'}</div>
                      </div>
                      <div className="form-group">
                        <label>Staff No.</label>
                        <div className="detail-value">{selectedApp.staffNo || 'N/A'}</div>
                      </div>
                      <div className="form-group">
                        <label>Designation</label>
                        <div className="detail-value">{selectedApp.designation || 'N/A'}</div>
                      </div>
                      <div className="form-group">
                        <label>Title</label>
                        <div className="detail-value">{selectedApp.title || 'N/A'}</div>
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <div className="detail-value">{selectedApp.department || 'N/A'}</div>
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label>Blood Group</label>
                    <div className="detail-value">{selectedApp.bloodGroup || 'Not specified'}</div>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <div className="detail-value">{formatDate(selectedApp.dob)}</div>
                  </div>
                  <div className="form-group">
                    <label>Request Category</label>
                    <div className="detail-value">{selectedApp.requestCategory || 'N/A'}</div>
                  </div>
                  <div className="form-group full-width">
                    <label>Reason / Details</label>
                    <div className="detail-value">{selectedApp.reasonDetails || 'No details provided'}</div>
                  </div>
                  {selectedApp.status === 'rejected' && (
                    <div className="form-group full-width">
                      <label style={{ color: '#e53e3e' }}>Rejection Reason</label>
                      <div className="detail-value" style={{ borderColor: '#feb2b2', backgroundColor: '#fff5f5' }}>
                        {selectedApp.rejectionReason || 'No reason specified'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="app-details-section">
                <h4>Uploaded Documents</h4>
                <div className="documents-grid">
                  {selectedApp.photoPath && (
                    <div className="document-item">
                      <div className="doc-icon">📷</div>
                      <div className="doc-info">
                        <strong>Photograph</strong>
                        <a
                          href={docUrl(selectedApp.photoPath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doc-link"
                        >
                          View Image
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedApp.firPath && (
                    <div className="document-item">
                      <div className="doc-icon">📄</div>
                      <div className="doc-info">
                        <strong>FIR Copy</strong>
                        <a
                          href={`${FILE_BASE_URL}/uploads/${selectedApp.firPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doc-link"
                        >
                          View Document
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedApp.paymentPath && (
                    <div className="document-item">
                      <div className="doc-icon">💰</div>
                      <div className="doc-info">
                        <strong>Payment Receipt</strong>
                        <a
                          href={docUrl(selectedApp.paymentPath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doc-link"
                        >
                          View Receipt
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedApp.applicationPdfUrl && (
                    <div className="document-item">
                      <div className="doc-icon">📋</div>
                      <div className="doc-info">
                        <strong>Application Form</strong>
                        <a
                          href={docUrl(selectedApp.applicationPdfUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doc-link"
                        >
                          Download PDF
                        </a>
                      </div>
                    </div>
                  )}
                  {!selectedApp.photoPath && !selectedApp.firPath && !selectedApp.paymentPath && !selectedApp.applicationPdfUrl && (
                    <div style={{ color: '#718096', textAlign: 'center', width: '100%', padding: '20px' }}>
                      No documents uploaded
                    </div>
                  )}
                </div>
              </div>

              <div className="action-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    if (!selectedApp) return
                    if (selectedApp.userType === 'student') {
                      await generateStudentPDF(selectedApp)
                    } else {
                      await generateFacultyStaffPDF(selectedApp)
                    }
                  }}
                >
                  📥 Download Application PDF
                </button>

                <button
                  className="btn btn-danger"
                  style={{ backgroundColor: '#fed7d7', color: '#822727', border: '1px solid #feb2b2' }}
                  onClick={() => handleHardDelete(selectedApp.applicationId)}
                >
                  🗑 Permanent Delete
                </button>
              </div>

              {selectedApp.status === 'pending' && (
                <div className="decision-section">
                  {!action ? (
                    <div className="action-buttons">
                      <button
                        className="btn btn-success"
                        onClick={() => setAction('approve')}
                      >
                        ✅ Approve Application
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => setAction('reject')}
                      >
                        ❌ Reject Application
                      </button>
                    </div>
                  ) : (
                    <div className="action-form">
                      <h4>{action === 'approve' ? 'Approve Application' : 'Reject Application'}</h4>
                      <div className="form-group">
                        <label>
                          {action === 'approve' ? 'Approval Notes' : 'Reason for Rejection *'}
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={
                            action === 'reject' 
                              ? 'Please provide a detailed reason for rejection...'
                              : 'Add any notes or comments (optional)...'
                          }
                          rows="3"
                          required={action === 'reject'}
                        />
                      </div>
                      <div className="button-group">
                        <button
                          className={action === 'approve' ? 'btn btn-success' : 'btn btn-danger'}
                          onClick={action === 'approve' ? handleApprove : handleReject}
                        >
                          {action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setAction(null)
                            setNotes('')
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}