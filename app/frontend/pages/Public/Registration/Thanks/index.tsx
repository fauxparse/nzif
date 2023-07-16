import { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { crimson, cyan, yellow } from '@radix-ui/colors';

import { useRegistrationContext } from '../RegistrationContext';

export const Component: React.FC = () => {
  const { festival } = useRegistrationContext();

  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setTimeout(() => setConfetti(true), 750);
  }, []);

  return (
    <div className="registration__thanks">
      {confetti && (
        <ConfettiExplosion
          colors={[crimson.crimson9, cyan.cyan9, yellow.yellow9]}
          duration={3000}
          particleCount={200}
          width={window.innerWidth * 1.5}
          onComplete={() => setConfetti(false)}
        />
      )}
      <h1>You’re coming to NZIF!</h1>

      <p>
        Keep an eye on your email for confirmation of your registration, as well as important
        communications about the Festival.
      </p>
      <p>
        In the meantime, why not join us in the NZIF Green Room on Facebook? It’s where all the cool
        kids hang out.
      </p>
      <p>We can’t wait to see you in {festival.startDate.toFormat('MMMM')}!</p>
    </div>
  );
};

Component.displayName = 'Thanks';

export default Component;
