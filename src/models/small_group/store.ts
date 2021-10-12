import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, SmallGroupNode } from 'generated/graphql';
import { SmallGroup } from '.';
import { Unit } from 'models/unit';

export class SmallGroupStore extends Store<SmallGroup> {
  converter = {
    fromStore: (obj: SmallGroupNode) => {
      new Unit(obj.unit as any).save();
      return new SmallGroup({
        ...(obj as any),
        unit: obj.unit?.id as any,
        profiles: obj.profiles?.map((o) => o.id),
      }).save();
    },
    toStore: (obj: SmallGroup) => {
      return {
        id: obj.id,
        title: obj.title,
        unit: obj.unit?.id,
        profiles: obj.profiles.ids,
      };
    },
  };

  queryStrings = {
    single: `
      query SmallGroup($id: ID!) {
        smallGroup(id: $id) {
          id
          title
          unit {
            id
            title
          }
          profiles {
            id
          }
        }
      }
    `,
    many: `
      query SmallGroups {
        smallGroups {
          id
          title
          unit {
            id
            title
          }
          profiles {
            id
          }
        }
      } 
    `,
    upsert: `
      mutation SmallGroupMutation($input: SmallGroupUpsertInput!) {
        upsertSmallGroup(input: $input) {
          smallGroup {
            id
            title
            unit {
              id
              title
            }
            profiles {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation SmallGroupDelete($input: SmallGroupDeleteInput!) {
        deleteSmallGroup(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<SmallGroup> {
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

    const obj = this.converter.fromStore(result.data?.smallGroup!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<SmallGroup>> {
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
      result.data?.smallGroups?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<SmallGroup>(objects);
  }

  async update(obj: SmallGroup): Promise<SmallGroup> {
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

    obj = this.converter.fromStore(result.data?.upsertSmallGroup?.smallGroup!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: SmallGroup): Promise<SmallGroup> {
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

    obj = this.converter.fromStore(result.data?.upsertSmallGroup?.smallGroup!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: SmallGroup): Promise<SmallGroup> {
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
