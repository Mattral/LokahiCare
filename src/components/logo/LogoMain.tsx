import { useTheme } from '@mui/material/styles';

/**
 * If you want to use an image instead of <svg>, this code will render an image logo.
 */

const LogoMain = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();
  return (
    /**
     * Use an image instead of the SVG.
     * The image path is relative to the `public` folder, so you can access it as `/images/Lokahi_Care.png`.
     */
    <img 
      src="/images/Lokahi_Care.png" 
      alt="Lokahi Care logo" 
      width="100" 
      height="auto" 
      {...others} // Pass any other props that are given to the LogoMain component
    />
  );
};

export default LogoMain;
