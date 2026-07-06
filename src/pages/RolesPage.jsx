import { NavLink } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { Reveal } from '../components/RevealUtils'

const ROLES = [
  {
    icon: '👨‍🌾', label: 'Farmer', color: '#f0fdf4', accent: '#166534',
    text: 'Access advisories, report field issues, check verified inputs, plan your season, and submit input requests.',
    capabilities: ['View personalized advisories', 'Submit pest & disease reports', 'Browse verified agro-input stock', 'Manage season planner', 'Submit input requests', 'Track report status'],
  },
  {
    icon: '🧑‍💼', label: 'Extension Officer', color: '#eff6ff', accent: '#1e40af',
    text: 'Publish guidance, assign officers to field reports, register farmers, and manage incident response.',
    capabilities: ['Publish targeted advisories', 'Assign officers to incidents', 'Register and manage farmer profiles', 'Submit field reports', 'Track response queues', 'View all records'],
  },
  {
    icon: '🏪', label: 'Agro-Input Dealer', color: '#fff7ed', accent: '#9a3412',
    text: 'List verified stock, monitor field demand signals, and align supply with current extension guidance.',
    capabilities: ['List stock with photos', 'Update verification status', 'Monitor demand signals from reports', 'Track advisory-driven demand', 'Submit supply reports', 'View all inventory'],
  },
  {
    icon: '🏛️', label: 'District Agriculture Office', color: '#faf5ff', accent: '#6b21a8',
    text: 'Oversee district-wide activity, manage all incidents and advisories, and coordinate service delivery.',
    capabilities: ['District situation room', 'Manage all field reports', 'Publish and review advisories', 'Monitor supply visibility', 'View farmer coverage', 'Full records table'],
  },
]

function RolesPage() {
  return (
    <SiteLayout
      title="Who AgroLink is for"
      subtitle="Protected workspaces for every agricultural stakeholder in Bushenyi District."
    >
      <section className="lp-section lp-section-dark">
        <Reveal>
          <h2 className="lp-section-h2 lp-section-h2-light">
            Each role gets a workspace<br />built for their work.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="lp-section-lead lp-section-lead-light">
            Dashboard access is assigned after sign-in. Each user only sees the tools
            and records that match their operational responsibility.
          </p>
        </Reveal>
        <div className="lp-roles-grid lp-roles-grid-page">
          {ROLES.map((r, i) => (
            <Reveal key={r.label} delay={i * 100}>
              <div className="lp-role-card-full" style={{ '--role-color': r.color, '--role-accent': r.accent }}>
                <div className="lp-role-card-header">
                  <span className="lp-role-card-icon">{r.icon}</span>
                  <h3 className="lp-role-label" style={{ color: r.accent }}>{r.label}</h3>
                </div>
                <p className="lp-role-text">{r.text}</p>
                <ul className="lp-role-capabilities">
                  {r.capabilities.map(c => (
                    <li key={c}>
                      <span style={{ color: r.accent }}>✓</span> {c}
                    </li>
                  ))}
                </ul>
                <NavLink to="/access" className="lp-role-link" style={{ color: r.accent }}>
                  Access workspace →
                </NavLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  )
}

export default RolesPage
