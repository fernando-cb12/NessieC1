import React, { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import styles from "./FinanceAgent.module.css";

interface FinanceAgentProps {
  route: string;
}

const placeholderQuestions: Record<string, string[]> = {
  home: [
    "What's my current financial status?",
    "How can I improve my savings?",
    "Show me my spending patterns",
  ],
  accounts: [
    "Compare my account balances",
    "Which account has the highest fees?",
    "Show my recent transactions",
  ],
  analytics: [
    "What's my biggest expense category?",
    "How's my monthly cash flow?",
    "Analyze my spending trends",
  ],
  stocks: [
    "How's my portfolio performing?",
    "Which stocks should I watch?",
    "Show market analysis",
  ],
  groups: [
    "Show group expenses summary",
    "Who owes the most?",
    "Split recent group payments",
  ],
};

const FinanceAgent: React.FC<FinanceAgentProps> = ({ route }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Rotate through placeholder questions
  useEffect(() => {
    const questions = placeholderQuestions[route] || placeholderQuestions.home;
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [route]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    // TODO: Replace with actual Gemini API call
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResponse(
        "This is a placeholder response. Gemini API integration pending."
      );
    } catch (error) {
      console.error("Error:", error);
      setResponse("Sorry, I couldn't process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
    setUserInput("");
  };

  return (
    <div className={styles.financeAgent}>
      <div className={styles.header}>
        <MessageSquare size={20} />
        <h2>Finance Assistant</h2>
      </div>

      <div className={styles.content}>
        {response && (
          <div className={styles.response}>
            <p>{response}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={
            placeholderQuestions[route]?.[currentQuestion] ||
            "Ask me anything about your finances..."
          }
          disabled={isLoading}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className={styles.sendButton}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default FinanceAgent;
