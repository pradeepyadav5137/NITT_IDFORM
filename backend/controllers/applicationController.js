// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import Application from '../models/Application.js';
// import Admin from '../models/Admin.js';
// import { uploadToFirebase, isFirebaseEnabled } from '../config/firebase.js';
// import { sendMail } from '../config/nodemailer.js';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const uploadsDir = path.join(__dirname, '../uploads');

// const generateAppId = (userType) => {
//   const prefix = userType === 'student' ? 'STU' : userType === 'faculty' ? 'FAC' : 'STF';
//   const year = new Date().getFullYear();
//   const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
//   return `NITT-${prefix}-${year}-${random}`;
// };

// async function saveFile(fieldName, file, applicationId) {
//   const ext = path.extname(file.originalname) || (file.mimetype?.includes('png') ? '.png' : '.jpg');
//   const basePath = `applications/${applicationId}/${fieldName}${ext}`;

//   if (isFirebaseEnabled()) {
//     const url = await uploadToFirebase(file.buffer, basePath, file.mimetype || 'application/octet-stream');
//     return url;
//   }

//   if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
//   const dir = path.join(uploadsDir, applicationId);
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//   const filename = `${fieldName}-${Date.now()}${ext}`;
//   const filepath = path.join(dir, filename);
//   fs.writeFileSync(filepath, file.buffer);
//   return `${applicationId}/${filename}`;
// }

// // Submit application (with optional photo, fir, payment, applicationPdf files)
// export const submitApplication = async (req, res) => {
//   try {
//     const body = req.body || {};
//     const userType = body.userType;

//     if (!userType || !['student', 'faculty', 'staff'].includes(userType)) {
//       return res.status(400).json({ message: 'Invalid user type' });
//     }

//     const applicationId = generateAppId(userType);

//     const applicationData = {
//       applicationId,
//       userType,
//       email: body.email,
//       rollNo: body.rollNo,
//       name: body.name,
//       fatherName: body.fatherName,
//       programme: body.programme,
//       branch: body.branch,
//       batch: body.batch,
//       issuedBooks: body.issuedBooks,
//       staffNo: body.staffNo,
//       staffName: body.staffName,
//       title: body.title,
//       designation: body.designation,
//       department: body.department,
//       joiningDate: body.joiningDate || undefined,
//       phone: body.phone,
//       dob: body.dob || undefined,
//       gender: body.gender,
//       bloodGroup: body.bloodGroup,
//       addressLine1: body.addressLine1,
//       addressLine2: body.addressLine2,
//       district: body.district,
//       state: body.state,
//       pinCode: body.pinCode,
//       requestCategory: body.requestCategory,
//       reasonDetails: body.reasonDetails,
//       photoPath: null,
//       firPath: null,
//       paymentPath: null,
//       applicationPdfUrl: null
//     };

//     const files = req.files || {};
//     if (files.photo?.[0]) {
//       applicationData.photoPath = await saveFile('photo', files.photo[0], applicationId);
//     }
//     if (files.fir?.[0]) {
//       applicationData.firPath = await saveFile('fir', files.fir[0], applicationId);
//     }
//     if (files.payment?.[0]) {
//       applicationData.paymentPath = await saveFile('payment', files.payment[0], applicationId);
//     }
//     if (files.applicationPdf?.[0]) {
//       applicationData.applicationPdfUrl = await saveFile('applicationPdf', files.applicationPdf[0], applicationId);
//     }

//     const application = new Application(applicationData);
//     await application.save();

//     // Send email to user
//     try {
//       await sendMail(
//         application.email,
//         'NITT ID Card Application Submitted',
//         `Your application for a duplicate ID card has been submitted successfully.\n\nApplication ID: ${applicationId}\n\nYou can track your application status on our portal using this ID.`,
//         `<p>Your application for a duplicate ID card has been submitted successfully.</p>
//          <p><strong>Application ID: ${applicationId}</strong></p>
//          <p>You can track your application status on our portal using this ID.</p>`
//       );
//     } catch (mailError) {
//       console.error('Error sending confirmation email to user:', mailError);
//     }

