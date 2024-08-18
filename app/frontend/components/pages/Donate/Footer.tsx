import { Money } from '@/components/atoms/Money';
import ChevronRightIcon from '@/icons/ChevronRightIcon';
import { Box, Button, Flex, Grid, Inset, Text } from '@radix-ui/themes';
import { range } from 'lodash-es';
import { useDonation } from './DonationProvider';

import { motion } from 'framer-motion';
import styles from './Donate.module.css';

type FooterProps = {
  onSubmit: () => void;
};

export const Footer: React.FC<FooterProps> = ({ onSubmit }) => {
  const { amount, valid, pageIndex, totalPages, nextPage } = useDonation();

  return (
    <Inset side="x" asChild>
      <Grid asChild columns="1fr 1fr 1fr" gap="2" align="center">
        <motion.footer layout="position" className={styles.footer}>
          <Text>
            {amount > 0 && (
              <span>
                Your donation: <Money cents={amount} />
              </span>
            )}
          </Text>
          <Flex justify="center" gap="2">
            {range(totalPages).map((i) => (
              <Box key={i} className={styles.dot} data-filled={i === pageIndex || undefined} />
            ))}
          </Flex>
          <Button variant="solid" size="3" disabled={!valid} onClick={onSubmit}>
            Next <ChevronRightIcon />
          </Button>
        </motion.footer>
      </Grid>
    </Inset>
  );
};
