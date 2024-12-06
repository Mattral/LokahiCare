// pages/index.tsx
"use client"
import Chatbot from 'components/Chatbot';
import AiChatbot from 'components/aiChat';
const Home: React.FC = () => {
  return (
    <div>
      <Chatbot />
      
      <AiChatbot />
    </div>
  );
};

export default Home;
