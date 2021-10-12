import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Query, PermissionNode } from 'generated/graphql';
import { Permission } from '.';

export class PermissionStore extends Store<Permission> {
  converter = {
    fromStore: (obj: PermissionNode) => {
      return new Permission({
        ...(obj as any),
      }).save();
    },
    toStore: (obj: Permission) => {
      return {
        id: obj.id,
        name: obj.name,
        codename: obj.codename,
      };
    },
  };

  queryStrings = {
    single: `
      query Permission($id: ID!) {
        permission(id: $id) {
          id
          name
          codename
        }
      }
    `,
    many: `
      query Permissions {
        permissions {
          id
          name
          codename
        }
      } 
    `,
    upsert: `
      mutation PermissionMutation($input: PermissionUpsertInput!) {
        upsertPermission(input: $input) {
          permission {
            id
            name
            codename
          }
        }
      }
    `,
    delete: `
      mutation PermissionDelete($input: PermissionDeleteInput!) {
        deletePermission(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<Permission> {
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

    const obj = this.converter.fromStore(result.data?.permission!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<Permission>> {
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

    const objects =
      result.data?.permissions?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Permission>(objects);
  }

  async delete(obj: Permission): Promise<Permission> {
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
