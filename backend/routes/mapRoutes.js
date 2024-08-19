import express from "express";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { mapCaptureSchema } from "../validations/mapCaptureValidation.js";
import { mapHomeSchema } from "../validations/mapHomeValidation.js";
import { mapDeleteSchema } from "../validations/mapDeleteValidation.js";
import { cuboidSchema } from "../validations/cuboidValidation.js";
import {
  mapCapture,
  mapDelete,
  mapEdit,
  mapHome,
  topThreeViews,
  cuboidView,
  editNotes,
  mapSearch,
  fullMap,
  mapTitleCheck,
} from "../controllers/mapController.js";
import { mapEditSchema } from "../validations/mapEditValidation.js";
import { editNotesSchema } from "../validations/editNotesValidation.js";
import { mapSearchSchema } from "../validations/mapSearchValidation.js";
import { fullMapSchema } from "../validations/fullMapValidation.js";
import { mapTitleSchema } from "../validations/mapTitleValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/map/capture-check:
 *   post:
 *     summary: Map View Capture Title Check
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5a7567ad"
 *               title:
 *                 type: string
 *                 example: "Military Area"
 *     responses:
 *       200:
 *         description: Title checked Succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 *       409:
 *         description: Duplicate Map Title is given
 *       500:
 *         description: Server is allocated at the moment
 */
router.post(
  "/capture-check",
  authMiddleware,
  validateRequest(mapTitleSchema),
  mapTitleCheck
);

/**
 * @swagger
 * /api/map/capture:
 *   post:
 *     summary: Map View Capture with Annotation
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5a7567ad"
 *               lat:
 *                 type: string
 *                 example: "23.29012"
 *               lng:
 *                 type: string
 *                 example: "-99.8912189"
 *               mLat:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               mLng:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               zoom:
 *                 type: string
 *                 example: "4"
 *               title:
 *                 type: string
 *                 example: "Military Area"
 *               notes:
 *                 type: string
 *                 example: "This area is fully secured and special access is needed"
 *               mapImage:
 *                 type: string
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
 *     responses:
 *       200:
 *         description: Map Captured Succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 *       409:
 *         description: Duplicate Map Title is given
 *       500:
 *         description: Server is allocated at the moment
 */
router.post(
  "/capture",
  authMiddleware,
  validateRequest(mapCaptureSchema),
  mapCapture
);

/**
 * @swagger
 * /api/map/delete:
 *   post:
 *     summary: Delete a Map
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mapID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5a7567ad"
 *     responses:
 *       200:
 *         description: Map Deleted Succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 *       500:
 *         description: Server is allocated at the moment
 */
router.post(
  "/delete",
  authMiddleware,
  validateRequest(mapDeleteSchema),
  mapDelete
);

/**
 * @swagger
 * /api/map/edit:
 *   post:
 *     summary: Edit Saved Map
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5a7567ad"
 *               mapID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5ax567ad"
 *               lat:
 *                 type: string
 *                 example: "23.29012"
 *               lng:
 *                 type: string
 *                 example: "-99.8912189"
 *               mLat:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               mLng:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               zoom:
 *                 type: string
 *                 example: "4"
 *               title:
 *                 type: string
 *                 example: "Military Area"
 *               notes:
 *                 type: string
 *                 example: "This area is fully secured and special access is needed"
 *               mapImage:
 *                 type: string
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
 *     responses:
 *       200:
 *         description: Map Edited Succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 *       404:
 *         description: User not found with the email given
 *       409:
 *         description: Duplicate Map Title is given
 *       500:
 *         description: Server is allocated at the moment
 */
router.post("/edit", authMiddleware, validateRequest(mapEditSchema), mapEdit);

/**
 * @swagger
 * /api/map/home-view:
 *   post:
 *     summary: View the frequent Home page Map
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5a7567adx"
 *     responses:
 *       200:
 *         description: Map Fetched Succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 */
router.post(
  "/home-view",
  authMiddleware,
  validateRequest(mapHomeSchema),
  mapHome
);

/**
 * @swagger
 * /api/map/cuboid:
 *   post:
 *     summary: Cuboid API for particular map
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mapID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5a7567adx"
 *     responses:
 *       200:
 *         description: Map Fetched Succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 */
router.post(
  "/cuboid",
  authMiddleware,
  validateRequest(cuboidSchema),
  cuboidView
);

/**
 * @swagger
 * /api/map/full-map:
 *   post:
 *     summary: API for full info of particular map
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mapID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5a7567adx"
 *     responses:
 *       200:
 *         description: Map Fetched Succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 */
router.post(
  "/full-map",
  authMiddleware,
  validateRequest(fullMapSchema),
  fullMap
);

/**
 * @swagger
 * /api/map/edit-notes:
 *   post:
 *     summary: Edit Notes
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mapID:
 *                 type: string
 *                 example: "99eb2ddf-808c-4bb2-949f-af2b5ax567ad"
 *               title:
 *                 type: string
 *                 example: "Military Area"
 *               notes:
 *                 type: string
 *                 example: "This area is fully secured and special access is needed"
 *     responses:
 *       200:
 *         description: Map Notes Edited Succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 *       409:
 *         description: Duplicate Map Title is given
 *       500:
 *         description: Server is allocated at the moment
 */
router.post(
  "/edit-notes",
  authMiddleware,
  validateRequest(editNotesSchema),
  editNotes
);

/**
 * @swagger
 * /api/map/top-three:
 *   post:
 *     summary: Top three most frequently captured regions
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top three maps fetched succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 */
router.post("/top-three", authMiddleware, topThreeViews);

/**
 * @swagger
 * /api/map/search-maps:
 *   post:
 *     summary: Search Saved maps
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPage:
 *                 type: number
 *                 example: 1
 *               totalRecordsPerPage:
 *                 type: number
 *                 example: 10
 *               searchText:
 *                 type: string
 *                 example: "Sydney"
 *     responses:
 *       200:
 *         description: Maps Data fetched succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 */
router.post(
  "/search-maps",
  authMiddleware,
  validateRequest(mapSearchSchema),
  mapSearch
);

export default router;
