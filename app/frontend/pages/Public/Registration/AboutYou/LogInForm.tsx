import { useForm } from 'react-hook-form';
import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod';

import Section from '../Section';
import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import { saveAuthenticationInfo } from '@/graphql/authentication';
import { useLogInMutation, useRegistrationStatusQuery, useSignUpMutation } from '@/graphql/types';
import Labelled from '@/helpers/Labelled';
import Skeleton from '@/helpers/Skeleton';

const formSchema = z.object({
  name: z.string().regex(/^[^\s]+(\s+[^\s]+)+$/, 'We need your full (first and last) name'),
  email: z.string().email('This doesn’t look like an email address'),
  password: z.string().min(6, 'Try a longer password'),
});

type FormSchemaType = z.infer<typeof formSchema>;

const LogInForm: React.FC = () => {
  const { loading } = useRegistrationStatusQuery();

  const client = useApolloClient();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setFocus,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const [logIn, { loading: loggingIn, data: logInData, error: logInError }] = useLogInMutation({
    update: (_, { data }) => {
      const { credentials } = data?.userLogin || {};
      if (credentials) {
        saveAuthenticationInfo(credentials);
      }
      client.resetStore();
    },
  });

  const [signUp, { loading: signingUp, data: signUpData }] = useSignUpMutation({
    update: (_, { data }) => {
      const { credentials } = data?.userRegister || {};
      if (credentials) {
        saveAuthenticationInfo(credentials);
      }
    },
    refetchQueries: ['CurrentUser', 'RegistrationStatus'],
  });

  const onSubmit = () => {
    const { name, email, password } = getValues();
    if (!email || errors.email) {
      setFocus('email');
    } else if (!password || errors.password) {
      setFocus('password');
    } else {
      logIn({
        variables: {
          email,
          password,
        },
      }).catch((e) => {
        signUp({
          variables: {
            name,
            email,
            password,
          },
        });
      });
    }
  };

  return (
    <form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
      <Section
        title="Login and security"
        description="Let’s get you set up with an account"
        aside={
          <AnimatePresence mode="wait" initial={false}>
            {logInError ? (
              <motion.div
                key="log-in-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h4>Sorry, that’s not quite right</h4>
                <p>
                  Doesnʻt look like that password matches what we have on file. Try again, or{' '}
                  <a href="/password-reset">reset your password</a>.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="log-in-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h4>Already have an account?</h4>
                <p>
                  If you’ve attended NZIF before, you probably already have an account on this site
                  and can log in with those details.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        }
      >
        <Labelled label="Your name" name="name" required errors={errors}>
          <Skeleton rounded loading={loading}>
            <Input
              type="text"
              autoComplete="name"
              id="name"
              {...register('name')}
              disabled={loggingIn || signingUp || undefined}
            />
          </Skeleton>
        </Labelled>
        <Labelled label="Your email address" name="email" required errors={errors}>
          <Skeleton rounded loading={loading}>
            <Input
              type="email"
              id="email"
              autoComplete="email"
              {...register('email')}
              disabled={loggingIn || signingUp || undefined}
            />
          </Skeleton>
        </Labelled>
        <Labelled label="Choose a password" name="password" required errors={errors}>
          <Skeleton rounded loading={loading}>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={loggingIn || signingUp || undefined}
            />
          </Skeleton>
        </Labelled>
        <Button type="submit" text="Continue" disabled={loggingIn || signingUp || undefined} />
      </Section>
    </form>
  );
};

export default LogInForm;
