import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swaggerConfig.js";
import dotenv from "dotenv";
import {
  sendTokenController,
  receiveTokenController,
} from "./controllers/tokenController.js";

import { swapTokenController } from "./controllers/swapController.js";

import {
  generateWalletController,
  recoverWalletController,
  guardRecoveryController,
} from "./controllers/accountController.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post("/send-token", sendTokenController);
app.post("/receive-token", receiveTokenController);
app.post("/swap-token", swapTokenController);
app.post("/generate-wallet", generateWalletController);
app.post("/recover-wallet", recoverWalletController);
app.post("/guard-recovery", guardRecoveryController);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
