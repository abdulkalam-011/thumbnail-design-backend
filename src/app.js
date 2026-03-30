// package imports
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { fileURLToPath } from "url";

// route imports
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { workRoutes } from "./routes/workRoutes.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/Response.js";

const app = express();


// cors middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// to accept json data
app.use(express.json({ limit: "16kb" }));

// to accept data from url
app.use(express.urlencoded({ extended: true }));

// serves static files
app.use(express.static("public"));

// cookie parser middleware to perform cors operations on browser on cookies
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/works", workRoutes);

app.get("/", (req, res) => {
  res.status(200).send(`
           <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thumbnail Design API</title>
            <style>
                :root {
                    --primary: #6366f1;
                    --accent: #a855f7;
                    --bg: #0f172a;
                }
                body { 
                    font-family: 'Inter', system-ui, sans-serif; 
                    background-color: var(--bg);
                    background-image: radial-gradient(circle at top right, #1e293b, var(--bg));
                    color: #f1f5f9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    overflow: hidden;
                }
                .card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 3rem;
                    border-radius: 24px;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    max-width: 500px;
                    width: 90%;
                }
                h1 { margin-bottom: 0.5rem; font-size: 1.8rem; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .status { font-size: 0.9rem; color: #94a3b8; margin-bottom: 2rem; }
                .status-dot { height: 8px; width: 8px; background-color: #22c55e; border-radius: 50%; display: inline-block; margin-right: 5px; box-shadow: 0 0 10px #22c55e; }
                
                .btn {
                    display: inline-block;
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    color: white;
                    padding: 12px 32px;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
                }
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.5);
                }
                .hint { margin-top: 1.5rem; font-size: 0.8rem; color: #64748b; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Thumbnail Design Backend</h1>
                <div class="status">
                    <span class="status-dot"></span> System Operational
                </div>
                
                <p>This is a headless API service. To interact with the endpoints, please refer to the technical documentation.</p>
                
                <a href="https://github.com/abdulkalam-011/thumbnail-design-backend.git" target="_blank" class="btn">
                    View API Documentation
                </a>

            </div>
        </body>
        </html>
        `);
});

app.get("/api/v1/health", (req, res) => {
  res.send("Hello, World!");
});

app.post("/api/v1/test", async(req,res)=>{
    const {name} = req.body;
    if(!name){
        throw new ApiError(400,"name is required")
    }

    res.json(new ApiResponse(200,`test is done by ${name}`,"test succesfull"))
})

export default app;
