import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'
import { Manager } from 'react-popper'
import client from '../lib/client'
import { RootPageTransition as PageTransition } from './page_transition'
import Admin from './admin'
import Festival, { CurrentFestival } from './festivals'
import Authentication from 'pages/authentication'
import Environment from './environment'
import { CurrentUserProvider } from 'contexts/current_user'
import { StaticContentProvider } from 'contexts/static_content'
import { AdminRoute } from './authorised_route'
import Returning from 'lib/returning'
import { ConfirmationManager } from 'molecules/confirmation'

import '../styles/application'

const getPageKey = location => {
  const key = location.pathname.split('/')[1]
  return key === 'signup' ? 'login' : key
}

export default class Application extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Manager>
            <StaticContentProvider>
              <ConfirmationManager>
                <Router>
                  <CurrentUserProvider>
                    <LastLocationProvider>
                      <Route
                        render={({ location }) => (
                          <PageTransition pageKey={getPageKey(location)}>
                            <Switch location={location}>
                              <AdminRoute
                                path="/admin/:year(\d{4})"
                                component={Admin}
                              />
                              <Route path="/:year(\d{4})" component={Festival} />
                              <Route
                                path="/:login(login|logout|signup|password)"
                                component={Authentication}
                              />
                              <Route path="/returning/:path*" component={Returning} />
                              <Route path="/:path*" component={CurrentFestival} />
                            </Switch>
                          </PageTransition>
                        )}
                      />
                    </LastLocationProvider>
                  </CurrentUserProvider>
                </Router>
                <Environment />
              </ConfirmationManager>
            </StaticContentProvider>
          </Manager>
        </ApolloHooksProvider>
      </ApolloProvider>
    )
  }
}
