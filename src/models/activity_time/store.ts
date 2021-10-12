import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, ActivityTimeNode } from 'generated/graphql';
import { ActivityTime } from '.';

export class ActivityTimeStore extends Store<ActivityTime> {
  converter = {
    fromStore: (obj: ActivityTimeNode) => {
      return new ActivityTime({
        ...(obj as any),
        participants: obj.participants?.map((o) => o.id),
        smallGroups: obj.smallGroups?.map((o) => o.id),
        startTime: new Date(obj.startTime),
        endTime: new Date(obj.endTime),
      }).save();
    },
    toStore: (obj: ActivityTime) => {
      return {
        id: obj.id,
        title: obj.title,
        startTime: obj.startTime,
        endTime: obj.endTime,
        participants: obj.participants.ids,
        smallGroups: obj.smallGroups.ids,
        room: obj.room?.id,
      };
    },
  };

  queryStrings = {
    single: `
      query ActivityTime($id: ID!) {
        activityTime(id: $id) {
          id
          title
          startTime
          endTime
          participants {
            id
          }
          room {
            id
          }
          smallGroups {
            id
          }
        }
      }
    `,
    many: `
      query ActivityTimes {
        activityTimes {
          id
          title
          startTime
          endTime
          participants {
            id
          }
          room {
            id
          }
          smallGroups {
            id
          }
        }
      } 
    `,
    upsert: `
      mutation ActivityTimeMutation($input: ActivityTimeUpsertInput!) {
        upsertActivityTime(input: $input) {
          activityTime {
            id
            startTime
            endTime
            title
            participants {
              id
            }
            room {
              id
            }
            smallGroups {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation ActivityTimeDelete($input: ActivityTimeDeleteInput!) {
        deleteActivityTime(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<ActivityTime> {
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

    const obj = this.converter.fromStore(result.data?.activityTime!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<ActivityTime>> {
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
      result.data?.activityTimes?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<ActivityTime>(objects);
  }

  async update(obj: ActivityTime): Promise<ActivityTime> {
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

    obj = this.converter.fromStore(
      result.data?.upsertActivityTime?.activityTime!
    );

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: ActivityTime): Promise<ActivityTime> {
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

    obj = this.converter.fromStore(
      result.data?.upsertActivityTime?.activityTime!
    );

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: ActivityTime): Promise<ActivityTime> {
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
