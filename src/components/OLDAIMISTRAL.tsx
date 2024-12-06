// template verson, perfectly working, use this for redesigning to any design you want

import { useState } from 'react';
import axios from 'axios';

const systemPromptText = `
You are a helpful co-worker at the Australian-based multinational company Lōkahi Care, 
providing quick and concise answers to any requests 
Now a customer come and speak you this:`;

const model = "mistralai/Mixtral-8x7B-Instruct-v0.1";
const accessToken = "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"; // Make sure to load this from your environment variables

// Sample empty array for info.md chunks (could be replaced with actual content)
const InfoMdChunks: string[] = [];

const formatPromptMixtral = (message: string, history: [string, string][], infoMdChunks: string[]) => {
  let prompt = "<s>";

  // Limit the number of history messages passed (e.g., only the last 1 exchange)
  const maxHistoryLength = 1; // You can adjust this to limit how many exchanges are included
  const recentHistory = history.slice(-maxHistoryLength); // Get the last 'maxHistoryLength' exchanges

  const allChunks = infoMdChunks.join("\n\n");
  prompt += `${allChunks}\n\n`;  // Add all chunks of info.md at the beginning
  prompt += `${systemPromptText}\n\n`; // Add the system prompt

  // Append only the most recent user message and bot response (if they exist)
  if (recentHistory.length) {
    recentHistory.forEach(([userPrompt, botResponse]) => {
      prompt += `[INST] ${userPrompt} [/INST] ${botResponse}</s> `;
    });
  }

  // Append the latest user message
  prompt += `[INST] ${message} [/INST]`; 

  return prompt;
};

// Extract only the content after the last [/INST]
const extractResponse = (generatedText: string): string => {
  // Find the position of the last [/INST] in the string
  const lastInstIndex = generatedText.lastIndexOf('[\/INST]');

  // If we find the last [/INST], extract everything that comes after it
  if (lastInstIndex !== -1) {
    return generatedText.slice(lastInstIndex + '[\/INST]'.length).trim(); // Extract everything after the last [/INST]
  }

  return ''; // If no [/INST] is found, return an empty string
};

const chatInf = async (
  message: string,
  history: [string, string][], 
  seed: number,
  temp: number,
  tokens: number,
  topP: number,
  repPenalty: number
) => {
  const generateParams = {
    temperature: temp,
    max_new_tokens: tokens,
    top_p: topP,
    repetition_penalty: repPenalty,
    do_sample: true,
    seed: seed,
  };

  const formattedPrompt = formatPromptMixtral(message, history, InfoMdChunks);

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: formattedPrompt },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: generateParams,
      }
    );

    const generatedText = response.data[0]?.generated_text || ''; // Access the generated text safely

    // Extract the response using the helper function
    const responseText = extractResponse(generatedText);

    if (!responseText) return [history, "No response from model."];  // Ensure there is a valid response

    history.push([message, responseText]); // Add the message and bot response to history
    return [history, responseText]; // Return updated history and bot response

  } catch (error) {
    console.error("API Error:", error);
    return [history, "An error occurred during processing. Please try again."];  // User-friendly error message
  }
};

const Chatbot = () => {
  const [history, setHistory] = useState<[string, string][]>([]); // Store conversation history
  const [userInput, setUserInput] = useState<string>(''); // User input
  const [botResponse, setBotResponse] = useState<string>(''); // Bot's response
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return; // Don't submit empty input

    setLoading(true); // Indicate loading state
    
    const seed = Math.floor(Math.random() * 1111111111111111); // Random seed
    const temp = 0.9; // Temperature for randomness
    const tokens = 3840; // Max tokens for response
    const topP = 0.9; // Top-p parameter for sampling
    const repPenalty = 1.0; // Repetition penalty
    
    // Call the chatInf function with user input and model parameters
    const [newHistory, response] = await chatInf(
      userInput,
      history,
      seed,
      temp,
      tokens,
      topP,
      repPenalty
    );

    // Update history and response in the UI if the response is valid
    if (Array.isArray(newHistory) && typeof response === 'string') {
      setHistory(newHistory);
      setBotResponse(response);
    }

    setUserInput(''); // Clear the input field after sending
    setLoading(false); // Turn off loading state
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Assistant</h1>
      <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'scroll' }}>
        {history.map(([userPrompt, botResponse], index) => (
          <div key={index}>
            <p><strong>You:</strong> {userPrompt}</p>
            <p><strong>Bot:</strong> {botResponse}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here"
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', fontSize: '16px', marginTop: '10px' }}
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
