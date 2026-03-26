import dotenv from "dotenv"
dotenv.config()
import Dbconnection from "./db/dbconnection.js"
import app from "./app.js"

Dbconnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });


