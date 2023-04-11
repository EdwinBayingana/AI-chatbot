import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Yanna',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0, // With a higher temperature, this model will take more risks while answering
      max_tokens: 3000, // Will generate a large response when necessary
      top_p: 1,
      frequency_penalty: 0.5, // It is not going to repeat similar sentences often
      presence_penalty: 0,
    });

    res.status(200).json({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
    });
  }
});

app.listen(5000, () =>
  console.log(`🍀 Server is running on http://localhost:5000`),
);
