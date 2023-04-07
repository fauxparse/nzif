import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import PlacenameProvider from './atoms/Placename/PlacenameProvider';
import { useContentPageQuery } from './contentful/types';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Footer from './organisms/Footer';
import Header from './organisms/Header';

const App: React.FC = () => {
  const { data } = useContentPageQuery({
    variables: { slug: 'code-of-conduct' },
    context: { clientName: 'contentful' },
  });

  return (
    <AuthenticationProvider>
      <PlacenameProvider>
        <div className="app">
          <Header />
          <main>
            {data?.pageCollection?.items?.[0]?.body?.json &&
              documentToReactComponents(data?.pageCollection?.items?.[0]?.body?.json)}
          </main>
          <Footer />
        </div>
      </PlacenameProvider>
    </AuthenticationProvider>
  );
};

export default App;
