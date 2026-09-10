import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "The philosophy — Samay" }] }),
  component: AboutPage,
});
function AboutPage() {
  return (
    <main className="content-page">
      <div className="page-intro">
        <p className="eyebrow">The philosophy</p>
        <h1>
          Time is more
          <br />
          than a number.
        </h1>
        <p>
          Samay is a small invitation to reconnect your daily life with the movement of the Sun and
          Moon.
        </p>
      </div>
      <section className="lesson-hero">
        <p className="eyebrow">समय · Time</p>
        <h2>
          An ancient language.
          <br />
          An everyday practice.
        </h2>
        <p>
          A clock can tell you how late you are. It can also help you notice where you are in the
          day. Samay puts the second idea first.
        </p>
      </section>
      <section className="reading-section">
        <h2>Start gently.</h2>
        <div className="reading-step">
          <span>01</span>
          <div>
            <h3>Meet the moment.</h3>
            <p>
              Open Today. Read the current muhūrta and see where its marker sits between sunrise and
              sunset.
            </p>
          </div>
        </div>
        <div className="reading-step">
          <span>02</span>
          <div>
            <h3>Find your chapter.</h3>
            <p>
              Use the prahar to recognise your broader part of the day. Notice how its length
              changes with the season.
            </p>
          </div>
        </div>
        <div className="reading-step">
          <span>03</span>
          <div>
            <h3>Learn one unit.</h3>
            <p>
              Keep modern time visible while ghaṭī and pal become familiar. There is no need to
              learn everything at once.
            </p>
          </div>
        </div>
      </section>
      <section className="reading-section">
        <h2>What the clock measures.</h2>
        <p>
          The solar dial divides daylight and night into fifteen muhūrtas each. Each half also
          contains four prahars. These are seasonal divisions: they change with your location and
          the time of year.
        </p>
        <p>
          Ghaṭī, pal and vipal are fixed units: 24 minutes, 24 seconds and 0.4 seconds respectively.
          A fixed muhūrta is 48 minutes. It should not be confused with the seasonal muhūrtas on the
          dial.
        </p>
        <p>
          Tithi, nakshatra, yoga and karaṇa are calculated with Swiss Ephemeris through the Hora
          library, using Lahiri ayanāṃśa and an offline ephemeris fallback. Vāra follows the local
          sunrise. Solar events use SunCalc. Small boundary differences between calculation methods
          are possible.
        </p>
        <p>
          The named muhūrta sequence and qualities follow the Drik Panchang Do Ghati reference.
          Names and traditional associations are a cultural reference. They vary across texts and
          communities; Samay does not present them as universal prescriptions.
        </p>
      </section>
      <section className="reading-section">
        <h2>Sources & conventions</h2>
        <p>
          <a
            href="https://www.drikpanchang.com/muhurat/daily/do-ghati-muhurat.html"
            target="_blank"
            rel="noreferrer"
          >
            Drik Panchang · Do Ghati muhūrta names
          </a>
          <br />
          The named sequence and associated traditional qualities. Samay separately uses fixed ghaṭī
          and pal for elapsed time.
        </p>
        <p>
          <a
            href="https://www.namami.gov.in/sites/default/files/Prakshika/Prakashika-44%20Brahmsiddhant-Final.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Brahmasiddhānta · National Mission for Manuscripts
          </a>
          <br />
          Background on traditional time units.
        </p>
        <p>
          <a href="https://www.npmjs.com/package/@siva-sh/hora" target="_blank" rel="noreferrer">
            Hora calculation library
          </a>
          <br />
          Lunar calculations, named timezones and documented conventions.
        </p>
      </section>
      <Link to="/" className="text-link">
        Return to this moment <ArrowRight size={16} />
      </Link>
    </main>
  );
}
