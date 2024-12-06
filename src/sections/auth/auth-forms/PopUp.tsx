import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, IconButton } from '@mui/material';
import { CheckCircleOutline, ErrorOutline, ContentCopy } from '@mui/icons-material';
import { styled, keyframes } from '@mui/system';


// Keyframes for glow and pulsate animations
const glow = keyframes`
  0% { box-shadow: 0 0 8px rgba(255, 255, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.6); }
  100% { box-shadow: 0 0 8px rgba(255, 255, 255, 0.3); }
`;

const pulsate = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Frosted glass card styling
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
    animation: `${pulsate} 3s ease-in-out infinite`,
    overflow: 'hidden',
    position: 'relative',
  },
}));

// Animated gradient title box
const TitleBox = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'linear-gradient(45deg, #FF7E5F, #FEB47B)',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  animation: `${glow} 2s ease-in-out infinite`,
});

// Token box styling with copy functionality
const TokenBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  padding: '10px 15px',
  borderRadius: '8px',
  marginTop: '10px',
  boxShadow: 'inset 0px 0px 12px rgba(0, 0, 0, 0.15)',
  color: theme.palette.text.primary,
  fontFamily: 'monospace',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
  },
}));

// Animated close button
const AnimatedButton = styled(Button)({
  transition: 'transform 0.4s ease, background 0.3s',
  backgroundColor: '#FF7E5F',
  borderRadius: '20px',
  color: '#fff',
  fontWeight: 'bold',
  padding: '10px 30px',
  animation: `${pulsate} 2.5s ease-in-out infinite`,
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: '#FEB47B',
    boxShadow: '0px 4px 20px rgba(255, 126, 95, 0.7)',
  },
});

const Popup = ({ open, onClose, message, authorization, success = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(authorization);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <TitleBox>
        {success ? (
          <CheckCircleOutline sx={{ fontSize: 38, color: 'white', animation: `${glow} 1.5s ease-in-out infinite` }} />
        ) : (
          <ErrorOutline sx={{ fontSize: 38, color: '#FF7E5F', animation: `${glow} 1.5s ease-in-out infinite` }} />
        )}
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
          {success ? 'Welcome!' : 'Authentication Failed'}
        </Typography>
      </TitleBox>

      <DialogContent sx={{ padding: '25px' }}>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#333', lineHeight: 1.6 }}>
          {message}
        </Typography>

        {authorization && (
          <TokenBox onClick={handleCopyToken}>
            <Typography variant="subtitle2" sx={{ color: '#333', fontWeight: 500 }}>
              Authorization Token:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Typography variant="body2" sx={{ color: '#333', wordBreak: 'break-all' }}>
                {authorization}
              </Typography>
              <IconButton size="small" sx={{ color: '#555' }}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
            {copied && <Typography sx={{ color: '#FF7E5F', fontSize: '0.8rem', fontWeight: 'bold', mt: 1 }}>Copied!</Typography>}
          </TokenBox>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
        <AnimatedButton onClick={onClose} variant="contained">
          OK
        </AnimatedButton>
      </DialogActions>
    </StyledDialog>
  );
};

function useState(arg0: boolean): [any, any] {
    throw new Error('Function not implemented.');
}

export default Popup;
