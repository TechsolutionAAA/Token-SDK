import {
  generateWallet,
  recoverWallet,
  guardRecovery,
} from "../services/accountService.js";

/**
 * @swagger
 * /generate-wallet:
 *   post:
 *     summary: Generate a new wallet with a passkey
 *     responses:
 *       200:
 *         description: Wallet generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                 privateKey:
 *                   type: string
 *                 mnemonic:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
export const generateWalletController = (req, res) => {
  try {
    const wallet = generateWallet();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /recover-wallet:
 *   post:
 *     summary: Recover a wallet from a mnemonic passphrase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mnemonic:
 *                 type: string
 *                 description: Mnemonic passphrase
 *     responses:
 *       200:
 *         description: Wallet recovered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                 privateKey:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
export const recoverWalletController = (req, res) => {
  const { mnemonic } = req.body;
  try {
    const wallet = recoverWallet(mnemonic);
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /guard-recovery:
 *   post:
 *     summary: Validate guard recovery using a secondary passkey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: Wallet address
 *               secondaryPasskey:
 *                 type: string
 *                 description: Secondary passkey for validation
 *     responses:
 *       200:
 *         description: Recovery guard validated successfully
 *       401:
 *         description: Invalid secondary passkey
 *       500:
 *         description: Internal server error
 */
export const guardRecoveryController = (req, res) => {
  const { address, secondaryPasskey } = req.body;
  try {
    const result = guardRecovery(address, secondaryPasskey);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
