import { Link, createFileRoute } from '@tanstack/react-router';

const LogIn = () => {
  const search = Route.useSearch();

  return (
    <div className="authentication__frame">
      <h2>Log in</h2>
      <Link to="/signup" search={search}>
        Sign up
      </Link>
    </div>
  );
};

export const Route = createFileRoute('/_auth/login')({
  component: LogIn,
});
