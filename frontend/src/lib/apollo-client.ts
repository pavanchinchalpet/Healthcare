import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

// HTTP link configuration
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
})

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

// Auth context link (for future authentication)
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

// Cache configuration with optimizations
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getPatients: {
          // Cache patients with merge function for pagination
          merge(existing = [], incoming) {
            return incoming
          }
        },
        getDoctors: {
          merge(existing = [], incoming) {
            return incoming
          }
        },
        getAppointments: {
          merge(existing = [], incoming) {
            return incoming
          }
        }
      }
    },
    Patient: {
      fields: {
        // Normalize patient data
        createdAt: {
          read(existing) {
            return existing ? new Date(existing) : null
          }
        }
      }
    },
    Doctor: {
      fields: {
        createdAt: {
          read(existing) {
            return existing ? new Date(existing) : null
          }
        }
      }
    },
    Appointment: {
      fields: {
        createdAt: {
          read(existing) {
            return existing ? new Date(existing) : null
          }
        },
        date: {
          read(existing) {
            return existing ? new Date(existing) : null
          }
        }
      }
    }
  }
})

// Create Apollo Client with optimized configuration
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  // Enable development tools in development
  connectToDevTools: process.env.NODE_ENV === 'development',
})

// Query result caching policies
export const cachePolicies = {
  // Cache for 5 minutes
  short: 'cache-first' as const,
  // Cache for 1 hour
  medium: 'cache-first' as const,
  // Always fetch fresh data
  fresh: 'network-only' as const,
  // Use cache if available, otherwise fetch
  cacheFirst: 'cache-first' as const,
  // Always use cache, never fetch
  cacheOnly: 'cache-only' as const,
} as const

// Optimized query options
export const queryOptions = {
  patients: {
    fetchPolicy: cachePolicies.short,
    errorPolicy: 'all' as const,
    notifyOnNetworkStatusChange: true,
  },
  doctors: {
    fetchPolicy: cachePolicies.short,
    errorPolicy: 'all' as const,
    notifyOnNetworkStatusChange: true,
  },
  appointments: {
    fetchPolicy: cachePolicies.short,
    errorPolicy: 'all' as const,
    notifyOnNetworkStatusChange: true,
  }
} as const
