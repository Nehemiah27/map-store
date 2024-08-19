import express from "express";
import {
  setDefaultUser,
  createUserController,
  usersSearch,
  changePassword,
} from "../controllers/usersController.js";
import { userSchema } from "../validations/createUserValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { userSearchSchema } from "../validations/userSearchValidation.js";
import { passwordChangeSchema } from "../validations/passwordChangeValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/set-default-user:
 *   post:
 *     summary: Create a Default User
 *     tags: [Users]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Default User set successfully
 *       422:
 *         description: Default User Configured already
 *       500:
 *         description: Server error
 */
router.post("/set-default-user", setDefaultUser);

/**
 * @swagger
 * /api/users/create-user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Seerapu"
 *               lastName:
 *                 type: string
 *                 example: "Nehemiah"
 *               email:
 *                 type: string
 *                 example: "seerapu.nehemiah@testing.com"
 *               password:
 *                 type: string
 *                 example: "Qwerty@1234"
 *     responses:
 *       200:
 *         description: User Created Successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Duplicate User found to create
 *       500:
 *         description: Server error
 */
router.post("/create-user", validateRequest(userSchema), createUserController);

/**
 * @swagger
 * /api/users/search-users:
 *   post:
 *     summary: Search Users
 *     tags: [Users]
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
 *                 example: "Seerapu"
 *     responses:
 *       200:
 *         description: Users Data fetched succesfully
 *       401:
 *         description: Token Expired & Unauthorized
 */
router.post(
  "/search-users",
  authMiddleware,
  validateRequest(userSearchSchema),
  usersSearch
);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change Password for User
 *     tags: [Users]
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
 *                 example: "sasxd-saslxx-sxlpqds-dsscc"
 *               oldPassword:
 *                 type: string
 *                 example: "Qwerty@1234"
 *               newPassword:
 *                 type: string
 *                 example: "Qwerty@12345"
 *     responses:
 *       200:
 *         description: Password Changed successfully
 *       401:
 *         description: Token Expired & Unauthorized
 */
router.post(
  "/change-password",
  authMiddleware,
  validateRequest(passwordChangeSchema),
  changePassword
);

export default router;
