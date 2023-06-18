import { ApolloLink } from '@apollo/client';
import { kebabCase, mapKeys } from 'lodash-es';

type AuthenticationInfo = {
  accessToken: string;
  client: string;
  uid: string;
};

const LOCALSTORAGE_KEY = 'nzif';

const getAuthenticationInfo = (): AuthenticationInfo | null => {
  const stored = localStorage.getItem(LOCALSTORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as AuthenticationInfo;
    if (!parsed.accessToken || !parsed.client || !parsed.uid) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveAuthenticationInfo = (info: AuthenticationInfo) => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(info));
};

export const clearAuthenticationInfo = () => {
  localStorage.removeItem(LOCALSTORAGE_KEY);
};

const authentication = new ApolloLink((operation, forward) => {
  const headers: Record<string, string> = {};

  const CSRFToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (CSRFToken) {
    headers['X-CSRF-Token'] = CSRFToken;
  }

  const authentication = getAuthenticationInfo();

  if (authentication) {
    Object.assign(
      headers,
      mapKeys(authentication, (_, key) => kebabCase(key))
    );
  }

  operation.setContext({
    headers,
  });

  return forward(operation);
});

export default authentication;
