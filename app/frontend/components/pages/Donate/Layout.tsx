import { Box } from '@radix-ui/themes';
import { Outlet } from '@tanstack/react-router';
import classes from './Donate.module.css';

const Layout: React.FC = () => {
  return (
    <Box className={classes.layout} p={{ initial: '4', md: '6' }}>
      <Outlet />
    </Box>
  );
};

export default Layout;
