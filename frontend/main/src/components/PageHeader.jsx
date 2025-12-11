import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  actionButton,
  breadcrumbs,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              sx={{
                color: idx === breadcrumbs.length - 1
                  ? '#667eea'
                  : 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        flexWrap: 'wrap',
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            {Icon && (
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(102, 126, 234, 0.2)',
                color: '#667eea',
              }}>
                <Icon sx={{ fontSize: 32 }} />
              </Box>
            )}
            <Typography variant="h3" sx={{
              color: '#fff',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              ml: Icon ? '56px' : 0,
            }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actionButton && (
          <Box>
            {actionButton}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
