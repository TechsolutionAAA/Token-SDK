import { sendToken, receiveToken } from "../services/tokenService.js";

/**
 * @swagger
 * /send-token:
 *   post:
 *     summary: Send ERC-20 tokens to a specific address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient address
 *               amount:
 *                 type: string
 *                 description: Amount of tokens to send
 *               tokenAddress:
 *                 type: string
 *                 description: ERC-20 token contract address
 *     responses:
 *       200:
 *         description: Token sent successfully
 *       500:
 *         description: Internal server error
 */
export const sendTokenController = async (req, res) => {
  const { to, amount, tokenAddress } = req.body;
  try {
    const result = await sendToken(to, amount, tokenAddress);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /receive-token:
 *   post:
 *     summary: Retrieve the balance of ERC-20 tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenAddress:
 *                 type: string
 *                 description: ERC-20 token contract address
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *       500:
 *         description: Internal server error
 */
export const receiveTokenController = async (req, res) => {
  const { tokenAddress } = req.body;
  try {
    const result = await receiveToken(tokenAddress);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
