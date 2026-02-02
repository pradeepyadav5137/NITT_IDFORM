import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Admin from '../models/Admin.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { deleteFromFirebase, isFirebaseEnabled } from '../config/firebase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

// ===== GET ALL APPLICATIONS =====
export const getAllApplications = async (req, res) => {
  try {
    const { status, userType, search } = req.query;

    // Build query
    let query = { isDeleted: false };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (userType && userType !== 'all') {
      query.userType = userType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      applications,
      count: applications.length
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// ===== GET DASHBOARD STATS =====
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Application.countDocuments({ isDeleted: false });
    const pending = await Application.countDocuments({ status: 'pending', isDeleted: false });
    const approved = await Application.countDocuments({ status: 'approved', isDeleted: false });
    const rejected = await Application.countDocuments({ status: 'rejected', isDeleted: false });
    const student = await Application.countDocuments({ userType: 'student', isDeleted: false });
    const faculty = await Application.countDocuments({ 
      userType: { $in: ['faculty', 'staff'] }, 
      isDeleted: false 
    });

    res.json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
        student,
        faculty
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// ===== GET SINGLE APPLICATION =====
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
};

// ===== UPDATE APPLICATION STATUS =====
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status, updatedAt: new Date() };
    if (status === 'rejected' && reason) {
      updateData.rejectionReason = reason;
    }

    const application = await Application.findOneAndUpdate(
      { $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { applicationId: id }] },
      updateData,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      application
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// ===== SOFT DELETE APPLICATION =====
export const softDeleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndUpdate(
      id,
      { 
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Soft delete error:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
};

// ===== HARD DELETE APPLICATION =====
// export const hardDeleteApplication = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the application first to get file paths
//     const application = await Application.findOne({
//       $or: [{ _id: id }, { applicationId: id }]
//     });

//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     // List of file paths to delete
//     const filePaths = [
//       application.photoPath,
//       application.firPath,
//       application.paymentPath,
//       application.applicationPdfUrl
//     ].filter(Boolean);

//     // Delete from storage
//     for (const filePath of filePaths) {
//       try {
//         if (isFirebaseEnabled()) {
//           await deleteFromFirebase(filePath);
//         } else {
//           // Local storage
//           const fullPath = path.join(uploadsDir, filePath);
//           if (fs.existsSync(fullPath)) {
//             fs.unlinkSync(fullPath);
//           }
//         }
//       } catch (err) {
//         console.warn(`Failed to delete file ${filePath}:`, err.message);
//       }
//     }

//     // If local storage, also try to delete the directory
//     if (!isFirebaseEnabled() && application.applicationId) {
//       const dirPath = path.join(uploadsDir, application.applicationId);
//       if (fs.existsSync(dirPath)) {
//         try {
//           fs.rmSync(dirPath, { recursive: true, force: true });
//         } catch (err) {
//           console.warn(`Failed to delete directory ${dirPath}:`, err.message);
//         }
//       }
//     }

//     // Delete from database
//     await Application.findByIdAndDelete(application._id);

//     res.json({
//       success: true,
//       message: 'Application and all associated files permanently deleted'
//     });
//   } catch (error) {
//     console.error('Hard delete error:', error);
//     res.status(500).json({ message: 'Failed to permanently delete application' });
//   }
// };

export const hardDeleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // --- FIX: Prevent CastError by checking ID type ---
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If it looks like a MongoID, check both fields
      query = { $or: [{ _id: id }, { applicationId: id }] };
    } else {
      // If it's a custom ID (e.g. NITT-STF...), ONLY check applicationId
      query = { applicationId: id };
    }
    // --------------------------------------------------

    // Find the application first to get file paths
    const application = await Application.findOne(query);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // List of file paths to delete
    const filePaths = [
      application.photoPath,
      application.firPath,
      application.paymentPath,
      application.applicationPdfUrl
    ].filter(Boolean);

    // Delete from storage
    for (const filePath of filePaths) {
      try {
        if (isFirebaseEnabled()) {
          await deleteFromFirebase(filePath);
        } else {
          // Local storage
          const fullPath = path.join(uploadsDir, filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      } catch (err) {
        console.warn(`Failed to delete file ${filePath}:`, err.message);
      }
    }

    // If local storage, also try to delete the directory
    if (!isFirebaseEnabled() && application.applicationId) {
      const dirPath = path.join(uploadsDir, application.applicationId);
      if (fs.existsSync(dirPath)) {
        try {
          fs.rmSync(dirPath, { recursive: true, force: true });
        } catch (err) {
          console.warn(`Failed to delete directory ${dirPath}:`, err.message);
        }
      }
    }

    // Delete from database using the resolved document ID
    await Application.findByIdAndDelete(application._id);

    res.json({
      success: true,
      message: 'Application and all associated files permanently deleted'
    });
  } catch (error) {
    console.error('Hard delete error:', error);
    res.status(500).json({ message: 'Failed to permanently delete application' });
  }
};


// ===== CREATE NEW ADMIN =====
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this username or email already exists' });
    }

    // Create new admin
    const admin = new Admin({
      username,
      email,
      password, // Will be hashed by mongoose pre-save hook
      role: role || 'admin'
    });

    await admin.save();

    res.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Failed to create admin' });
  }
};

// ===== GET ALL ADMINS =====
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      admins,
      count: admins.length
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
};

// ===== DELETE ADMIN =====
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.admin.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
};