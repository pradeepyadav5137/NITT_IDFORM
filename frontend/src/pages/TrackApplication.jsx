
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationAPI } from '../services/api'
import { generateStudentPDF, generateFacultyStaffPDF } from '../services/pdfGenerator'
import './Success.css'

export default function TrackApplication() {
  const { applicationId } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await applicationAPI.getById(applicationId)
        if (res.success) {
          setApplication(res.application)
        } else {
          setError('Application not found')
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch application status')
      } finally {
        setLoading(false)
      }
    }

    if (applicationId) {
      fetchStatus()
    }
  }, [applicationId])

  const handleDownloadPDF = async () => {
    if (!application) return

    if (application.userType === 'student') {
      await generateStudentPDF(application)
    } else {
      await generateFacultyStaffPDF(application)
    }
  }

  if (loading) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="loading-spinner" style={{ margin: '40px auto' }}></div>
          <p>Fetching application details...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="error-icon" style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h2>Application Not Found</h2>
          <p>{error || 'The application ID you entered is invalid.'}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#48bb78';
      case 'rejected': return '#e53e3e';
      default: return '#ecc94b';
    }
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <h2>Application Status</h2>

        <div className="app-id-box" style={{ marginBottom: '30px' }}>
          <div className="label">Application ID</div>
          <div className="app-id">{application.applicationId}</div>
        </div>

        <div className="status-timeline" style={{ textAlign: 'left', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#48bb78',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px'
            }}>✓</div>
            <div>
              <div style={{ fontWeight: '600' }}>Application Submitted</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>{new Date(application.createdAt).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: getStatusColor(application.status),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px'
            }}>
              {application.status === 'pending' ? '⏳' : application.status === 'approved' ? '✓' : '✗'}
            </div>
            <div>
              <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                Current Status: {application.status}
              </div>
              {application.status === 'pending' && (
                <div style={{ fontSize: '13px', color: '#718096' }}>Your application is currently under review by the administration.</div>
              )}
              {application.status === 'approved' && (
                <div style={{ fontSize: '13px', color: '#718096' }}>Your application has been approved. You can collect your ID card from the library.</div>
              )}
              {application.status === 'rejected' && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '600', color: '#c53030', fontSize: '14px' }}>Rejection Reason:</div>
                  <div style={{ fontSize: '14px', color: '#822727' }}>{application.rejectionReason || 'No specific reason provided.'}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '30px', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-primary"
          >
            📥 Re-download Application PDF
          </button>

          <Link to="/" className="btn btn-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
