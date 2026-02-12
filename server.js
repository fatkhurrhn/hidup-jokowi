// server.js - Cloudinary API Server
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// ============== MIDDLEWARE ==============
app.use(cors());
app.use(express.json());

// ============== CLOUDINARY CONFIG ==============
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ============== HELPER FUNCTIONS ==============
const withTags = (searchInstance) => searchInstance.with_field('tags');

// ============== ROUTES ==============

/**
 * 📁 Ambil semua media dari folder tertentu
 * GET /api/images/:folder
 */
app.get('/api/images/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    
    console.log(`📂 Fetching folder: ${folder}`);
    
    const result = await withTags(
      cloudinary.search
        .expression(`folder:${folder}`)
        .sort_by('created_at', 'desc')
        .max_results(50)
    ).execute();
    
    console.log(`✅ Found ${result.resources.length} items`);
    
    res.json({ success: true, resources: result.resources });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 📚 Ambil SEMUA media (dari semua folder)
 * GET /api/all
 */
app.get('/api/all', async (req, res) => {
  try {
    console.log('📚 Fetching ALL media...');
    
    const result = await withTags(
      cloudinary.search
        .expression('resource_type:image OR resource_type:video')
        .sort_by('created_at', 'desc')
        .max_results(100)
    ).execute();
    
    console.log(`✅ Found ${result.resources.length} items total`);
    
    res.json({ success: true, resources: result.resources });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 📸 Ambil FOTO SAJA dari folder tertentu
 * GET /api/images/:folder/photos
 */
app.get('/api/images/:folder/photos', async (req, res) => {
  try {
    const { folder } = req.params;
    
    console.log(`📸 Fetching photos from folder: ${folder}`);
    
    const result = await withTags(
      cloudinary.search
        .expression(`folder:${folder} AND resource_type:image`)
        .sort_by('created_at', 'desc')
        .max_results(50)
    ).execute();
    
    console.log(`✅ Found ${result.resources.length} photos`);
    
    res.json({ success: true, resources: result.resources });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🎬 Ambil VIDEO SAJA dari folder tertentu
 * GET /api/images/:folder/videos
 */
app.get('/api/images/:folder/videos', async (req, res) => {
  try {
    const { folder } = req.params;
    
    console.log(`🎬 Fetching videos from folder: ${folder}`);
    
    const result = await withTags(
      cloudinary.search
        .expression(`folder:${folder} AND resource_type:video`)
        .sort_by('created_at', 'desc')
        .max_results(50)
    ).execute();
    
    console.log(`✅ Found ${result.resources.length} videos`);
    
    res.json({ success: true, resources: result.resources });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🏷️ Ambil SEMUA tag yang ada di folder (FOTO SAJA)
 * GET /api/images/:folder/tags
 */
app.get('/api/images/:folder/tags', async (req, res) => {
  try {
    const { folder } = req.params;
    
    console.log(`🏷️ Fetching tags from folder: ${folder}`);
    
    const result = await cloudinary.api
      .tags_by_expression(`folder:${folder} AND resource_type:image`);
    
    console.log(`✅ Found ${result.tags.length} tags`);
    
    res.json({ success: true, tags: result.tags });
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🏷️ Ambil foto berdasarkan folder + tag tertentu
 * GET /api/images/:folder/photos/tag/:tag
 */
app.get('/api/images/:folder/photos/tag/:tag', async (req, res) => {
  try {
    const { folder, tag } = req.params;
    
    console.log(`🏷️ Fetching #${tag} photos from folder: ${folder}`);
    
    const result = await withTags(
      cloudinary.search
        .expression(`folder:${folder} AND resource_type:image AND tags:${tag}`)
        .sort_by('created_at', 'desc')
        .max_results(50)
    ).execute();
    
    console.log(`✅ Found ${result.resources.length} photos with tag #${tag}`);
    
    res.json({ success: true, resources: result.resources });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🏷️ [VIDEO] Ambil video berdasarkan folder + tag tertentu
 * GET /api/images/:folder/videos/tag/:tag
 */
app.get('/api/images/:folder/videos/tag/:tag', async (req, res) => {
  try {
    const { folder, tag } = req.params;
    
    console.log(`🏷️ Fetching #${tag} videos from folder: ${folder}`);
    
    const result = await withTags(
      cloudinary.search
        .expression(`folder:${folder} AND resource_type:video AND tags:${tag}`)
        .sort_by('created_at', 'desc')
        .max_results(50)
    ).execute();
    
    console.log(`✅ Found ${result.resources.length} videos with tag #${tag}`);
    
    res.json({ success: true, resources: result.resources });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🏷️ [VIDEO] Ambil SEMUA tag video yang ada di folder
 * GET /api/images/:folder/videos/tags
 */
app.get('/api/images/:folder/videos/tags', async (req, res) => {
  try {
    const { folder } = req.params;
    
    console.log(`🏷️ Fetching video tags from folder: ${folder}`);
    
    const result = await cloudinary.api
      .tags_by_expression(`folder:${folder} AND resource_type:video`);
    
    console.log(`✅ Found ${result.tags.length} video tags`);
    
    res.json({ success: true, tags: result.tags });
  } catch (error) {
    console.error('❌ Error fetching video tags:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============== TEST ROUTE ==============
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>🚀 Cloudinary API Server</h1>
      <p>✅ Server is running on port ${PORT}</p>
      <h3>Available Routes:</h3>
      <ul>
        <li><strong>GET</strong> /api/images/:folder</li>
        <li><strong>GET</strong> /api/all</li>
        <li><strong>GET</strong> /api/images/:folder/photos</li>
        <li><strong>GET</strong> /api/images/:folder/videos</li>
        <li><strong>GET</strong> /api/images/:folder/tags</li>
        <li><strong>GET</strong> /api/images/:folder/photos/tag/:tag</li>
        <li><strong>GET</strong> /api/images/:folder/videos/tags</li>
        <li><strong>GET</strong> /api/images/:folder/videos/tag/:tag</li>
      </ul>
    </div>
  `);
});

// ============== START SERVER ==============
app.listen(PORT, () => {
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`   🚀 CLOUDINARY API SERVER READY`);
  console.log(`═══════════════════════════════════════════`);
  console.log(`   📍 PORT       : http://localhost:${PORT}`);
  console.log(`   📁 Test folder: http://localhost:${PORT}/api/images/Ketua`);
  console.log(`   📚 Test all   : http://localhost:${PORT}/api/all`);
  console.log(`   ⚡ React proxy : http://localhost:5173`);
  console.log(`═══════════════════════════════════════════\n`);
});