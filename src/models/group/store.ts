import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Query, GroupNode } from 'generated/graphql';
import { Group } from '.';

export class GroupStore extends Store<Group> {
  converter = {
    fromStore: (obj: GroupNode) => {
      return new Group({
        ...(obj as any),
        permissions: obj.permissions?.map((o) => o.id),
      }).save();
    },
    toStore: (obj: Group) => {
      return {
        id: obj.id,
        name: obj.name,
      };
    },
  };

  queryStrings = {
    single: `
      query Group($id: ID!) {
        group(id: $id) {
          id
          name
          permissions {
            id
          }
        }
      }
    `,
    many: `
      query Groups {
        groups {
          id
          name
          permissions {
            id
          }
        }
      } 
    `,
    upsert: `
      mutation GroupMutation($input: GroupUpsertInput!) {
        upsertGroup(input: $input) {
          group {
            id
            name
            permissions {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation GroupDelete($input: GroupDeleteInput!) {
        deleteGroup(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<Group> {
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

    const obj = this.converter.fromStore(result.data?.group!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<Group>> {
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

    const objects = result.data?.groups?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Group>(objects);
  }

  async delete(obj: Group): Promise<Group> {
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
}
