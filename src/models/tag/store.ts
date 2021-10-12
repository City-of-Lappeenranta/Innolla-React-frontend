import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, TagNode } from 'generated/graphql';
import { Tag } from '.';
import { Profile } from 'models/profile';

export class TagStore extends Store<Tag> {
  converter = {
    fromStore: (obj: TagNode) => {
      return new Tag({
        ...(obj as any),
      }).save();
    },
    toStore: (obj: Tag) => {
      return {
        id: obj.id,
        title: obj.title,
        category: obj.category,
      };
    },
  };

  queryStrings = {
    single: `
      query Tag($id: ID!) {
        tag(id: $id) {
          id
          title
          category
        }
      }
    `,
    many: `
      query Tags {
        tags {
          id
          title
          category
        }
      } 
    `,
    upsert: `
      mutation TagMutation($input: TagUpsertInput!) {
        upsertTag(input: $input) {
          tag {
            id
            title
            category
          }
        }
      }
    `,
    delete: `
      mutation TagDelete($input: TagDeleteInput!) {
        deleteTag(input: $input){
          clientMutationId
        }
      }
    `,
    attach: `
      mutation ProfileTag($input: ProfileTagUpsertInput!) {
        upsertProfileTag(input: $input) {
          profileTag {
            profile {
              id
              tags {
                id
                title
                category
              }
            }
            tag {
              id
              title
              category
            }
          }
        }
      }
    `,
  };

  async forId(id: string): Promise<Tag> {
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

    const obj = this.converter.fromStore(result.data?.tag!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<Tag>> {
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

    const objects = result.data?.tags?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Tag>(objects);
  }

  async update(obj: Tag): Promise<Tag> {
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

    obj = this.converter.fromStore(result.data?.upsertTag?.tag!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async attach(tag: Tag, profile: Profile): Promise<Tag> {
    if (!tag.id) throw new Error("Can't update object without id.");

    this.setState(() => {
      this.loading = true;
    });

    const input = {
      tag: tag.id,
      profile: profile.id,
    };
    const result: FetchResult<Mutation> | Error = await GQL.mutate(
      this.queryStrings.attach,
      { input }
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't update with input: ${input}`);
    }

    tag = this.converter.fromStore(result.data?.upsertTag?.tag!);

    this.setState(() => {
      this.loading = false;
    });

    return tag;
  }

  async create(obj: Tag): Promise<Tag> {
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

    obj = this.converter.fromStore(result.data?.upsertTag?.tag!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: Tag): Promise<Tag> {
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
