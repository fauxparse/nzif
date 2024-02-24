import Header from '@/components/Header';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import './_layout.css';
import Footer from '@/components/Footer';

export const Route = createFileRoute('/_layout')({
  component: () => (
    <div className="layout">
      <Header className="layout__header" />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer className="layout__footer" />
    </div>
  ),
});
