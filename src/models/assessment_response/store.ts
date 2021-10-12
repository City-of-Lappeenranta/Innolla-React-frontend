import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, AssessmentResponseNode } from 'generated/graphql';
import { AssessmentResponse } from '.';
import { Assessment } from 'models/assessment';

export class AssessmentResponseStore extends Store<AssessmentResponse> {
  converter = {
    fromStore: (obj: AssessmentResponseNode) => {
      return new AssessmentResponse({
        ...(obj as any),
      }).save();
    },
    toStore: (obj: AssessmentResponse) => {
      return {
        id: obj.id,
        of: obj.of,
        answer: obj.answer,
        assessment: obj.assessment?.id,
        question: obj.question?.id,
      };
    },
  };

  queryStrings = {
    single: `
      query AssessmentResponse($id: ID!) {
        assessmentResponse(id: $id) {
          id
          of
          answer
          assessment {
            id
          }
          question {
            id
          }
        }
      }
    `,
    many: `
      query AssessmentResponses($assessment: ID) {
        assessmentResponses(assessment: $assessment) {
          id
          of
          answer
          assessment {
            id
          }
          question {
            id
          }
        }
      } 
    `,
    upsert: `
      mutation AssessmentResponseMutation($input: AssessmentResponseUpsertInput!) {
        upsertAssessmentResponse(input: $input) {
          assessmentResponse {
            id
            of
            answer
            assessment {
              id
            }
            question {
              id
            }
          }
        }
      }
    `,
    delete: `
      mutation AssessmentResponseDelete($input: AssessmentResponseDeleteInput!) {
        deleteAssessmentResponse(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<AssessmentResponse> {
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

    const obj = this.converter.fromStore(result.data?.assessmentResponse!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<AssessmentResponse>> {
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
      result.data?.assessmentResponses?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<AssessmentResponse>(objects);
  }

  async forAssessment(
    assessment: Assessment
  ): Promise<QuerySet<AssessmentResponse>> {
    this.setState(() => {
      this.loading = true;
    });

    const result: FetchResult<Query> | Error = await GQL.query(
      this.queryStrings.many,
      { assessment: assessment.id }
    );

    if (result instanceof Error) {
      throw new Error(`Couldn't query objects.`);
    }

    const objects =
      result.data?.assessmentResponses?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<AssessmentResponse>(objects);
  }

  async update(obj: AssessmentResponse): Promise<AssessmentResponse> {
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
      result.data?.upsertAssessmentResponse?.assessmentResponse!
    );

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: AssessmentResponse): Promise<AssessmentResponse> {
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
      result.data?.upsertAssessmentResponse?.assessmentResponse!
    );

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: AssessmentResponse): Promise<AssessmentResponse> {
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
