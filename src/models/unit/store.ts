import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, UnitNode } from 'generated/graphql';
import { Unit } from '.';

export class UnitStore extends Store<Unit> {
  converter = {
    fromStore: (obj: UnitNode) => {
      return new Unit({
        ...(obj as any),
        rooms: obj.rooms?.map((o) => o.id),
      }).save();
    },
    toStore: (obj: Unit) => {
      return {
        id: obj.id,
        title: obj.title,
        floorPlan: obj.floorPlanFile,
        address: obj.address,
        city: obj.city,
        postalCode: obj.postalCode,
      };
    },
  };

  queryStrings = {
    single: `
      query Unit($id: ID!) {
        unit(id: $id) {
          id
          title
          floorPlan
          address
          city
          postalCode
          rooms {
            id
          }
        }
      }
    `,
    many: `
      query Units {
        units {
          id
          title
          floorPlan
          address
          city
          postalCode
          rooms {
            id
          }
        }
      } 
    `,
    upsert: `
      mutation UnitMutation($input: UnitUpsertInput!) {
        upsertUnit(input: $input) {
          unit {
            id
            title
            floorPlan
            address
            city
            postalCode
            rooms {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation UnitDelete($input: UnitDeleteInput!) {
        deleteUnit(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<Unit> {
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

    const obj = this.converter.fromStore(result.data?.unit!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<Unit>> {
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

    const objects = result.data?.units?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Unit>(objects);
  }

  async update(obj: Unit): Promise<Unit> {
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

    obj = this.converter.fromStore(result.data?.upsertUnit?.unit!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: Unit): Promise<Unit> {
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

    obj = this.converter.fromStore(result.data?.upsertUnit?.unit!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: Unit): Promise<Unit> {
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
