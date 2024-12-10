import { useState, useEffect } from 'react';
import axios from 'axios';
import { Person } from '@mui/icons-material'; // User Icon
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // Bot Icon
import { IconButton } from '@mui/material'; // For icons and button styling

const systemPromptText = `
You are a helpful AI assistant of Lōkahi Care website, 
providing quick and short answers to any requests.
You do not answer unrelated topics`;

const model = "mistralai/Mistral-7B-Instruct-v0.2";
const accessToken = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

const InfoMdChunks: string[] = [];

const loadInfoMd = async () => {
    try {
        // Fetch the content of info.md
        const response = await fetch('/pdf/info.md');
        if (!response.ok) {
            throw new Error('Failed to fetch info.md');
        }

        const mdContent = await response.text();

        // Optionally, split the content into chunks if you want (for example, by paragraphs or lines)
        const chunks = mdContent.split('\n\n'); // Splits by empty line, you can customize this
        InfoMdChunks.push(...chunks); // Push content into InfoMdChunks array

        console.log('InfoMdChunks:', InfoMdChunks); // To see the fetched and chunked data
    } catch (error) {
        console.error('Error loading info.md:', error);
    }
};

const formatPromptMixtral = (message: string, history: [string, string][], infoMdChunks: string[]) => {
    let prompt = "<s>";

    const maxHistoryLength = 1;
    const recentHistory = history.slice(-maxHistoryLength);

    const allChunks = infoMdChunks.join("\n\n");
    prompt += `${allChunks}\n\n`;
    prompt += `${systemPromptText}\n\n`;

    if (recentHistory.length) {
        recentHistory.forEach(([userPrompt, botResponse]) => {
            prompt += `[INST] ${userPrompt} [/INST] ${botResponse}</s> `;
        });
    }

    prompt += `[INST] ${message} [/INST]`;

    return prompt;
};

const extractResponse = (generatedText: string): string => {
    const lastInstIndex = generatedText.lastIndexOf('[\/INST]');
    if (lastInstIndex !== -1) {
        return generatedText.slice(lastInstIndex + '[\/INST]'.length).trim();
    }
    return '';
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

        const generatedText = response.data[0]?.generated_text || '';
        const responseText = extractResponse(generatedText);

        if (!responseText) return [history, "No response from model."];

        history.push([message, responseText]);
        return [history, responseText];
    } catch (error) {
        console.error("API Error:", error);
        return [history, "An error occurred during processing. Please try again."];
    }
};

