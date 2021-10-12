import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { For, If } from 'react-extras';
import { Typography, ChipSet, Chip } from 'rmwc';
import { QuerySet } from '@dream/lucid-orm';

import { Dialog, Card, Grid, List } from 'utils/rmwc';
import { Profile, Tag } from 'models';
import { useSetState } from 'hooks';

interface Props {
  profile: Profile | undefined;
}

export function ProfileTagsView({ profile }: Props) {
  const setState = useSetState();
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const skills =
    profile?.tags.all().filter((o) => o.category === Tag.SKILLS) ??
    new QuerySet([]);
  const developmentTarget =
    profile?.tags.all().filter((o) => o.category === Tag.DEVELOPMENT_TARGET) ??
    new QuerySet([]);
  const pointOfInterests =
    profile?.tags.all().filter((o) => o.category === Tag.POINT_OF_INTERESTS) ??
    new QuerySet([]);
  const other =
    profile?.tags.all().filter((o) => o.category === Tag.OTHER) ??
    new QuerySet([]);

  async function getNext(action: string) {
    switch (action) {
      case 'close':
        return `/profile-cards/${profile?.id}`;
      case 'cancel':
        return `/profile-cards/${profile?.id}`;
      // case 'submit':
      //   return await createTag();
      default:
        return `/profile-cards/${profile?.id}`;
    }
  }

  async function onClosed(e: any) {
    const action: string = e.detail.action;
    const next = await getNext(action);
    history.push(next);
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onClosed={onClosed}
        className="mdc-dialog--fullwidth"
      >
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <Grid.Cell span={3}>
              <Card outlined>
                <CardTop>
                  <Typography use="subtitle1" tag="div">
                    Vahvuudet
                  </Typography>
                </CardTop>
                <List.Divider />
                <ChipSet>
                  <For
                    of={skills.toArray()}
                    render={(tag, index) => (
                      <Chip key={index}>{tag.title}</Chip>
                    )}
                  />
                  <If condition={!skills.length}>
                    <div style={{ padding: 10 }}>{'-'}</div>
                  </If>
                </ChipSet>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={3}>
              <Card outlined>
                <CardTop>
                  <Typography use="subtitle1" tag="div">
                    Harjoiteltavat asiat
                  </Typography>
                </CardTop>
                <List.Divider />
                <ChipSet>
                  <For
                    of={developmentTarget.toArray()}
                    render={(tag, index) => (
                      <Chip key={index}>{tag.title}</Chip>
                    )}
                  />
                  <If condition={!developmentTarget.length}>
                    <div style={{ padding: 10 }}>{'-'}</div>
                  </If>
                </ChipSet>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={3}>
              <Card outlined>
                <CardTop>
                  <Typography use="subtitle1" tag="div">
                    Kiinnostuksen kohteet
                  </Typography>
                </CardTop>
                <List.Divider />
                <ChipSet>
                  <For
                    of={pointOfInterests.toArray()}
                    render={(tag, index) => (
                      <Chip key={index}>{tag.title}</Chip>
                    )}
                  />
                  <If condition={!pointOfInterests.length}>
                    <div style={{ padding: 10 }}>{'-'}</div>
                  </If>
                </ChipSet>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={3}>
              <Card outlined>
                <CardTop>
                  <Typography use="subtitle1" tag="div">
                    Muuta huomioitavaa
                  </Typography>
                </CardTop>
                <List.Divider />
                <ChipSet>
                  <For
                    of={other.toArray()}
                    render={(tag, index) => (
                      <Chip key={index}>{tag.title}</Chip>
                    )}
                  />
                  <If condition={!other.length}>
                    <div style={{ padding: 10 }}>{'-'}</div>
                  </If>
                </ChipSet>
              </Card>
            </Grid.Cell>
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button action="close">Sulje</Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

function CardTop(props: any) {
  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        gridTemplateColumns: '1fr auto',
        padding: '0.5rem 1rem',
      }}
      {...props}
    />
  );
}
