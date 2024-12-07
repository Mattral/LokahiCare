import { useTheme } from '@mui/material/styles';

/**
 * If you want to use an image instead of <svg>, this code will render an image logo.
 */

const LogoIcon = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();
  
  // Decide which logo to use based on the current theme
  const logoSrc = theme.palette.mode === 'dark' 
    ? '/images/Lokahi_Care_Dark.png'  // Dark mode logo
    : '/images/Lokahi_Care.png';      // Light mode logo

  return (
    <img 
      src={logoSrc} 
      alt="Lokahi Care logo icon" 
      width="66" 
      height="28" 
      {...others} // Pass any other props that are given to the LogoIcon component
    />
  );
};

export default LogoIcon;
