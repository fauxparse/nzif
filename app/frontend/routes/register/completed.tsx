import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register/completed')({
  component: () => <div>Hello /_public/register/completed!</div>
})