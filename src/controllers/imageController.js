import { GoogleGenerativeAI } from '@google/generative-ai';

class ImageController {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async analyzeImage(req, res) {
    try {
      const { image, dictOfVars = {} } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'No image data provided' });
      }
      
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest"
      });
      
      const prompt = this.createDetailedPrompt();
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: image.split(',')[1], mimeType: 'image/png' } }
      ]);
      
      const response = await result.response;
      const text = response.text();
      console.log('Raw AI response:', text);
      
      const parsedData = this.parseAIResponse(text);
      res.json(parsedData);
    } catch (error) {
      console.error('Image Analysis Error:', error);
      res.status(500).json({
        error: 'Failed to process image',
        details: error.message
      });
    }
  }

  createDetailedPrompt() {
    return `
    Analyze the handwritten mathematical expression with extreme precision.
   
    Guidelines:
    1. Carefully identify every symbol and number in the image
    2. Use standard mathematical order of operations (PEMDAS)
    3. Return ONLY a JSON array with these keys:
       - "expr": Exact expression from image
       - "result": Numerical calculation result
       - "assign": Optional boolean for variable assignment
    Response Format Examples:
    • "3 + 4" → [{"expr": "3 + 4", "result": 7, "assign": false}]
    • "x = 5" → [{"expr": "x = 5", "result": 5, "assign": true}]
    Strict Requirements:
    - Exact expression match
    - Numerical result only
    - No additional text or explanations
    - Use JSON array format
    `;
  }

  parseAIResponse(text) {
    try {
      // Remove any markdown code block markers
      const cleanText = text.replace(/```json?/g, '').replace(/```/g, '').trim();
     
      const parsedData = JSON.parse(cleanText);
     
      // Validate parsed data structure
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
     
      throw new Error('Invalid response format');
    } catch (parseError) {
      console.error('Parsing Error:', parseError);
      return [{
        error: 'Could not parse AI response',
        originalText: text
      }];
    }
  }
}

export default new ImageController();
