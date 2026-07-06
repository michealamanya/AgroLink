import { NavLink } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { Reveal } from '../components/RevealUtils'

const STEPS = [
  { n: '01', icon: '🌱', title: 'Register your farm profile', body: 'Farmers and extension officers create a profile with parish, production focus, and contact channel. Takes under 2 minutes.', detail: 'Name · Parish · Crop focus · Contact channel' },
  { n: '02', icon: '⚠️', title: 'Report field issues instantly', body: 'Log a pest, disease, or weather damage the moment you see it. Extension officers are notified and assigned automatically.', detail: 'Pest/disease · Location · Severity level' },
  { n: '03', icon: '📢', title: 'Receive targeted advisories', body: 'Extension teams publish guidance matched to your crop focus. You get relevant advice — not generic broadcasts.', detail: 'SMS · Mobile web · Field bulletin' },
  { n: '04', icon: '📦', title: 'Find verified agro-inputs', body: 'Check which dealers have verified seed, spray, or fertiliser in stock near you before you make the trip.', detail: 'Verified stock · Dealer name · Quantity' },
  { n: '05', icon: '🏛️', title: 'District teams monitor everything', body: 'District agriculture offices get a real-time operational picture — incidents, advisories, supply, and farmer coverage — from one dashboard.', detail: 'Reports · Advisories · Stock · Farmers' },
]

function HowItWorksPage() {
  return (
    <SiteLayout
      title="How AgroLink Works"
      subtitle="Five simple steps from field problem to coordinated response."
    >
      <section className="lp-section lp-section-soft">
        <Reveal>
          <h2 className="lp-section-h2">
            Simple as<br />
            <span className="lp-green">sending a message.</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="lp-section-lead">
            AgroLink is built for the realities of agriculture in Uganda.
            No complex training — just a clear workflow from field to district.
          </p>
        </Reveal>
        <div className="lp-steps lp-steps-page">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 100}>
              <div className="lp-step">
                <div className="lp-step-left">
                  <div className="lp-step-icon">{step.icon}</div>
                  <div className="lp-step-line" />
                </div>
                <div className="lp-step-body">
                  <span className="lp-step-num">{step.n}</span>
                  <h3 className="lp-step-title">{step.title}</h3>
                  <p className="lp-step-text">{step.body}</p>
                  <div className="lp-step-detail">{step.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lp-cta-strip">
        <Reveal>
          <div className="lp-cta-strip-inner">
            <div>
              <h2 className="lp-cta-strip-h2">Ready to get started?</h2>
              <p className="lp-cta-strip-sub">Register with the role that matches your responsibility.</p>
            </div>
            <NavLink to="/access" className="lp-cta-primary lp-cta-strip-btn">Get started →</NavLink>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  )
}

export default HowItWorksPage
