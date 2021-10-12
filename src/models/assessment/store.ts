import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, AssessmentNode } from 'generated/graphql';
import { Assessment } from '.';
import { Profile } from 'models/profile';
import { ActivityTime } from 'models/activity_time';

export class AssessmentStore extends Store<Assessment> {
  converter = {
    fromStore: (obj: AssessmentNode) => {
      return new Assessment({
        ...(obj as any),
        responses: obj.responses?.map((o) => o.id),
      }).save();
    },
    toStore: (obj: Assessment) => {
      return {
        id: obj.id,
        rating: obj.rating,
        ofChild: obj.ofChild?.id,
        ofActivity: obj.ofActivity?.id,
      };
    },
  };

  queryStrings = {
    single: `
      query Assessment($id: ID!) {
        assessment(id: $id) {
          id
          rating
          ofChild {
            id
          }
          ofActivity {
            id
          }
          responses {
            id
          }
        }
      }
    `,
    many: `
      query Assessments {
        assessments {
          id
          rating
          ofChild {
            id
          }
          ofActivity {
            id
          }
          responses {
            id
          }
        }
      } 
    `,
    upsert: `
      mutation AssessmentMutation($input: AssessmentUpsertInput!) {
        upsertAssessment(input: $input) {
          assessment {
            id
            rating
            ofChild {
              id
            }
            ofActivity {
              id
            }
            responses {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation AssessmentDelete($input: AssessmentDeleteInput!) {
        deleteAssessment(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forChildAndActivity(
    ofChild: Profile,
    ofActivity: ActivityTime
  ): Promise<Assessment> {
    this.setState(() => {
      this.loading = true;
    });

    const result: FetchResult<Query> | Error = await GQL.query(
      this.queryStrings.single,
      { ofChild, ofActivity }
    );
    if (result instanceof Error) {
      throw new Error(
        `Couldn't query object with child ${ofChild.id} and activity ${ofActivity.id}.`
      );
    }

    const obj = this.converter.fromStore(result.data?.assessment!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async forId(id: string): Promise<Assessment> {
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

    const obj = this.converter.fromStore(result.data?.assessment!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<Assessment>> {
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
      result.data?.assessments?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<Assessment>(objects);
  }

  async update(obj: Assessment): Promise<Assessment> {
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

    obj = this.converter.fromStore(result.data?.upsertAssessment?.assessment!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: Assessment): Promise<Assessment> {
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

    obj = this.converter.fromStore(result.data?.upsertAssessment?.assessment!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: Assessment): Promise<Assessment> {
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
