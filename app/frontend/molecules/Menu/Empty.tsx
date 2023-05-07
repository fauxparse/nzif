import React, { PropsWithChildren } from 'react';

const Empty: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="menu__empty">{children}</div>
);

export default Empty;
