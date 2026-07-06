import { NavLink } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { Reveal } from '../components/RevealUtils'

const FEATURES = [
  { icon: '🔐', title: 'Role-based authentication', text: 'Each stakeholder (farmer, extension officer, dealer, district office) signs in to a protected workspace built for their specific responsibilities. No one sees more than they need.' },
  { icon: '🌾', title: 'Farmer registration & profiling', text: 'Register farmers by parish, production focus, and preferred communication channel. Profiles power advisory personalisation and extension support targeting.' },
  { icon: '⚠️', title: 'Pest & disease reporting', text: 'Farmers and officers log incidents with photo evidence, location, and severity. Reports trigger automatic officer assignment and status tracking.' },
  { icon: '📢', title: 'Advisory publishing & delivery', text: 'Extension officers publish targeted guidance for specific audiences. Farmers receive advisories matched to their production focus — not generic broadcasts.' },
  { icon: '📦', title: 'Agro-input marketplace', text: 'Dealers list verified seed, fertiliser, and agrochemical stock with quantities and status. Farmers browse and compare before visiting a dealer.' },
  { icon: '🏛️', title: 'District oversight dashboard', text: 'District offices get real-time visibility into incidents, advisories, supply, and farmer coverage — aggregated into one operational picture.' },
  { icon: '🖼️', title: 'Photo evidence uploads', text: 'Field reports and inventory listings support photo uploads via ImgBB — so officers see the actual damage and farmers see the actual product.' },
  { icon: '📋', title: 'Season planner & input requests', text: 'Farmers plan seasonal tasks and submit input requests that enter the supply tracking queue — giving dealers and officers advance visibility into demand.' },
]

function FeaturesPage() {
  return (
    <SiteLayout
      title="Platform Features"
      subtitle="Everything AgroLink enables across the agricultural ecosystem."
    >
      <section className="lp-section lp-section-white">
        <Reveal>
          <h2 className="lp-section-h2">
            What the platform<br />
            <span className="lp-green">enables.</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="lp-section-lead">
            AgroLink is not just an information page. It supports the full operational
            cycle — registration, reporting, advisory response, supply tracking,
            and district monitoring.
          </p>
        </Reveal>
        <div className="lp-features-grid lp-features-grid-page">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-text">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lp-cta-strip">
        <Reveal>
          <div className="lp-cta-strip-inner">
            <div>
              <h2 className="lp-cta-strip-h2">See it for yourself.</h2>
              <p className="lp-cta-strip-sub">Sign in or register to access your role's workspace.</p>
            </div>
            <NavLink to="/access" className="lp-cta-primary lp-cta-strip-btn">Get started →</NavLink>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  )
}

export default FeaturesPage
