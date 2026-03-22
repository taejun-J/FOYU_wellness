// import express from 'express';
// import { customMissionController } from '../controllers/missionController.js';
// const router = express.Router();

// router.post('/mission', customMissionController);

// export default router;
import express from 'express';
import {
  customMissionController,
  getMissionHistory,
} from '../controllers/missionController.js';
const router = express.Router();

router.post('/mission', customMissionController);
router.get('/mission', getMissionHistory);

export default router;
