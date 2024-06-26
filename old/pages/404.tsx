import Footer from '@/organisms/Footer';
import Header from '@/organisms/Header';

import './Errors.css';

const NotFound: React.FC = () => (
  <div className="error-page">
    <Header />
    <main>
      <h1>Mō taku hē…</h1>
      <p>We couldn’t find what you were looking for.</p>
      <p>It’s probably not your fault.</p>
    </main>
    <Footer />
  </div>
);

export default NotFound;
