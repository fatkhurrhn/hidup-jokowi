// server.js - API Server lokal
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Route: Ambil gambar dari folder
app.get('/api/images/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    
    console.log(`📂 Fetching folder: ${folder}`);
    
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();
    
    console.log(`✅ Found ${result.resources.length} items`);
    
    res.json({
      success: true,
      resources: result.resources
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Cloudinary API Server is running!');
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server ready at http://localhost:${PORT}`);
  console.log(`📁 Test folder: http://localhost:${PORT}/api/images/Ketua\n`);
});