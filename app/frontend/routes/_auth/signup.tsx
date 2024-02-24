import { createFileRoute, Link } from '@tanstack/react-router';

const SignUp = () => {
  const search = Route.useSearch();

  return (
    <div className="authentication__frame">
      <h2>Sign up</h2>
      <Link to="/login" search={search}>
        Log in
      </Link>
    </div>
  );
};

export const Route = createFileRoute('/_auth/signup')({
  component: SignUp,
});
