import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => (
  <div className="dashboard">
    <section>
      <h1>NZIF</h1>
      <Link to="/admin/users/G499sZ">User</Link>
      <Link to="/admin/2023">2023</Link>
      <Link to="/admin/2023/workshops">Workshops</Link>
      <Link to="/admin/2023/shows">Shows</Link>
      <Link to="/admin/2023/social-events">Social events</Link>
    </section>
  </div>
);

export default Dashboard;
