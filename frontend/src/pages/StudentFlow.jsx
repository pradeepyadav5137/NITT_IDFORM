import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api' 
import './StudentFlow.css'

export default function StudentFlow() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Verification state
  const [rollNo, setRollNo] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationSubstep, setVerificationSubstep] = useState('rollno') // 'rollno' or 'otp'
  const [email, setEmail] = useState('') 

  // 1. NUCLEAR CLEAR ON LOAD
  // Every time you open the verification page, we strictly wipe all previous session data.
  // This prevents the "Roll No 66" ghost data from lingering.
  useEffect(() => {
    console.log("Initializing Student Flow: Wiping previous session data...");
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 2. DOUBLE SAFETY CLEAR
    // Ensure no token exists before we start a new request
    localStorage.removeItem('token');
    localStorage.removeItem('rollNo'); 
    localStorage.removeItem('email');
    localStorage.removeItem('studentFormData');

    try {
      // Send OTP Request
      await authAPI.sendOTP({ rollNo: rollNo.trim(), userType: 'student' })
      
      // Calculate the email locally so we can show it to the user
      const generatedEmail = `${rollNo.trim().toLowerCase()}@nitt.edu`;
      setEmail(generatedEmail);
      
      // Move to OTP step
      setVerificationSubstep('otp')
    } catch (err) {
      console.error("Send OTP Error:", err);
      setError(err.message || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Verify OTP with backend
      const res = await authAPI.verifyEmail({
        email: email,
        otp: otp.trim(),
        userType: 'student'
      })
      
      // --- CRITICAL FIX: SAVE NEW SESSION DATA ---
      console.log("Verification Successful. Saving new session data for:", rollNo);
      
      // 1. Save Token
      localStorage.setItem('token', res.token);
      localStorage.setItem('userType', 'student');
      
      // 2. Save Identity (This is what StudentForm.jsx reads)
      localStorage.setItem('rollNo', rollNo.trim().toLowerCase()); 
      localStorage.setItem('email', res.email);
      
      // 3. WIPE any old form data specifically
      // This ensures the next page loads a blank form, not the previous user's form
      localStorage.removeItem('studentFormData');
      // -------------------------------------------

      // Redirect to the separate form page
      navigate('/student-form');

    } catch (err) {
      console.error("Verify OTP Error:", err);
      setError(err.message || 'Invalid OTP');
    }
    setLoading(false)
  }

  return (
    <div className="form-container student-flow">
      <div className="form-card">
        <h2>Student – Verification</h2>
        <p className="form-description">Enter your roll number. OTP will be sent to your institute webmail.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        {verificationSubstep === 'rollno' ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 205124040"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>OTP sent to {email}</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              onClick={() => { 
                setVerificationSubstep('rollno'); 
                setOtp(''); 
                setError(''); 
                setRollNo(''); // Clear roll no input to force re-entry
              }} 
              className="btn btn-secondary"
              style={{marginTop: '10px'}}
            >
              Change roll number
            </button>
          </form>
        )}
      </div>
    </div>
  )
}