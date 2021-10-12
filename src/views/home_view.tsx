import { User } from 'models';
import { Typography } from 'rmwc';
import HomeBackground from './graphics/home_view_background';

export default function HomeView() {
  const user = User.current;

  return (
    <>
      <Typography use="headline5" className="main-welcome-text">
        <b>
          <p>
            Tervetuloa <br />
            {user.name ?? ''}
          </p>
        </b>
        <HomeBackground></HomeBackground>
      </Typography>

      <div className="main-bottom-images">
        <img
          id="ophlogo"
          src="/img/oph_financing_valkoinen.png"
          alt="Opetusministeriö"
        />
        <img
          id="lprlogo"
          src="/img/lappeenranta_valkoinen.svg"
          alt="Lappeenranta"
        />
        <img id="innlogo" src="/img/Innolla_logo_lapset.png" alt="Innolla" />
      </div>
    </>
  );
}
