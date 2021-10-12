import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useAsyncEffect } from 'hooks';
import { Dialog, Grid } from 'utils/rmwc';
import { Profile, Tag } from 'models';
import { FilterSelectField } from 'views/generic/filter_select_field';

interface Props {
  profile: Profile | undefined;
  setState: Function;
}

export function ProfileTagAttachView({ profile, setState }: Props) {
  const history = useHistory();
  const [tagId, setTagId] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const { tagCategory = null }: any = useParams();

  useAsyncEffect(async (isMounted) => {
    Tag.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Tag.store.all();
  }, []);

  async function attachTag() {
    await Tag.store.attach(Tag.state.forId(tagId!)!, profile!);
    await Profile.store.forId(profile?.id!);
    setState();
    return `/profile-cards/${profile?.id}`;
  }

  async function getNext(action: string) {
    switch (action) {
      case 'close':
        return `/profile-cards/${profile?.id}`;
      case 'cancel':
        return `/profile-cards/${profile?.id}`;
      case 'submit':
        return await attachTag();
      default:
        return `/profile-cards/${profile?.id}`;
    }
  }

  async function onClosed(e: any) {
    const action: string = e.detail.action;
    const next = await getNext(action);
    history.push(next);
  }

  const tags = Tag.state
    .all()
    .filter((o) => !profile?.tags.all().toArray().includes(o))
    .filter((o) => o.category === tagCategory)
    .toArray()
    .map((obj: any) => {
      return { label: obj.title, value: obj.id };
    });

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>{getTitle(tagCategory)}</Dialog.Title>
        <Dialog.Content style={{ paddingTop: 16 }}>
          <Grid style={{ padding: 0 }}>
            <Grid.Cell span={12}>
              <FilterSelectField
                label="Hae "
                items={tags}
                onChange={(id: string) => {
                  setTagId(id);
                }}
                onCreate={async (text: string) => {
                  await Tag.store.create(
                    new Tag({
                      category: tagCategory,
                      title: text,
                    })
                  );
                  setState();
                }}
              />
            </Grid.Cell>
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peru
          </Dialog.Button>
          <Dialog.Button
            action="submit"
            raised
            isDefaultAction
            disabled={!tagId}
          >
            Lisää
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

function getTitle(cateory: string) {
  switch (cateory) {
    case Tag.SKILLS:
      return 'Lisää vahvuus';
    case Tag.POINT_OF_INTERESTS:
      return 'Lisää kiinnostuksen kohde';
    case Tag.DEVELOPMENT_TARGET:
      return 'Lisää harjoiteltava asia';
    case Tag.OTHER:
      return 'Lisää muuta huomioitavaa';
    default:
      return '';
  }
}
