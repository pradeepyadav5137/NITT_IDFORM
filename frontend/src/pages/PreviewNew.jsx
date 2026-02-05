import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { applicationAPI } from '../services/api'
import { generateStudentPDF } from '../services/pdfGenerator'
import StepIndicator from '../components/StepIndicator'

const STUDENT_STEPS = ['Verify Email', 'Student Form', 'Upload Documents', 'Preview & Submit'];

const PreviewNew = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(false)
  const userType = localStorage.getItem('userType')
  const isStudent = userType === 'student'
  
  useEffect(() => {
    // Check if we have uploaded files in local storage but missing in state (reload scenario)
    const uploadedFiles = localStorage.getItem('uploadedFiles')
    if (uploadedFiles && (!location.state || !location.state.files)) {
      alert("Session state lost. Please re-upload documents to proceed.")
      navigate('/upload-documents')
      return
    }

    const storedFormData = localStorage.getItem('studentFormData') || localStorage.getItem('formData')
    
    if (!storedFormData) {
      navigate('/student-form')
      return
    }
    
    try {
      const parsedData = JSON.parse(storedFormData)
      setFormData(parsedData)
    } catch (err) {
      console.error('Error loading form data:', err)
    }
  }, [navigate, location.state])
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB')
    } catch {
      return dateString
    }
  }
  
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const files = location.state?.files || {}
      const userType = localStorage.getItem('userType') || 'student'
      
      const form = new FormData()
      form.append('userType', userType)

      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          form.append(key, formData[key])
        }
      })

      // Map permanentAddress to address if it exists
      if (formData.permanentAddress && !formData.address) {
        form.append('address', formData.permanentAddress)
      }
      
      // Append files
      if (files.photo) form.append('photo', files.photo)
      if (files.fir) form.append('fir', files.fir)
      if (files.payment) form.append('payment', files.payment)

      // Generate application PDF
      const pdfDoc = await generateStudentPDF(formData, false);
      const pdfBlob = pdfDoc.output('blob');
      form.append('applicationPdf', pdfBlob, `application_${formData.rollNo}.pdf`);

      const response = await applicationAPI.submit(form)
      const applicationId = response.applicationId || response.id

      // Clear localStorage data after successful submission
      localStorage.removeItem('formData')
      localStorage.removeItem('uploadedFiles')

      navigate(`/success/${applicationId}`, { state: { application: response.application } })
    } catch (err) {
      console.error('Submission error:', err)
      alert(err.message || 'Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const generatePDF = () => {
    if (!formData) return
    
    const doc = new jsPDF('p', 'mm', 'a4')
    
    // Title
    doc.setFontSize(16)
    doc.text('NITT Duplicate ID Application', 105, 20, { align: 'center' })
    
    let y = 40
    doc.setFontSize(11)
    
    // All fields from form
    const fields = [
      ['Name', formData.name],
      ['Roll Number', formData.rollNo],
      ['Email', formData.email],
      ["Father's Name", formData.fatherName],
      ["Mother's Name", formData.motherName || 'Not provided'],
      ['Date of Birth', formatDate(formData.dob)],
      ['Gender', formData.gender],
      ['Blood Group', formData.bloodGroup || 'Not provided'],
      ['Phone', formData.phone],
      ['Parent Mobile', formData.parentMobile],
      ['Permanent Address', formData.permanentAddress],
      ['Programme', formData.programme],
      ['Branch', formData.branch],
      ['Batch', formData.batch],
      ['Semester', formData.semester],
      ['Hostel', formData.hostel || 'Not provided'],
      ['Room No', formData.roomNo || 'Not provided'],
      ['No. of Issued Books', formData.issuedBooks || '0'],
      ['Request Category', formData.requestCategory],
      ['Reason Details', formData.reasonDetails || 'Not provided'],
      ['FIR Number', formData.firNumber || 'Not provided'],
      ['FIR Date', formatDate(formData.firDate)],
      ['Police Station', formData.policeStation || 'Not provided'],
    ]
    
    fields.forEach(([label, value]) => {
      if (value) {
        doc.text(`${label}: ${value}`, 20, y)
        y += 8
      }
    })
    
    doc.save(`NITT_Duplicate_ID_${formData.rollNo}.pdf`)
  }
  
  const handleEdit = () => {
    navigate('/student-form')
  }
  
  if (!formData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Loading Preview...</h2>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{
      background: '#f0f4f8',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {isStudent && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
             <StepIndicator
                current={4}
                total={STUDENT_STEPS.length}
                labels={STUDENT_STEPS}
             />
        </div>
      )}

      <div style={{
        background: 'white',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#1a365d', 
          marginBottom: '10px',
          fontSize: '28px'
        }}>
          Application Preview
        </h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Review your application. All fields are read-only.
        </p>
        
        {/* Personal Information */}
        <h3 style={{ 
          color: '#1a365d', 
          marginTop: '30px',
          marginBottom: '20px',
          fontSize: '18px',
          borderBottom: '2px solid #c9a227',
          paddingBottom: '10px'
        }}>
          Personal Information
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Full Name
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.name || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Roll Number
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.rollNo || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Email
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.email || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Father's Name
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.fatherName || 'Not provided'}
            </div>
          </div>
          
         
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Date of Birth
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formatDate(formData.dob) || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Gender
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.gender || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Blood Group
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.bloodGroup || 'Not provided'}
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <h3 style={{ 
          color: '#1a365d', 
          marginTop: '30px',
          marginBottom: '20px',
          fontSize: '18px',
          borderBottom: '2px solid #c9a227',
          paddingBottom: '10px'
        }}>
          Contact Information
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Phone Number
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.phone || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Parent/Guardian Mobile
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.parentMobile || 'Not provided'}
            </div>
          </div>
          
          <div style={{ gridColumn: '1 / -1', marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Permanent Address
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc',
              minHeight: '80px'
            }}>
              {formData.permanentAddress || 'Not provided'}
            </div>
          </div>
        </div>
        
        {/* Academic Information */}
        <h3 style={{ 
          color: '#1a365d', 
          marginTop: '30px',
          marginBottom: '20px',
          fontSize: '18px',
          borderBottom: '2px solid #c9a227',
          paddingBottom: '10px'
        }}>
          Academic Information
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Programme
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.programme || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Branch/Department
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.branch || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Batch/Year
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.batch || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Current Semester
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.semester ? `${formData.semester}th Semester` : 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Hostel Name
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.hostel || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Room Number
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.roomNo || 'Not provided'}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{
              fontSize: '14px',
              color: '#4a5568',
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              No. of Issued Books
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.issuedBooks || '0'}
            </div>
          </div>
        </div>
        
        {/* Request Details */}
        <h3 style={{ 
          color: '#1a365d', 
          marginTop: '30px',
          marginBottom: '20px',
          fontSize: '18px',
          borderBottom: '2px solid #c9a227',
          paddingBottom: '10px'
        }}>
          Request Details
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Reason for Duplicate ID
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.requestCategory || 'Not provided'}
            </div>
          </div>
          
          <div style={{ gridColumn: '1 / -1', marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Additional Details
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc',
              minHeight: '80px'
            }}>
              {formData.reasonDetails || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              FIR Number
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.firNumber || 'Not provided'}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              FIR Date
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formatDate(formData.firDate) || 'Not provided'}
            </div>
          </div>
          
          <div style={{ gridColumn: '1 / -1', marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Police Station Name
            </div>
            <div style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              background: '#f8fafc'
            }}>
              {formData.policeStation || 'Not provided'}
            </div>
          </div>
        </div>
        
        {/* Declaration */}
        <div style={{ 
          background: '#fffaf0',
          border: '1px solid #f6e05e',
          borderRadius: '6px',
          padding: '20px',
          marginTop: '30px'
        }}>
          <h4 style={{ 
            color: '#744210', 
            marginBottom: '10px',
            fontSize: '16px'
          }}>
            Declaration
          </h4>
          <p style={{ 
            fontSize: '13px', 
            color: '#744210', 
            lineHeight: '1.6'
          }}>
            I hereby declare that the information provided above is true and correct to the best of my knowledge. 
            I understand that providing false information may result in rejection of my application and 
            disciplinary action as per institute rules.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div style={{ 
          display: 'flex',
          gap: '15px',
          marginTop: '40px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleEdit}
            style={{
              padding: '14px 28px',
              background: '#f7fafc',
              color: '#2d3748',
              border: '1px solid #cbd5e0',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              flex: '1',
              minWidth: '140px'
            }}
          >
            Edit Application
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '14px 28px',
              background: '#c9a227',
              color: '#1a365d',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              flex: '1',
              minWidth: '140px'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreviewNew