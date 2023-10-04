import cors from "cors";
import morgan from "morgan";
import express from "express";
import * as dotenv from "dotenv";
import { ProxyManager } from "@Utilities/proxy-manager.utility";

const main = async () => {
  dotenv.config();

  const app = express();

  app.use(morgan("dev"));
  app.use(cors({ origin: "*" }));

  const proxy = new ProxyManager();

  proxy.start(app);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main();
