import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import helmet from "helmet";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan";
import { register } from "./controllers/authController.js";
import { createPost } from "./controllers/postsController.js";
import authRoutes from "./routes/authRoutes.js";
 import usersRoutes from "./routes/usersRoutes.js";
 import postsRoutes from "./routes/postsRoutes.js";
import { verifyToken } from "./middleware/auth.js";
// import User from "./models/Usermodel.js";
//import Post from "./models/Postmodel.js";
// import { users, posts } from "./data/index.js";




 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
dotenv.config();


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extennded: true}))
app.use(bodyParser.urlencoded({ limit: "30mb", extennded: true}))
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});
const upload = multer({ storage})

// limits: { fileize: 25* 1024* 1021}
// });
 



app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);


 
//Routes
app.use("/auth", authRoutes);
 app.use("/users", usersRoutes);
 app.use("/posts", postsRoutes);



//MongoDB connection
const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running in ${PORT}`));
  })
  .catch((err) => console.log(err));