const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const AcademyController = require('../controllers/AcademyController')


router.post('/academy/',AcademyController.createAcademy)
router.post('/academies/',AcademyController.getAllAcademy)
router.put('/academy/:academyId',AcademyController.updateAcademy)
router.get('/academy/:academyId',AcademyController.getAcademy)
router.delete('/academy/:academyId',AcademyController.deleteAcademy)
module.exports = router