import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, ProfileNode } from 'generated/graphql';
import { Profile } from '.';
import { SmallGroup } from 'models/small_group';

export class ProfileStore extends Store<Profile> {
  converter = {
    fromStore: (obj: ProfileNode) => {
      return new Profile({
        ...(obj as any),
        tags: obj.tags?.map((o) => o.id),
        activities: obj.activities?.map((o) => o?.id),
        assessments: obj.assessments?.map((o) => o?.id),
      }).save();
    },
    toStore: (obj: Profile) => {
      return {
        id: obj.id,
        picture: obj.pictureFile,
        unit: obj.unit?.id,
        user: obj.user?.id,
      };
    },
  };

  queryStrings = {
    single: `
      query Profile($id: ID!) {
        profile(id: $id) {
          id
          picture
          unit {
            id
          }
          user {
            id
          }
          tags {
            id
          }
          activities {
            id
          }
          assessments {
            id
          }
        }
      }
    `,
    many: `
      query Profiles($group: ID) {
        profiles(group: $group) {
          id
          picture
          unit {
            id
          }
          user {
            id
          }
          tags {
            id
          }
          activities {
            id
          }
          assessments {
            id
          }
        }
      }
    `,
    upsert: `
      mutation ProfileMutation($input: ProfileUpsertInput!) {
        upsertProfile(input: $input) {
          profile {
            id
            picture
            unit {
              id
            }
            user {
              id
            }
            tags {
              id
            }
            activities {
              id
            }
            assessments {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation ProfileDelete($input: ProfileDeleteInput!) {
        Profile(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<Profile> {
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

    const obj = this.converter.fromStore(result.data?.profile!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<Profile>> {
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

    const objects = result.data?.profiles?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Profile>(objects);
  }

  async forGroup(group: SmallGroup): Promise<QuerySet<Profile>> {
    this.setState(() => {
      this.loading = true;
    });

    const result: FetchResult<Query> | Error = await GQL.query(
      this.queryStrings.many,
      { group: group.id }
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't query objects.`);
    }

    const objects = result.data?.profiles?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Profile>(objects);
  }

  async update(obj: Profile): Promise<Profile> {
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

    obj = this.converter.fromStore(result.data?.upsertProfile?.profile!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: Profile): Promise<Profile> {
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

    obj = this.converter.fromStore(result.data?.upsertProfile?.profile!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: Profile): Promise<Profile> {
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
