import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { api } from "./routes";
import { 
  generalLimiter, 
  authLimiter, 
  sendEmailLimiter, 
  securityHeaders, 
  compressionMiddleware,
  corsOptions 
} from "./middleware/security";
import { errorHandler, notFound } from "./middleware/error-handler";

dotenv.config();

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(compressionMiddleware);

// CORS
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', generalLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/send', sendEmailLimiter);

// API routes
app.use("/api", api);

// Health check endpoint
app.get("/api/v1/health", (_req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
});


