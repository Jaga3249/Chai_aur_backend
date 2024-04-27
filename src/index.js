/*const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})();*/
import dotenv from "dotenv";
import { DbConnect } from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});
DbConnect()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`server is running at Port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed !!!", err);
  });
