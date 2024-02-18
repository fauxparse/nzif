import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import { saveAuthenticationInfo } from '@/graphql/authentication';
import { useResetPasswordAndLogInMutation } from '@/graphql/types';
import Labelled from '@/helpers/Labelled';
import { useToaster } from '@/molecules/Toaster';

const passwordFormSchema = z
  .object({
    password: z.string().min(8, { message: 'Try a longer password' }),
    passwordConfirmation: z.string().nonempty('This field is required'),
    token: z.string().nonempty(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

type PasswordFormSchema = z.infer<typeof passwordFormSchema>;

type FormProps = {
  token: string;
  back?: string;
};

export const Form: React.FC<FormProps> = ({ token, back }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<PasswordFormSchema>({
    resolver: zodResolver(passwordFormSchema),
    values: {
      token,
      password: '',
      passwordConfirmation: '',
    },
  });

  const [resetPassword, { loading: resettingPassword, error: submissionError }] =
    useResetPasswordAndLogInMutation();

  const navigate = useNavigate();

  const { notify } = useToaster();

  const client = useApolloClient();

  const onSubmit = () => {
    const { password, passwordConfirmation, token } = getValues();

    resetPassword({
      variables: { password, passwordConfirmation, token },
    })
      .then(({ data }) => {
        const credentials = data?.resetPasswordAndLogIn?.credentials;

        if (!credentials) return;

        notify('Your password has been reset');
        saveAuthenticationInfo(credentials);

        client.refetchQueries({ include: ['CurrentUser', 'RegistrationStatus'] }).then(() => {
          navigate(back || '/');
        });
      })
      .catch(() => {
        'nope';
      });
  };

  return (
    <form
      className="reset-password__form"
      aria-busy={resettingPassword || undefined}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>Reset your password</h1>
      {submissionError && (
        <p className="reset-password__error">
          Sorry, that token doesn’t appear to be valid. Please try logging in again.
        </p>
      )}
      <input type="hidden" {...register('token')} />
      <Labelled label="New password" name="password" errors={errors}>
        <Input type="password" {...register('password')} autoComplete="password" autoFocus />
      </Labelled>
      <Labelled label="Confirm password" name="passwordConfirmation" errors={errors}>
        <Input type="password" {...register('passwordConfirmation')} />
      </Labelled>
      <Button primary type="submit">
        Reset password
      </Button>
    </form>
  );
};

export default Form;
