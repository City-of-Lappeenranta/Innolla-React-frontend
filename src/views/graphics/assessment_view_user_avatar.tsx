import { useParams } from 'react-router-dom';
import { If } from 'react-extras';
import { Typography } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { ActivityTime, Assessment, Profile, User } from 'models';

export default function AssessmentAvatar() {
  const setState = useSetState();
  const { id = null }: any = useParams();
  const assessment: Assessment | undefined = Assessment.state.forId(id);

  useAsyncEffect(async (isMounted) => {
    Assessment.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Profile.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    User.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    ActivityTime.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    const assessment = await Assessment.store.forId(id);
    ActivityTime.store.forId(assessment._ofActivity.id!);
    const profile = await Profile.store.forId(assessment._ofChild.id!);
    User.store.forId(profile._user.id!);
  }, []);

  return (
    <>
      <div className="mdc-layout-grid__profile-details__usercard__inner">
        <div className="mdc-layout-grid__profile-details__usercard__inner__avatar">
          <If condition={!!assessment?.ofChild?.picture}>
            <img src={assessment?.ofChild?.picture} alt="Käyttäjän kuva" />
          </If>
          <div style={{ padding: '0 0rem 0rem 0rem' }}>
            <Typography
              className="mdc-layout-grid__assessment-details__usercard__inner__avatar__activity-titlename"
              use="headline6"
              tag="h2"
            >
              {assessment?.ofChild?.user?.name ?? '-'}
            </Typography>

            <Typography
              className="mdc-layout-grid__assessment-details__usercard__inner__avatar__activity-title"
              use="headline6"
              tag="h2"
            >
              {assessment?.ofActivity?.title ?? '-'}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}
