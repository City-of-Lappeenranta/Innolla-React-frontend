import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, RoomNode } from 'generated/graphql';
import { Room } from '.';

export class RoomStore extends Store<Room> {
  converter = {
    fromStore: (obj: RoomNode) => {
      return new Room({
        ...(obj as any),
        activities: obj.activities?.map((o) => o.id),
      }).save();
    },
    toStore: (obj: Room) => {
      return {
        id: obj.id,
        title: obj.title,
        capacity: obj.capacity,
        image: obj.imageFile,
        unit: obj.unit?.id,
      };
    },
  };

  queryStrings = {
    single: `
      query Room($id: ID!) {
        room(id: $id) {
          id
          title
          capacity
          image
          unit {
            id
          }
          activities {
            id
          }
        }
      }
    `,
    many: `
      query Rooms {
        rooms {
          id
          title
          capacity
          image
          unit {
            id
          }
          activities {
            id
          }
        }
      } 
    `,
    upsert: `
      mutation RoomMutation($input: RoomUpsertInput!) {
        upsertRoom(input: $input) {
          room {
            id
            title
            capacity
            image
            unit {
              id
            }
            activities {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation RoomDelete($input: RoomDeleteInput!) {
        deleteRoom(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<Room> {
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

    const obj = this.converter.fromStore(result.data?.room!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<Room>> {
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

    const objects = result.data?.rooms?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Room>(objects);
  }

  async reservable(): Promise<QuerySet<Room>> {
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

    const objects = result.data?.rooms?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Room>(objects);
  }

  async update(obj: Room): Promise<Room> {
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

    obj = this.converter.fromStore(result.data?.upsertRoom?.room!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: Room): Promise<Room> {
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

    obj = this.converter.fromStore(result.data?.upsertRoom?.room!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: Room): Promise<Room> {
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
