import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

// Conectar a base de datos
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.blue("Conexión exitosa a la BD"));
  } catch (error) {
    // console.log(error)
    console.log(colors.red.bold("Hubo un error al conectar a la BD"));
  }
}
connectDB();

// Instancia de express
const server = express();

// Leer datos de formularios
server.use(express.json());

const corsOption: CorsOptions = {
  origin: function (origine, callback) {
    console.log(origine);
    if (origine == process.env.URL_FRONTEND) {
      console.log("permitir");
      callback(null, true);
    } else {
      console.log("denegar");
      callback(new Error("Error de cors"), false);
    }
  },
};

server.use(cors(corsOption));
server.use(morgan("dev"));
server.use("/api/products", router);

// Docs
server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
