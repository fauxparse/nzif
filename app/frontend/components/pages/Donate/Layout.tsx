import { Box, Container } from '@radix-ui/themes';
import { Outlet } from '@tanstack/react-router';

import styles from './Donate.module.css';

const Layout: React.FC = () => {
  return (
    <Box className={styles.layout} p={{ initial: '4', md: '6' }}>
      <Container className={styles.container} size={{ initial: '1', sm: '2', md: '3' }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
