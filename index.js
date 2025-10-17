const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins (or specify allowed origins)
app.use(cors({
  origin: '*', // Allow all origins; for production, specify your frontend URL (e.g., 'https://your-frontend.vercel.app')
  methods: ['GET'], // Allow only GET requests
  allowedHeaders: ['Content-Type'],
}));

// Etherscan API base URL
const ETHERSCAN_API = 'https://api.etherscan.io/v2/api';

// Proxy endpoint
app.get('/api', async (req, res) => {
  try {
    // Get all query parameters from the incoming request
    const queryParams = { ...req.query };

    // Add the API key from .env to the query parameters
    queryParams.apikey = process.env.API_KEY;

    // Make the request to Etherscan API
    const response = await axios.get(ETHERSCAN_API, {
      params: queryParams,
    });

    // Return the Etherscan response to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors (e.g., Etherscan API errors or network issues)
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Internal server error',
    });
  }
});

// Root route for clarity
app.get('/', (req, res) => {
  res.send('Etherscan Proxy API. Use /api endpoint with Etherscan parameters.');
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});