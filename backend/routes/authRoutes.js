import express from "express";
import { loginUser, logoutUser } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { loginSchema } from "../validations/loginValidation.js";
import { logoutSchema } from "../validations/logoutValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login of the User
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "seerapu.nehemiah@testing.com"
 *               password:
 *                 type: string
 *                 example: "Qwerty@1234"
 *     responses:
 *       200:
 *         description: User Authenticated Successfully
 *       401:
 *         description: Incorrect password provided
 *       404:
 *         description: User not found with the email given
 *       412:
 *         description: User hasn't set his password yet
 *       500:
 *         description: Server is allocated at the moment
 */
router.post("/login", validateRequest(loginSchema), loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout of the User
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "seerapu.nehemiah@testing.com"
 *     responses:
 *       200:
 *         description: User Logged out successfully
 *       404:
 *         description: User not found with the email given
 *       500:
 *         description: Server is allocated at the moment
 */
router.post("/logout", validateRequest(logoutSchema), logoutUser);
export default router;