//     // Notify all admins
//     try {
//       const admins = await Admin.find({ email: { $exists: true } });
//       const adminEmails = admins.map(admin => admin.email).filter(Boolean);

//       if (adminEmails.length > 0) {
//         await sendMail(
//           adminEmails,
//           'New ID Card Application Received',
//           `A new duplicate ID card application has been received.\n\nApplication ID: ${applicationId}\nApplicant: ${application.name || application.staffName}\nType: ${userType}`,
//           `<p>A new duplicate ID card application has been received.</p>
//            <ul>
//              <li><strong>Application ID:</strong> ${applicationId}</li>
//              <li><strong>Applicant:</strong> ${application.name || application.staffName}</li>
//              <li><strong>User Type:</strong> ${userType}</li>
//            </ul>
//            <p><a href="${process.env.ADMIN_URL || 'http://localhost:5173/admin/dashboard'}">Login to Admin Panel</a> to review.</p>`
//         );
//       }
//     } catch (adminMailError) {
//       console.error('Error notifying admins via email:', adminMailError);
//     }

//     res.json({
//       success: true,
//       message: 'Application submitted successfully',
//       applicationId,
//       application
//     });
//   } catch (error) {
//     console.error('Submit error:', error);
//     res.status(500).json({ message: 'Error submitting application' });
//   }
// };

// export const getApplicationStatus = async (req, res) => {
//   try {
//     const application = await Application.findOne({
//       applicationId: req.params.applicationId
//     });

//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     res.json({
//       success: true,
//       application
//     });
//   } catch (error) {
//     console.error('Status error:', error);
//     res.status(500).json({ message: 'Error fetching application' });
//   }
// };

// export const getAllApplications = async (req, res) => {
//   try {
//     const applications = await Application.find({}).sort({ createdAt: -1 });
//     res.json({
//       success: true,
//       applications
//     });
//   } catch (error) {
//     console.error('Fetch error:', error);
//     res.status(500).json({ message: 'Error fetching applications' });
//   }
// };

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Application from '../models/Application.js';
import Admin from '../models/Admin.js';
import { uploadToFirebase, isFirebaseEnabled } from '../config/firebase.js';
import { sendMail } from '../config/nodemailer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

const generateAppId = (userType) => {
  const prefix = userType === 'student' ? 'STU' : userType === 'faculty' ? 'FAC' : 'STF';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
  return `NITT-${prefix}-${year}-${random}`;
};

async function saveFile(fieldName, file, applicationId) {
  const ext = path.extname(file.originalname) || (file.mimetype?.includes('png') ? '.png' : '.jpg');
  const basePath = `applications/${applicationId}/${fieldName}${ext}`;

  // 1. Try Firebase first (if enabled)
  if (isFirebaseEnabled()) {
    try {
      // Attempt upload
      const url = await uploadToFirebase(file.buffer, basePath, file.mimetype || 'application/octet-stream');
      return url; 
    } catch (error) {
      console.error(`Firebase upload failed for ${fieldName}, switching to local storage. Error: ${error.message}`);
      // Proceed to local storage code below...
    }
  }

  // 2. Fallback to Local Storage
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const dir = path.join(uploadsDir, applicationId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = `${fieldName}-${Date.now()}${ext}`;
    const filepath = path.join(dir, filename);

    fs.writeFileSync(filepath, file.buffer);
    console.log(`Saved file locally: ${filepath}`);

    // Return relative path for local storage
    return `${applicationId}/${filename}`;
  } catch (err) {
    console.error(`Failed to save file locally: ${err.message}`);
    throw new Error('File upload failed');
  }
}

