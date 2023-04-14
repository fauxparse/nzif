import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => (
  <div className="dashboard">
    <section>
      <h1>NZIF</h1>
      <Link to="/admin/users/G499sZ">User</Link>
    </section>
  </div>
);

export default Dashboard;
