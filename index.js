const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 8000; // You can change this to any port you prefer

require('dotenv').config();

app.use(express.json());
app.use(cors()); // Use the cors middleware to enable CORS

app.post('/joke', async (req, res) => {
  try {
    const { keyword } = req.body;

    // Validate the keyword input
    if (!keyword) {
      return res.status(400).json({ error: 'Please provide a keyword.' });
    }

    // Call the ChatGPT API to get the joke
    const joke = await getJokeFromChatGPT(keyword);

    // Send the joke as a response
    res.json({ joke });
  } catch (error) {
    console.error('Error fetching joke:', error.message);
    res.status(500).json({ error: 'Error fetching joke. Please try again later.' });
  }
});

async function getJokeFromChatGPT(keyword) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        prompt: `Tell me a joke about ${keyword}`,
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    throw new Error('Error fetching joke from ChatGPT.');
  }
}

app.listen(port, () => {
  console.log(`Joke App listening at http://localhost:${process.env.PORT}`);
});