// Submit application (with optional photo, fir, payment, applicationPdf files)
export const submitApplication = async (req, res) => {
  try {
    const body = req.body || {};
    const userType = body.userType;

    if (!userType || !['student', 'faculty', 'staff'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const applicationId = generateAppId(userType);

    const applicationData = {
      applicationId,
      userType,
      email: body.email,
      rollNo: body.rollNo,
      name: body.name,
      fatherName: body.fatherName,
      programme: body.programme,
      branch: body.branch,
      batch: body.batch,
      issuedBooks: body.issuedBooks,
      staffNo: body.staffNo,
      staffName: body.staffName,
      title: body.title,
      designation: body.designation,
      department: body.department,
      joiningDate: body.joiningDate || undefined,
      phone: body.phone,
      dob: body.dob || undefined,
      gender: body.gender,
      bloodGroup: body.bloodGroup,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      district: body.district,
      state: body.state,
      pinCode: body.pinCode,
      requestCategory: body.requestCategory,
      reasonDetails: body.reasonDetails,
      photoPath: null,
      firPath: null,
      paymentPath: null,
      applicationPdfUrl: null
    };

    const files = req.files || {};
    
    // Process files sequentially to avoid race conditions
    if (files.photo?.[0]) {
      applicationData.photoPath = await saveFile('photo', files.photo[0], applicationId);
    }
    if (files.fir?.[0]) {
      applicationData.firPath = await saveFile('fir', files.fir[0], applicationId);
    }
    if (files.payment?.[0]) {
      applicationData.paymentPath = await saveFile('payment', files.payment[0], applicationId);
    }
    if (files.applicationPdf?.[0]) {
      applicationData.applicationPdfUrl = await saveFile('applicationPdf', files.applicationPdf[0], applicationId);
    }

    const application = new Application(applicationData);
    await application.save();

    // --- FIX: Send Response IMMEDIATELY ---
    // We send the response here so the frontend doesn't timeout waiting for emails.
    res.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId,
      application
    });

    // --- Background Tasks (Emails) ---
    // These run after the response is sent.
    
    // 1. Notify User
    sendMail(
      application.email,
      'NITT ID Card Application Submitted',
      `Your application for a duplicate ID card has been submitted successfully.\n\nApplication ID: ${applicationId}\n\nYou can track your application status on our portal using this ID.`,
      `<p>Your application for a duplicate ID card has been submitted successfully.</p>
       <p><strong>Application ID: ${applicationId}</strong></p>
       <p>You can track your application status on our portal using this ID.</p>`
    ).catch(err => console.error('Background Email Error (User):', err));

    // 2. Notify Admins
    try {
      const admins = await Admin.find({ email: { $exists: true } });
      const adminEmails = admins.map(admin => admin.email).filter(Boolean);

      if (adminEmails.length > 0) {
        sendMail(
          adminEmails,
          'New ID Card Application Received',
          `A new duplicate ID card application has been received.\n\nApplication ID: ${applicationId}\nApplicant: ${application.name || application.staffName}\nType: ${userType}`,
          `<p>A new duplicate ID card application has been received.</p>
           <ul>
             <li><strong>Application ID:</strong> ${applicationId}</li>
             <li><strong>Applicant:</strong> ${application.name || application.staffName}</li>
             <li><strong>User Type:</strong> ${userType}</li>
           </ul>
           <p><a href="${process.env.ADMIN_URL || 'http://localhost:5173/admin/dashboard'}">Login to Admin Panel</a> to review.</p>`
        ).catch(err => console.error('Background Email Error (Admins):', err));
      }
    } catch (adminFetchError) {
      console.error('Error fetching admins for notification:', adminFetchError);
    }

  } catch (error) {
    console.error('Submit error:', error);
    // Only send error response if we haven't sent a success response yet
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error submitting application' });
    }
  }
};

export const getApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findOne({
      applicationId: req.params.applicationId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ message: 'Error fetching application' });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};