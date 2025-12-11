import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  ContactSupport as ContactSupportIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useNavbar } from '../addons/navbar';

const Help = () => {
  const { setOption, setSidebarLeftDisabled, setSidebarRightDisabled } = useNavbar();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);

  useEffect(() => {
    setOption('help');
    setSidebarLeftDisabled(false);
    setSidebarRightDisabled(true);
  }, []);

  const faqs = [
    {
      question: 'How do I create a ticket?',
      answer: 'To create a ticket, use the /ticket command in Discord and fill out the form. Your ticket will be created and you can track its status in this dashboard.',
      category: 'Getting Started',
    },
    {
      question: 'How long does it take to get a response?',
      answer: 'Our support team typically responds within 24 hours. During peak times, it may take up to 48 hours.',
      category: 'Support',
    },
    {
      question: 'Can I delete my tickets?',
      answer: 'Yes, you can delete your tickets from the Tickets page. Note that deleted tickets cannot be recovered.',
      category: 'Tickets',
    },
    {
      question: 'How do I contact support directly?',
      answer: 'You can use the contact form on this page, or join our Discord server and message @Support.',
      category: 'Support',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take security seriously. All data is encrypted in transit and at rest. We comply with GDPR and other data protection regulations.',
      category: 'Security',
    },
    {
      question: 'How can I provide feedback?',
      answer: 'We love hearing from users! You can provide feedback through the contact form or suggest features on our GitHub repository.',
      category: 'Feedback',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We currently support credit/debit cards (Visa, Mastercard, American Express) and PayPal.',
      category: 'Billing',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click "Login with Discord" to authenticate. Your account is linked to your Discord account for security.',
      category: 'Account',
    },
  ];

  const categories = ['All', ...new Set(faqs.map(faq => faq.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = faqs.filter(faq =>
    (selectedCategory === 'All' || faq.category === selectedCategory) &&
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)',
      pt: 4,
      pb: 4,
    }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{
          color: '#fff',
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Help & Support
        </Typography>

        {/* Quick Links */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.08)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(102, 126, 234, 0.2)',
                  color: '#667eea',
                  width: 'fit-content',
                  mx: 'auto',
                  mb: 2,
                }}>
                  <HelpIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                  FAQ
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                  Browse common questions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.08)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(76, 175, 80, 0.2)',
                  color: '#4CAF50',
                  width: 'fit-content',
                  mx: 'auto',
                  mb: 2,
                }}>
                  <QuestionAnswerIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                  Discord
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                  Chat with support
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.08)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(244, 67, 54, 0.2)',
                  color: '#F44336',
                  width: 'fit-content',
                  mx: 'auto',
                  mb: 2,
                }}>
                  <EmailIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                  Email
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                  support@example.com
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.08)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 193, 7, 0.2)',
                  color: '#FFC107',
                  width: 'fit-content',
                  mx: 'auto',
                  mb: 2,
                }}>
                  <ContactSupportIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                  Status
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                  System status
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
        }}>
          <CardContent>
            <Typography variant="h5" sx={{
              color: '#fff',
              fontWeight: 700,
              mb: 3,
            }}>
              Frequently Asked Questions
            </Typography>

            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiInputBase-root': {
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.05)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              }}
            />

            {/* Categories */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map(category => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    background: selectedCategory === category
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>

            {/* FAQs */}
            {filteredFaqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expandedFaq === index}
                onChange={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                sx={{
                  background: 'transparent',
                  border: 'none',
                  '&:before': { display: 'none' },
                  '& .MuiAccordionSummary-root': {
                    color: '#fff',
                    padding: '16px 0',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    }
                  },
                  '& .MuiAccordionDetails-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    paddingBottom: 2,
                  }
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}>
                  <Typography sx={{ fontWeight: 500 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Help;
