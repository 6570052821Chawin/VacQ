const express = require('express');

const {getAppointments, getAppointment, addAppointment, updateAppointment, deleteAppointment} = require('../controllers/appointments');

//สามารถส่งต่อ parameter ได้
const router = express.Router({mergeParams: true});

//ตรวจสอบ role ด้วย
const {protect, authorize} = require('../middleware/auth');

//เรียก function protect และ ทำงาน method getAppointments ที่เราเรียกมาข้างบน
//จะเอา protect ออกไหม
router.route('/')
    .get(protect, getAppointments)
    .post(protect, authorize('admin', 'user'), addAppointment);
router.route('/:id')
    .get(protect, getAppointment)
    .put(protect, authorize('admin', 'user'), updateAppointment)
    .delete(protect, authorize('admin', 'user'), deleteAppointment);

module.exports = router;