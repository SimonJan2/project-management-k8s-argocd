import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          }
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

// Get the backend URL from environment variable or construct it from window.location
const getBackendUrl = () => {
  if (process.env.REACT_APP_CLIENT_GRAPHQL) {
    return process.env.REACT_APP_CLIENT_GRAPHQL;
  }
  
  // If we're accessing via LoadBalancer IP, use that
  if (window.location.hostname.startsWith('10.')) {
    return `http://${window.location.hostname}:5000/graphql`;
  }
  
  // Default to localhost
  return 'http://localhost:5000/graphql';
};

const client = new ApolloClient({
  uri: getBackendUrl(),
  cache,
});

export default client;
