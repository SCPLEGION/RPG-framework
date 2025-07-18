import React, { useState } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function Think({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        display: 'block',
        border: `1px solid ${alpha(theme.palette.text.primary, 0.3)}`,
        padding: '10px',
        margin: '10px 0',
        fontStyle: 'italic',
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
        borderRadius: '8px',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      <IconButton
        onClick={toggleOpen}
        size="small"
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          color: theme.palette.text.secondary
        }}
      >
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>

      {open && <div>{children}</div>}
    </div>
  );
}
