import { Outlet } from 'react-router-dom';

import './Directory.css';

const Layout: React.FC = () => {
  return (
    <div className="directory">
      <Outlet />
    </div>
  );
};

export default Layout;
