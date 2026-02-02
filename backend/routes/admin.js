// // import express from 'express';
// // import { verifyAdmin } from '../middleware/auth.js';
// // import {
// //   addAdmin,
// //   approveApplication,
// //   rejectApplication,
// //   getDashboardStats,
// // } from '../controllers/adminController.js';

// // const router = express.Router();

// // router.post('/add', verifyAdmin, addAdmin);

// // // Approve application
// // router.put('/approve/:applicationId', verifyAdmin, approveApplication);

// // // Reject application
// // router.put('/reject/:applicationId', verifyAdmin, rejectApplication);

// // // Get dashboard stats
// // router.get('/stats', verifyAdmin, getDashboardStats);

// // export default router;

// import express from 'express';
// import {
//   getAllApplications,
//   getDashboardStats,
//   getApplicationById,
//   updateApplicationStatus,
//   softDeleteApplication,
//   hardDeleteApplication,
//   createAdmin,
//   getAllAdmins,
//   deleteAdmin
// } from '../controllers/adminController.js';
// import { adminAuth } from '../middleware/adminAuth.js';

// const router = express.Router();

// // All admin routes require authentication
// router.use(adminAuth);

// // ===== APPLICATION ROUTES =====
// router.get('/applications', getAllApplications);
// router.get('/applications/:id', getApplicationById);
// router.patch('/applications/:id/status', updateApplicationStatus);
// router.delete('/applications/:id', (req, res) => {
//   const { hardDelete } = req.body;
//   if (hardDelete) {
//     return hardDeleteApplication(req, res);
//   }
//   return softDeleteApplication(req, res);
// });

// // ===== DASHBOARD ROUTES =====
// router.get('/dashboard/stats', getDashboardStats);

// // ===== ADMIN MANAGEMENT ROUTES =====
// router.post('/admins', createAdmin);
// router.get('/admins', getAllAdmins);
// router.delete('/admins/:id', deleteAdmin);

// export default router;

import express from 'express';
import {
  getAllApplications,
  getDashboardStats,
  getApplicationById,
  updateApplicationStatus,
  softDeleteApplication,
  hardDeleteApplication,
  createAdmin,
  getAllAdmins,
  deleteAdmin
} from '../controllers/adminController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// All admin routes require authentication
router.use(adminAuth);

// ===== APPLICATION ROUTES =====
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);
router.patch('/applications/:id/status', updateApplicationStatus);
router.delete('/applications/:id', (req, res) => {
  const { hardDelete } = req.body;
  if (hardDelete) {
    return hardDeleteApplication(req, res);
  }
  return softDeleteApplication(req, res);
});

// ===== DASHBOARD ROUTES =====
router.get('/dashboard/stats', getDashboardStats);

// ===== ADMIN MANAGEMENT ROUTES =====
router.post('/admins', createAdmin);
router.get('/admins', getAllAdmins);
router.delete('/admins/:id', deleteAdmin);

export default router;