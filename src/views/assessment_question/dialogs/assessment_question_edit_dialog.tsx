import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Dialog, Grid } from 'utils/rmwc';
import { AssessmentQuestion } from 'models/assessment_question';
import { useForm } from 'form';
import * as field from '../fields';

interface Props {
  question: AssessmentQuestion | undefined;
}

interface Form extends AssessmentQuestion {}

export function AssessmentQuestionEditDialog({ question }: Props) {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<Form>({
    defaultValues: question,
    onSubmit: async (values: Form) => {
      Object.assign(question!, values);
      return await AssessmentQuestion.store.update(question!);
    },
    afterSubmit: (question: AssessmentQuestion) => {
      history.push(`/assessment-questions/${question?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/assessment-questions/${question?.id}`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Muokkaa arviointikysymystä</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.Of />
            <field.Text />
          </Grid>
        </Dialog.Content>

        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peruuta
          </Dialog.Button>
          <Dialog.Button type="submit" raised>
            Muokkaa
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}
