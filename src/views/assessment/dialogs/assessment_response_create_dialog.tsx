import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useQuery } from 'hooks';
import { Dialog, Grid } from 'utils/rmwc';
import { Assessment, AssessmentQuestion, AssessmentResponse } from 'models';
import { useForm } from 'form';
import * as field from '../fields';
interface Form {
  answer?: string;
}

export function AssessmentResponseCreateDialog() {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { id = null }: any = useParams();
  const questionId = useQuery().get('question')!;
  const ofId = useQuery().get('of')!;

  const assessment: Assessment | undefined = Assessment.state.forId(id);

  const question: AssessmentQuestion | undefined =
    AssessmentQuestion.state.forId(questionId);

  const { Form } = useForm<Form>({
    onSubmit: async (values: Form) => {
      return await AssessmentResponse.store.create(
        new AssessmentResponse({
          assessment: id,
          question: questionId as any,
          of: ofId,
          answer: values.answer,
        })
      );
    },
    afterSubmit: () => {
      Assessment.store.forId(assessment?.id!);
      history.push(`/assessments/${assessment?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/assessments/${assessment?.id}`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>{question?.text}</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.Answer />
          </Grid>
        </Dialog.Content>

        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peruuta
          </Dialog.Button>
          <Dialog.Button action="submit" raised>
            Vastaa
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}
