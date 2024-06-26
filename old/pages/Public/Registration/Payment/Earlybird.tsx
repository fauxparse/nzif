import { useFinaliseRegistrationMutation } from '@/graphql/types';
import { useRegistrationContext } from '../RegistrationContext';

import Cart from './Cart';

const Earlybird: React.FC = () => {
  const { registration, festival, next } = useRegistrationContext();

  const [finaliseRegistration] = useFinaliseRegistrationMutation();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    finaliseRegistration().then(() => next());
  };

  return (
    <form id="registration-form" className="registration__payment" onSubmit={submit}>
      <div className="registration__payment__earlybird">
        <h2>You don’t have to pay anything right now.</h2>
        <p>
          Your full registration fee is due once registrations are finalised in early September.
        </p>
        <p>
          This is because we can’t guarantee places in every workshop you’ve selected, although in
          other years where this system has been in place, almost everyone has been able to get a
          place in every slot.
        </p>
        <p>
          You can maximise your chances of a full Festival schedule by picking some second or third
          choices for workshop slots. We hope that even if you don’t always get your first choice,
          you’ll be delighted with the quality on offer.
        </p>
      </div>
      <Cart registration={registration} festival={festival} />
    </form>
  );
};

export default Earlybird;