const AiChatbot = () => {
    const [history, setHistory] = useState<[string, string][]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [botResponse, setBotResponse] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        setLoading(true);

        const seed = Math.floor(Math.random() * 1111111111111111);
        const temp = 0.4;
        const tokens = 5000;
        const topP = 0.9;
        const repPenalty = 1.0;

        const [newHistory, response] = await chatInf(
            userInput,
            history,
            seed,
            temp,
            tokens,
            topP,
            repPenalty
        );

        if (Array.isArray(newHistory) && typeof response === 'string') {
            setHistory(newHistory);
            setBotResponse(response);
            // Convert the bot response to speech
            speakText(response);
        }

        setUserInput('');
        setLoading(false);
    };

    const speakText = (text: string) => {
        const speech = new SpeechSynthesisUtterance(text);
    
        // Set the language to English (you can adjust this if you want a different language)
        speech.lang = 'en-US';
    
        // Get all available voices
        const voices = window.speechSynthesis.getVoices();
    
        // Find the first female voice available
        const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female')) || voices[0];
    
        // Set the selected voice
        speech.voice = femaleVoice;
    
        // Adjust pitch and rate (optional, you can modify these values)
        speech.pitch = 1;  // 0 to 2 range, 1 is the default
        speech.rate = 1;   // 0.1 to 10 range, 1 is the default
    
        // Speak the text
        window.speechSynthesis.speak(speech);
    };
    

      // Update windowWidth state on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        // Cleanup event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadInfoMd(); // Load the file when the component mounts
    }, []);

  // Calculate responsive styles based on windowWidth
  const chatPopupStyles: React.CSSProperties = {
    fontFamily: 'Roboto, sans-serif',
    position: 'fixed',
    bottom: '20px',
    left: windowWidth < 768 ? '50%' : '80%',
    transform: 'translateX(-50%)',
    padding: windowWidth < 768 ? '20px' : '30px', // smaller padding on smaller screens
    width: windowWidth < 480 ? '95%' : windowWidth < 768 ? '85%' : '500px', // dynamic width based on screen size
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
    height: windowWidth < 480 ? '60vh' : windowWidth < 768 ? '70vh' : '80vh', // dynamic height based on screen size
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as 'column', // Explicitly cast 'column' to ensure it's a valid FlexDirection
    transition: 'all 0.3s ease',
  };

    return (
        <div>
            {/* Icon Button to Show/Hide the chat */}
            <div style={{
                position: 'fixed',        // Fixed positioning so it stays in place on the screen
                bottom: '50px',           // 50px from the bottom of the screen (adjust to move further down)
                right: '20px',            // 20px from the right edge of the screen
                zIndex: 1000,             // Ensures it appears above other content
                backgroundColor: '#4C9AFF', // Background color of the button
                borderRadius: '50%',      // Circular button
                padding: '20px',          // Increase padding to make the button bigger
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow for better visibility
                display: 'flex',          // Flexbox to center the icon inside the button
                justifyContent: 'center', // Center the icon horizontally
                alignItems: 'center',     // Center the icon vertically
            }}>
                <IconButton
                    onClick={() => setIsChatVisible(!isChatVisible)}
                    style={{
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        padding: '20px',
                        borderRadius: '50%',
                    }}
                >
                    <SupportAgentIcon />
                </IconButton>
            </div>

            {/* Chat popup window */}
            {isChatVisible && (
                <div style={chatPopupStyles}>
                    <h1 style={{
                        fontSize: '24px',
                        color: '#333',
                        marginBottom: '20px',
                        textAlign: 'center',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                    }}>AI Assistant</h1>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        paddingRight: '20px',
                        borderRadius: '12px',
                        backgroundColor: '#f7f7f7',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}>
                        {history.map(([userPrompt, botResponse], index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    gap: '12px',
                                }}>
                                    <div style={{
                                        backgroundColor: '#007BFF',
                                        color: '#fff',
                                        padding: '15px 20px',
                                        borderRadius: '25px',
                                        maxWidth: '75%',
                                        fontSize: '16px',
                                        wordWrap: 'break-word',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                                    }}>
                                        <strong>You:</strong> {userPrompt}
                                    </div>
                                    <div style={{
                                        backgroundColor: '#007BFF',
                                        color: '#fff',
                                        padding: '16px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '50px',
                                        height: '50px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    }}>
                                        <Person style={{ fontSize: '24px' }} />
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}>
                                    <div style={{
                                        backgroundColor: '#4C9AFF',
                                        color: '#fff',
                                        padding: '16px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '50px',
                                        height: '50px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    }}>
                                        <SupportAgentIcon style={{ fontSize: '24px' }} />
                                    </div>
                                    <div style={{
                                        backgroundColor: '#f1f3f6',
                                        color: '#000',
                                        padding: '15px 20px',
                                        borderRadius: '25px',
                                        maxWidth: '75%',
                                        fontSize: '16px',
                                        wordWrap: 'break-word',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                                    }}>
                                        <strong>AI:</strong> {botResponse}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}>
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type your message here"
                            style={{
                                padding: '15px 20px',
                                fontSize: '16px',
                                borderRadius: '25px',
                                border: '1px solid #ccc',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                                backgroundColor: '#fff',
                                width: '100%',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '15px 20px',
                                fontSize: '16px',
                                borderRadius: '25px',
                                backgroundColor: '#4C9AFF',
                                color: '#fff',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.3s, transform 0.3s',
                                transform: loading ? 'none' : 'scale(1.05)',
                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            {loading ? 'Loading...' : 'Send'}
                        </button>
                    </form>

                    {/* Close button */}
                    <IconButton
                        onClick={() => setIsChatVisible(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: '#ff0000',
                            color: '#fff',
                        }}
                    >
                        X
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default AiChatbot;
