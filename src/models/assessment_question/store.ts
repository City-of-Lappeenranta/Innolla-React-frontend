import { FetchResult } from '@apollo/client';
import { QuerySet, Store } from '@dream/lucid-orm';

import { GQL } from 'utils/gql';
import { Mutation, Query, AssessmentQuestionNode } from 'generated/graphql';
import { AssessmentQuestion } from '.';

export class AssessmentQuestionStore extends Store<AssessmentQuestion> {
  converter = {
    fromStore: (obj: AssessmentQuestionNode) => {
      return new AssessmentQuestion({
        ...(obj as any),
      }).save();
    },
    toStore: (obj: AssessmentQuestion) => {
      return {
        id: obj.id,
        of: obj.of,
        text: obj.text,
      };
    },
  };

  queryStrings = {
    single: `
      query AssessmentQuestion($id: ID!) {
        assessmentQuestion(id: $id) {
          id
          of
          text
        }
      }
    `,
    many: `
      query AssessmentQuestions {
        assessmentQuestions {
          id
          of
          text
        }
      } 
    `,
    upsert: `
      mutation AssessmentQuestionMutation($input: AssessmentQuestionUpsertInput!) {
        upsertAssessmentQuestion(input: $input) {
          assessmentQuestion {
            id
            of
            text
          }
        }
      }
    `,
    delete: `
      mutation AssessmentQuestionDelete($input: AssessmentQuestionDeleteInput!) {
        deleteAssessmentQuestion(input: $input){
          clientMutationId
        }
      }
    `,
  };

  async forId(id: string): Promise<AssessmentQuestion> {
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

    const obj = this.converter.fromStore(result.data?.assessmentQuestion!);

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async all(): Promise<QuerySet<AssessmentQuestion>> {
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
      result.data?.assessmentQuestions?.map(this.converter.fromStore) ?? [];

    this.setState(() => {
      this.loading = false;
    });

    return new QuerySet<AssessmentQuestion>(objects);
  }

  async update(obj: AssessmentQuestion): Promise<AssessmentQuestion> {
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
      result.data?.upsertAssessmentQuestion?.assessmentQuestion!
    );

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async create(obj: AssessmentQuestion): Promise<AssessmentQuestion> {
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
      result.data?.upsertAssessmentQuestion?.assessmentQuestion!
    );

    this.setState(() => {
      this.loading = false;
    });

    return obj;
  }

  async delete(obj: AssessmentQuestion): Promise<AssessmentQuestion> {
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
