const axios = require("axios");
const ProductContent = require("../models/ProductContent");

// Helper to strip markdown formatting and clean JSON strings
const cleanJsonString = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    // Matches ```json <content> ``` or ``` <content> ```
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  }
  return cleaned;
};

// @desc    Generate product content using OpenRouter
// @route   POST /api/products/generate
// @access  Private
const generateProductContent = async (req, res) => {
  try {
    const { productName, productCategory, brandName, keyFeatures, targetAudience } = req.body;

    if (!productName || !productCategory || !brandName || !keyFeatures || !targetAudience) {
      return res.status(400).json({ success: false, message: "Please provide all product details" });
    }

    const systemPrompt = `You are an expert product marketing copywriter and SEO specialist. 
Your task is to generate high-quality product content based on the product details provided by the user.

You MUST respond with a single, valid JSON object ONLY. Do not write any explanations, preamble, or notes.
The JSON object must have exactly the following structure:
{
  "description": "A comprehensive product description (strictly 150-200 words) highlighting features, benefits, and emotional appeal.",
  "shortDescription": "A concise product description (strictly 2-3 lines/sentences) suitable for quick reading.",
  "keySellingPoints": [
    "Key selling point 1",
    "Key selling point 2",
    "Key selling point 3",
    "Key selling point 4",
    "Key selling point 5"
  ],
  "seoKeywords": [
    "keyword 1",
    "keyword 2",
    "keyword 3",
    "keyword 4",
    "keyword 5",
    "keyword 6",
    "keyword 7"
  ],
  "tagline": "A catchy, memorable, and creative product tagline."
}

Ensure the content is engaging, professional, and tailored to the target audience. Do not include markdown code block syntax (like \`\`\`json) in your raw response. Just return the JSON object raw.`;

    const userPrompt = `Generate product marketing content for this product:
Product Name: ${productName}
Product Category: ${productCategory}
Brand Name: ${brandName}
Key Features: ${keyFeatures}
Target Audience: ${targetAudience}`;

    // Make request to OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "AI Product Content Generator",
        },
        timeout: 25000 // 25s timeout for AI response
      }
    );

    const rawContent = response.data.choices[0].message.content;
    const cleanContent = cleanJsonString(rawContent);

    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanContent);
    } catch (parseErr) {
      console.error("Failed to parse AI JSON response. Raw content was:", rawContent);
      return res.status(500).json({ 
        success: false, 
        message: "AI returned an invalid JSON structure. Please try again.",
        raw: rawContent 
      });
    }

    // Validate that required fields exist in the parsed object
    if (!parsedContent.description || !parsedContent.shortDescription || !parsedContent.keySellingPoints || !parsedContent.seoKeywords || !parsedContent.tagline) {
      return res.status(500).json({
        success: false,
        message: "AI response was missing required content fields. Please try again.",
        data: parsedContent
      });
    }

    // Save to database
    const newContent = await ProductContent.create({
      productName,
      productCategory,
      productDetails: {
        brandName,
        keyFeatures,
        targetAudience
      },
      aiGeneratedContent: parsedContent,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newContent
    });

  } catch (error) {
    console.error("AI Generation / Save Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.error?.message || error.message || "An error occurred during content generation." 
    });
  }
};

// @desc    Get all saved product contents for the current user
// @route   GET /api/products/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await ProductContent.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single product content entry by ID
// @route   GET /api/products/:id
// @access  Private
const getProductContentById = async (req, res) => {
  try {
    const entry = await ProductContent.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    // Check ownership
    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized to access this content" });
    }

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error("Get Content ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a saved product content entry
// @route   DELETE /api/products/:id
// @access  Private
const deleteProductContent = async (req, res) => {
  try {
    const entry = await ProductContent.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    // Check ownership
    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this content" });
    }

    await entry.deleteOne();

    res.status(200).json({
      success: true,
      message: "Content successfully deleted"
    });
  } catch (error) {
    console.error("Delete Content Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateProductContent,
  getHistory,
  getProductContentById,
  deleteProductContent
};
