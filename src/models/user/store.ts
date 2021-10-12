import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, UserNode } from 'generated/graphql';
import { User } from '.';

export class UserStore extends Store<User> {
  converter = {
    fromStore: (obj: UserNode) => {
      return new User({
        ...(obj as any),
        groups: obj.groups?.map((o) => o.id),
      }).save();
    },
    toStore: (obj: User) => {
      return {
        id: obj.id,
        username: obj.username,
        email: obj.email,
        firstName: obj.firstName,
        lastName: obj.lastName,
        groups: obj._groups.ids,
      };
    },
  };

  queryStrings = {
    single: `
      query User($id: ID!) {
        user(id: $id) {
          id
          username
          email
          firstName
          lastName
          profile {
            id
          }
          groups {
            id
          }
        }
      }
    `,
    many: `
      query Users {
        users {
          id
          username
          email
          firstName
          lastName
          profile {
            id
          }
          groups {
            id
          }
        }
      } 
    `,
    upsert: `
      mutation UserMutation($input: UserUpsertInput!) {
        upsertUser(input: $input) {
          user {
            id
            username
            email
            firstName
            lastName
            profile {
              id
            }
            groups {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation UserDelete($input: UserDeleteInput!) {
        deleteUser(input: $input){
          clientMutationId
        }
      }
    `,
    current: `
      query CurrentUser {
        currentUser {
          id
          username
          firstName
          lastName
          email
          profile {
            id
          }
          groups {
            id
          }
        }
      }
    `,
    login: `
      mutation Login($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
          token
        }
      }
    `,
    logout: `
      mutation Logout {
        logoutMutation {
          loggedOut
        }
      }
    `,
  };

  async forId(id: string): Promise<User> {
    this.setState(() => {
      this.loading = true;
    });

    const result: FetchResult<Query> | Error = await GQL.query(
      this.queryStrings.single,
      { id }
    );
    if (result instanceof Error) {
      throw new Error(`Couldn't query object with id ${id}.`);
    }

    const obj = this.converter.fromStore(result.data?.user!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<User>> {
    this.setState(() => {
      this.loading = true;
    });

    const result: FetchResult<Query> | Error = await GQL.query(
      this.queryStrings.many,
      {}
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't query objects.`);
    }

    const objects = result.data?.users?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<User>(objects);
  }

  async update(obj: User): Promise<User> {
    if (!obj.id) throw new Error("Can't update object without id.");

    this.setState(() => {
      this.loading = true;
    });

    const input = this.converter.toStore(obj);
    const result: FetchResult<Mutation> | Error = await GQL.mutate(
      this.queryStrings.upsert,
      { input }
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't update with input: ${input}`);
    }

    obj = this.converter.fromStore(result.data?.upsertUser?.user!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: User): Promise<User> {
    this.setState(() => {
      this.loading = true;
    });

    const input = this.converter.toStore(obj);
    const result: FetchResult<Mutation> | Error = await GQL.mutate(
      this.queryStrings.upsert,
      { input }
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't create with input: ${input}`);
    }

    obj = this.converter.fromStore(result.data?.upsertUser?.user!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: User): Promise<User> {
    this.setState(() => {
      this.loading = true;
    });

    const input = { id: obj.id };
    const result: FetchResult<Query> | Error = await GQL.mutate(
      this.queryStrings.delete,
      { input }
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't delete object with input ${input}.`);
    }

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async login(user: User): Promise<void> {
    this.setState(() => {
      this.loading = true;
    });

    const credentials = {
      username: user.username,
      password: user.password,
    };
    const result: FetchResult<Mutation> | Error = await GQL.mutate(
      this.queryStrings.login,
      credentials
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't log in.`);
    }

    User.current.token = result.data?.tokenAuth?.token;

    this.setState(() => {
      this.loading = false;
    });
  }

  async logout(): Promise<void> {
    this.setState(() => {
      this.loading = true;
    });

    const result: FetchResult<Mutation> | Error = await GQL.mutate(
      this.queryStrings.logout,
      {}
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't log out.`);
    }

    this.setState(() => {
      this.loading = false;
    });
  }

  async current(): Promise<User> {
    this.setState(() => {
      this.loading = true;
    });

    const result: FetchResult<Query> | Error = await GQL.query(
      this.queryStrings.current,
      {}
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't query current user.`);
    }

    const obj = this.converter.fromStore(result.data?.currentUser!);
    User.current = obj;

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }
}
