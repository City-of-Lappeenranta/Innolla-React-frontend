import { If } from 'react-extras';
import { useRouteMatch } from 'react-router-dom';
import { Typography } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { Profile } from 'models';

export default function UserAvatar() {
  const setState = useSetState();
  const { id = null }: any = useRouteMatch().params;
  const profile: Profile | undefined = Profile.state
    .all()
    .find((o) => o.id === id);

  useAsyncEffect(async (isMounted) => {
    if (!isMounted()) return;
    Profile.store.forId(id);
    setState();
  }, []);

  const hasPicture: any = profile?.picture;

  return (
    <>
      <div className="mdc-layout-grid__profile-details__usercard__inner">
        <div className="mdc-layout-grid__profile-details__usercard__inner__avatar">
          <If condition={hasPicture}>
            <img src={profile?.picture} alt="Käyttäjän kuva" />
          </If>
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
            <Typography
              className="mdc-layout-grid__profile-details__usercard__inner__avatar__username-text"
              use="headline6"
              tag="h2"
            >
              {profile?.user?.name ?? '-'}
            </Typography>

            <Typography
              className="mdc-layout-grid__profile-details__usercard__inner__avatar__unit-text"
              use="headline6"
              tag="h2"
            >
              {`${profile?.unit?.title} `}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}
