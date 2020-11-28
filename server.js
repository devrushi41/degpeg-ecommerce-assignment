import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import routes from "./routes";

dotenv.config();

const app = express();
connectDB();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
