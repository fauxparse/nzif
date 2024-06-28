import { createRoot } from 'react-dom/client';

const div = document.getElementById('root');

if (div) {
  const root = createRoot(div);
  root.render(<h1>Hello, world!</h1>);
}
