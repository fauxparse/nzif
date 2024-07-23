import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register/payment')({
  component: () => <div>Hello /_public/register/payment!</div>
})