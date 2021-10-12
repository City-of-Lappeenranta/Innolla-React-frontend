import { ApolloClient, InMemoryCache, gql, FetchResult } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

export class GraphQL {
  client: ApolloClient<any>;
  uri: string;
  reducer: Function;

  constructor({ uri, reducer }: any) {
    this.reducer = reducer;
    this.uri = uri;
    this.client = new ApolloClient({
      cache: new InMemoryCache({
        resultCaching: false,
      }),
      link: createUploadLink({
        uri,
      }),
    });
  }

  update() {
    const token = localStorage.getItem('token');
    this.client = new ApolloClient({
      cache: new InMemoryCache({
        resultCaching: false,
      }),
      link: createUploadLink({
        uri: this.uri,
        headers: {
          Authorization: token ? 'JWT ' + token : undefined,
        },
      }),
    });
  }

  async query(query: string, variables: object) {
    this.update();
    try {
      const result: FetchResult = await this.client.query({
        query: gql(query),
        variables,
      });
      this.reducer(result);
      return result;
    } catch (error: unknown) {
      this.reducer(error as Error);
      return error as Error;
    }
  }

  async mutate(mutation: string, variables: object) {
    this.update();
    try {
      const result: FetchResult = await this.client.mutate({
        mutation: gql(mutation),
        variables,
      });
      this.reducer(result);
      return result;
    } catch (error: unknown) {
      this.reducer(error as Error);
      return error as Error;
    }
  }
}

export const GQL = new GraphQL({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  reducer: (result: FetchResult | Error) => {
    if (result instanceof Error) {
      const event = new CustomEvent('error', { detail: result });
      return window.dispatchEvent(event);
    }
  },
});
