import Logo from '@/components/atoms/Logo';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';

import styles from './Donate.module.css';

export const Thanks: React.FC = () => {
  return (
    <Flex direction="column" gap="4" align="start">
      <header>
        <Logo className={styles.logo} />
        <Heading size={{ initial: '6', sm: '8' }}>Thanks for your donation!</Heading>
      </header>
      <Text size="3" as="p">
        Thank you so much for supporting NZIF. We’ve emailed you a receipt for your donation.
      </Text>
      <Button asChild>
        <a href="https://improvfest.nz">Back to NZIF</a>
      </Button>
    </Flex>
  );
};
