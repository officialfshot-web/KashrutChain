const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'KashrutChain API running', version: '1.0.0' });
});

// Scan endpoint — receives image, sends to OpenAI Vision
app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Read the uploaded image and convert to base64
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';

    // Build the data URI
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // Call OpenAI GPT-4o Vision
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an ingredient analysis assistant. Analyze product label images and extract structured data. Output ONLY valid JSON. If a field is missing or uncertain, use null. Flag known non-kosher or ambiguous ingredients (gelatin, lard, shellfish, carmine, wine, alcohol, enzymes, etc.). Note any kosher symbols visible for reference only — do NOT certify kosher status.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this product label image. Extract the product name, brand, kosher symbols with modifiers, full ingredient list, and classify as dairy/meat/pareve. Return ONLY this JSON structure:

{
  "product_name": "string or null",
  "brand": "string or null", 
  "barcode": "string or null",
  "kosher_symbols": [
    {
      "symbol_code": "string (e.g., OU, OK, STAR-K)",
      "modifier": "string or null (e.g., D, Pareve, Glatt, M)",
      "detected_text": "string",
      "confidence": "float 0.0-1.0"
    }
  ],
  "ingredients": [
    {
      "name": "string",
      "is_flagged": "boolean",
      "flag_reason": "string or null",
      "kosher_status": "safe | caution | forbidden | unknown"
    }
  ],
  "classification": {
    "dietary": "dairy | meat | pareve | unknown",
    "passover_status": "kosher_for_passover | not_kosher_for_passover | chametz | unknown",
    "confidence": "float 0.0-1.0"
  },
  "manufacturer": "string or null",
  "country_of_origin": "string or null",
  "notes": "string or null"
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUri,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2048,
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Parse the AI response
    const aiContent = openAiResponse.data.choices[0].message.content;
    let parsedResult;
    
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || 
                       aiContent.match(/```([\s\S]*?)```/) ||
                       [null, aiContent];
      parsedResult = JSON.parse(jsonMatch[1] || aiContent);
    } catch (e) {
      // Fallback: wrap raw response
      parsedResult = {
        raw_response: aiContent,
        parse_error: true,
        product_name: null,
        kosher_symbols: [],
        ingredients: [],
        classification: { dietary: 'unknown', confidence: 0 },
        notes: 'AI response could not be parsed to expected JSON format'
      };
    }

    // Extract detected symbols for reference only (NOT kosher certification)
    const hasSymbol = parsedResult.kosher_symbols && parsedResult.kosher_symbols.length > 0;
    const symbolCode = hasSymbol ? parsedResult.kosher_symbols[0].symbol_code : null;

    const result = {
      product: parsedResult.product_name || 'Unknown Product',
      brand: parsedResult.brand,
      barcode: parsedResult.barcode,
      ingredients: parsedResult.ingredients || [],
      detectedSymbols: parsedResult.kosher_symbols || [],
      classification: parsedResult.classification?.dietary || 'unknown',
      passover: parsedResult.classification?.passover_status || 'unknown',
      manufacturer: parsedResult.manufacturer,
      country: parsedResult.country_of_origin,
      notes: parsedResult.notes,
      disclaimer: 'This is an ingredient analysis tool only. It does NOT certify kosher status. Always verify with physical packaging and a qualified rabbi.'
    };

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    res.json(result);

  } catch (error) {
    console.error('Scan error:', error.response?.data || error.message);
    
    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Scan failed',
      details: error.response?.data?.error?.message || error.message
    });
  }
});


// Simple test without image (for debugging)
app.post('/api/test', async (req, res) => {
  res.json({
    status: 'API working',
    openai_key_configured: !!process.env.OPENAI_API_KEY,
    message: 'POST to /api/scan with an image file named "image"'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`KashrutChain server running on port ${PORT}`);
  console.log(`OpenAI key configured: ${!!process.env.OPENAI_API_KEY}`);
});
