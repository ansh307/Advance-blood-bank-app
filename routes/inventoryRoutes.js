const express = require("express");

const {
  createInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalController,
  getOrgnaisationController,
  getOrgnaisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
  downloadInventoryReportController,
} = require("../controllers/inventoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//routes
// ADD INVENTORY || POST
router.post("/create-inventory", authMiddleware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getInventoryController);
//GET RECENT BLOOD RECORDS
router.get(
  "/get-recent-inventory",
  authMiddleware,
  getRecentInventoryController
);

//GET HOSPITAL BLOOD RECORDS
router.post(
  "/get-inventory-hospital",
  authMiddleware,
  getInventoryHospitalController
);

//GET DONAR RECORDS
router.get("/get-donars", authMiddleware, getDonarsController);

//GET HOSPITAL RECORDS
router.get("/get-hospitals", authMiddleware, getHospitalController);

//GET orgnaisation RECORDS
router.get("/get-orgnaisation", authMiddleware, getOrgnaisationController);

//GET orgnaisation RECORDS
router.get(
  "/get-orgnaisation-for-hospital",
  authMiddleware,
  getOrgnaisationForHospitalController
);

//GET BLOOD RECORD OF 3
router.post("/download-report", downloadInventoryReportController); 


module.exports = router;