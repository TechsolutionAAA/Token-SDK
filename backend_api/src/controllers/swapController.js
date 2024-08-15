import { swapToken } from "../services/swapService.js";

/**
 * @swagger
 * /swap-token:
 *   post:
 *     summary: Swap ERC-20 tokens using Uniswap V2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromToken:
 *                 type: string
 *                 description: Address of the token to swap from
 *               toToken:
 *                 type: string
 *                 description: Address of the token to swap to
 *               amountIn:
 *                 type: string
 *                 description: Amount of fromToken to swap
 *               slippage:
 *                 type: number
 *                 description: Acceptable slippage percentage
 *               recipient:
 *                 type: string
 *                 description: Address to send the swapped tokens to
 *     responses:
 *       200:
 *         description: Token swap successful
 *       500:
 *         description: Internal server error
 */
export const swapTokenController = async (req, res) => {
  const { fromToken, toToken, amountIn, slippage, recipient } = req.body;
  try {
    const result = await swapToken(
      fromToken,
      toToken,
      amountIn,
      slippage,
      recipient
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
