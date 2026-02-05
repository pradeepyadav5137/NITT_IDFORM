import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../services/api' // CHANGED: from authAPI to adminAPI
import './Admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotStep, setForgotStep] = useState('email')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // CHANGED: from authAPI.adminLogin to adminAPI.login
      const response = await adminAPI.login(username, password)
      // localStorage.setItem('adminToken', response.token)
      localStorage.setItem('adminUser', JSON.stringify(response.admin))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    }
    setLoading(false)
  }

  const handleForgotSendOtp = async (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)
    try {
      // NOTE: You'll need to implement this function in your api.js
      // For now, we'll comment it out or handle differently
      // await adminAPI.adminForgotPassword(forgotEmail.trim())
      
      // Temporary: Show OTP step directly for testing
      setForgotStep('otp')
      alert('For demo: OTP would be sent to ' + forgotEmail)
    } catch (err) {
      setForgotError(err.message || 'Failed to send OTP. Please check the email.')
    }
    setForgotLoading(false)
  }

  const handleForgotReset = async (e) => {
    e.preventDefault()
    setForgotError('')
    if (!newPassword || newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters')
      return
    }
    setForgotLoading(true)
    try {
      // NOTE: You'll need to implement this function in your api.js
      // await adminAPI.adminResetPassword(forgotEmail.trim(), forgotOtp.trim(), newPassword)
      
      // Temporary: Simulate success
      setShowForgot(false)
      setForgotStep('email')
      setForgotEmail('')
      setForgotOtp('')
      setNewPassword('')
      alert('Password reset successful! Please login with your new password.')
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password. Please try again.')
    }
    setForgotLoading(false)
  }

  return (
    <div className="form-container admin-login">
      <div className="form-card" style={{ maxWidth: '450px' }}>
        {/* Header with NITT Logo */}
        <div className="login-header">
          <h2>Admin Login</h2>
          <p className="form-description">
            Access the ID Card Application Management System
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              disabled={loading}
            />
            <small>Contact existing admin if you don't have an account</small>
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          
          <div className="button-group" style={{ marginTop: '25px' }}>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <>
                  <span className="loading-spinner" style={{ marginRight: '8px' }}></span>
                  Logging in...
                </>
              ) : '🔐 Login to Dashboard'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setShowForgot(!showForgot)} 
              className="btn btn-secondary"
            >
              {showForgot ? '↶ Back to Login' : '🔓 Forgot Password?'}
            </button>
          </div>
        </form>

        {showForgot && (
          <div className="forgot-password-form" style={{ marginTop: '30px' }}>
            <h3>Reset Password</h3>
            <p className="form-description">
              Enter your admin email to receive OTP for password reset
            </p>
            
            {forgotError && <div className="error-message">{forgotError}</div>}
            
            {forgotStep === 'email' ? (
              <form onSubmit={handleForgotSendOtp}>
                <div className="form-group">
                  <label>Admin Email *</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    disabled={forgotLoading}
                  />
                  <small>Must be a registered admin email</small>
                </div>
                <div className="button-group" style={{ marginTop: '20px' }}>
                  <button type="submit" disabled={forgotLoading} className="btn btn-primary">
                    {forgotLoading ? (
                      <>
                        <span className="loading-spinner" style={{ marginRight: '8px' }}></span>
                        Sending OTP...
                      </>
                    ) : '📧 Send OTP to Email'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotReset}>
                <div className="form-group">
                  <label>OTP Sent to {forgotEmail}</label>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                    disabled={forgotLoading}
                    className="otp-input"
                  />
                  <small>Check your email for the verification code</small>
                </div>
                <div className="form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                    disabled={forgotLoading}
                  />
                  <small>Choose a strong, memorable password</small>
                </div>
                <div className="button-group" style={{ marginTop: '20px' }}>
                  <button type="submit" disabled={forgotLoading} className="btn btn-primary">
                    {forgotLoading ? (
                      <>
                        <span className="loading-spinner" style={{ marginRight: '8px' }}></span>
                        Resetting Password...
                      </>
                    ) : '🔄 Reset Password'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setForgotStep('email')} 
                    className="btn btn-secondary"
                  >
                    ↩ Try Different Email
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="login-footer">
          <p className="security-note">
            <strong>🔒 Security Notice:</strong> This system is for authorized personnel only.
            Unauthorized access is prohibited.
          </p>
          <p className="help-text">
            Need help? Contact system administrator at <strong>admin@nitt.edu</strong>
          </p>
        </div>
      </div>
    </div>
  )
}