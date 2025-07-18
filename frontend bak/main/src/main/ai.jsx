import React, { useState } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { useThemeMode } from '../ThemeContext';
import ReactMarkdown from 'react-markdown';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

class AIClient {
  constructor(baseUrl = 'http://localhost:1234') {
    this.baseUrl = baseUrl;
  }

  async getEmbeddings(text, model = 'text-embedding-nomic-embed-text-v1.5') {
    const response = await fetch(`${this.baseUrl}/v1/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input: text }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async chatCompletion(messages, model = 'default') {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }
}

const AIPage = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();

  const [client] = useState(() => new AIClient());
  const [inputText, setInputText] = useState('');
  const [embeddings, setEmbeddings] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetEmbeddings = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await client.getEmbeddings(inputText);
      setEmbeddings(result);
      setInputText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatCompletion = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const userMessage = { role: 'user', content: chatInput };
      setChatMessages((prev) => [...prev, userMessage]);

      const messages = [
        { role: 'system', content: 'You are a text reforming AI assistant.' },
        ...chatMessages,
        userMessage,
      ];

      const result = await client.chatCompletion(messages, 'qwen/qwen3-4b');

      const assistantMessage = {
        role: 'assistant',
        content: result.choices?.[0]?.message?.content || 'No response',
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
      setChatInput('');
    } catch (err) {
      setError(err.message);
      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    setError(null);
  };

  const clearEmbeddings = () => {
    setEmbeddings(null);
    setInputText('');
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 0,
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        component="header"
        sx={{
          bgcolor: 'primary.main',
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'primary.contrastText',
          py: 3,
          mb: 4,
          boxShadow: (t) => `0 4px 20px ${alpha(t.palette.common.black, 0.1)}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ textShadow: mode === 'amoled' ? '0 2px 4px rgba(255,255,255,0.1)' : 'none' }}>
          🤖 AI Client Interface
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
          Test embeddings and chat completions with your local AI server
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {/* Embeddings Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            border: (t) => `1px solid ${alpha(t.palette.divider, 0.2)}`,
            bgcolor: 'background.paper',
            boxShadow: (t) => `0 4px 20px ${alpha(t.palette.common.black, mode === 'amoled' ? 0.3 : 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              📊 Text Embeddings
            </Typography>
            {embeddings && (
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={clearEmbeddings}
                sx={{ fontWeight: 600 }}
              >
                Clear
              </Button>
            )}
          </Box>

          <TextField
            multiline
            minRows={4}
            fullWidth
            placeholder="Enter text to generate embeddings..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleGetEmbeddings}
            disabled={loading || !inputText.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 150 }}
          >
            {loading ? '⏳ Processing...' : '🚀 Get Embeddings'}
          </Button>

          {embeddings && (
            <Box
              component="pre"
              sx={{
                mt: 3,
                p: 2,
                maxHeight: 300,
                overflowY: 'auto',
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5),
                border: (t) => `1px solid ${alpha(t.palette.divider, 0.2)}`,
                fontFamily: 'monospace',
                fontSize: 12,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(embeddings, null, 2)}
            </Box>
          )}
        </Paper>

        {/* Chat Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            border: (t) => `1px solid ${alpha(t.palette.divider, 0.2)}`,
            bgcolor: 'background.paper',
            boxShadow: (t) => `0 4px 20px ${alpha(t.palette.common.black, mode === 'amoled' ? 0.3 : 0.1)}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              💬 Chat Completion
            </Typography>
            {chatMessages.length > 0 && (
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={clearChat}
                sx={{ fontWeight: 600 }}
              >
                Clear Chat
              </Button>
            )}
          </Box>

          <TextField
            multiline
            minRows={3}
            fullWidth
            placeholder="Ask something (AI responds in rhymes)..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChatCompletion();
              }
            }}
            sx={{ mb: 1 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleChatCompletion}
            disabled={loading || !chatInput.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 150, mb: 1, alignSelf: 'flex-start' }}
          >
            {loading ? '⏳ Thinking...' : '💭 Send Message'}
          </Button>

          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}>
            Tip: Press Enter to send, Shift+Enter for new line
          </Typography>

          {error && (
            <Box
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                mb: 2,
              }}
            >
              ⚠️ <strong>Error:</strong> {error}
            </Box>
          )}

          {chatMessages.length > 0 && (
            <Box
              sx={{
                bgcolor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 2,
                p: 2,
                maxHeight: 400,
                overflowY: 'auto',
                border: (t) => `1px solid ${alpha(t.palette.divider, 0.2)}`,
              }}
            >
              {chatMessages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      msg.role === 'user'
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.secondary.main, 0.1),
                    borderLeft:
                      msg.role === 'user'
                        ? `4px solid ${theme.palette.primary.main}`
                        : `4px solid ${theme.palette.secondary.main}`,
                    ml: msg.role === 'user' ? 3 : 0,
                    mr: msg.role === 'assistant' ? 3 : 0,
                    animation: 'fadeIn 0.3s ease forwards',
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', mb: 0.5, textTransform: 'uppercase', fontWeight: 'bold' }}
                  >
                    {msg.role === 'user' ? '👤 You' : '🤖 Assistant'}
                  </Typography>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Global fadeIn keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
          }
        `}
      </style>
    </Box>
  );
};

export default AIPage;
