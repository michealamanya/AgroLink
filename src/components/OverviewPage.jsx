import { NavLink } from 'react-router-dom'
import homeBackground from '../assets/background.jpg'
import {
  aboutHighlights,
  contactChannels,
  footerColumns,
  homeAudience,
  homeBenefits,
  homeFeatureGroups,
  publicNavLinks,
  quickStats,
  roleCards,
  spotlightModules,
} from '../data/appData'

function FeatureIcon({ type }) {
  const icons = {
    sprout: (
      <path d="M12 4c3.5 1.1 5.5 4 5.5 7.4 0 3.8-2.7 6.5-6.5 8.6-3.8-2.1-6.5-4.8-6.5-8.6C4.5 8 7 5.1 12 4Zm0 4.2c-1.8 0-3.2 1.4-3.2 3.2 0 1.6 1 2.8 3.2 4.4 2.2-1.6 3.2-2.8 3.2-4.4 0-1.8-1.4-3.2-3.2-3.2Z" />
    ),
    pulse: (
      <path
        d="M4 12h4l2.2-4.2L13 16l2.2-4H20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    supply: (
      <path
        d="M5 8.2 12 4l7 4.2V16L12 20 5 16V8.2Zm7 1.3-4.8-2.9m4.8 2.9 4.8-2.9M12 9.5V20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    insight: (
      <path
        d="M5 18V9m4 9V6m4 12v-5m4 5V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    ),
    field: (
      <path
        d="M6 18c2.2-4.3 5-6.5 6-7.2 1 .7 3.8 2.9 6 7.2M12 10V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    support: (
      <>
        <path
          d="M12 5a5 5 0 0 1 5 5v3a2 2 0 0 1-2 2h-1.2a3 3 0 0 1-3 2h-1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="17" r="1.7" />
      </>
    ),
    store: (
      <path
        d="M5 10h14v8H5zM7 10V7h10v3M9 14h2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    civic: (
      <path
        d="M4 19h16M6.5 19v-7m3.5 7v-7m3.5 7v-7m3.5 7v-7M4 9l8-4 8 4M5 9h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  }

  return (
    <span className="icon-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24">{icons[type]}</svg>
    </span>
  )
}

function OverviewPage() {
  return (
    <section
      className="page-grid home-page"
      style={{
        '--home-background-image': `url(${homeBackground})`,
      }}
    >
      <article className="content-card full-span public-nav-shell">
        <div className="public-nav">
          <div className="public-brand">
            <span className="eyebrow">AgroLink Platform</span>
            <strong>Smart agricultural service delivery for Bushenyi District</strong>
          </div>
          <div className="public-nav-links">
            {publicNavLinks.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <NavLink to="/access" className="public-nav-cta">
              Sign in
            </NavLink>
          </div>
        </div>
      </article>

      <article className="hero-panel overview-hero">
        <div className="hero-copy-block">
          <span className="eyebrow">Smart Agricultural Information Platform</span>
          <h2>
            One platform for agricultural information, field reporting, and
            agro-input service delivery.
          </h2>
          <p>
            AgroLink helps farmers, extension officers, agro-input dealers, and
            district agriculture offices work together more effectively. It is
            designed to improve communication, advisory services, disease and
            pest reporting, and oversight of agricultural activities.
          </p>
          <div className="hero-cta-row">
            <NavLink to="/access" className="primary-button">
              Sign in to continue
            </NavLink>
          </div>
        </div>

        <div className="hero-illustration-card">
          <div className="hero-illustration">
            <div className="field-wave field-wave-one" />
            <div className="field-wave field-wave-two" />
            <div className="field-wave field-wave-three" />
            <div className="illustration-sun" />
            <div className="illustration-panel illustration-panel-left">
              <strong>Field reporting</strong>
              <span>Early alerts move faster</span>
            </div>
            <div className="illustration-panel illustration-panel-right">
              <strong>District visibility</strong>
              <span>Shared operational picture</span>
            </div>
          </div>

          <div className="stat-grid compact-stat-grid">
            {quickStats.map((item) => (
              <div key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="content-card" id="about">
        <div className="section-title">
          <span className="eyebrow">About The Platform</span>
          <h3>Built for trusted, coordinated agricultural service delivery</h3>
        </div>
        <p className="section-lead">
          AgroLink combines agricultural information sharing, extension support,
          and agro-input visibility into one professional web platform for both
          mobile and desktop use.
        </p>
        <div className="feature-grid">
          {aboutHighlights.map((item) => (
            <div key={item.title} className="feature-card feature-card-soft">
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Core Platform Areas</span>
          <h3>What the system already supports</h3>
        </div>
        <div className="bullet-grid">
          {spotlightModules.map((item) => (
            <div key={item} className="bullet-card">
              {item}
            </div>
          ))}
        </div>
      </article>

      <article className="content-card full-span" id="features">
        <div className="section-title">
          <span className="eyebrow">Main Features</span>
          <h3>What the platform enables across the agricultural ecosystem</h3>
        </div>
        <div className="feature-grid feature-grid-wide">
          {homeFeatureGroups.map((feature) => (
            <div key={feature.title} className="feature-card feature-card-illustrated">
              <FeatureIcon type={feature.icon} />
              <strong>{feature.title}</strong>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Why It Matters</span>
          <h3>The problems the system is built to solve</h3>
        </div>
        <div className="checklist">
          {homeBenefits.map((item) => (
            <div key={item} className="checklist-item">
              {item}
            </div>
          ))}
        </div>
      </article>

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Role-Based Access</span>
          <h3>Each stakeholder sees the tools relevant to their responsibility</h3>
        </div>
        <div className="message-stack">
          {homeAudience.map((item) => (
            <div key={item.title} className="message-card">
              <FeatureIcon type={item.icon} />
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="content-card full-span" id="roles">
        <div className="section-title">
          <span className="eyebrow">User Portals</span>
          <h3>Protected workspaces for approved stakeholder roles</h3>
        </div>
        <p className="section-lead">
          Dashboard access is assigned after sign-in. Each role only sees the
          workspace and actions that match its operational responsibility.
        </p>
        <div className="role-grid">
          {roleCards.map((role) => (
            <div key={role.id} className="role-link-card locked-role-card">
              <span className="role-badge">{role.badge}</span>
              <strong>{role.title}</strong>
              <p>{role.summary}</p>
              <span className="role-arrow">Available after approved sign-in</span>
            </div>
          ))}
        </div>
      </article>

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Platform Promise</span>
          <h3>Clear value for each service point</h3>
        </div>
        <div className="message-stack">
          <div className="message-card">
            <strong>For farmers</strong>
            <p>Faster access to advice, genuine inputs, and field response support.</p>
          </div>
          <div className="message-card">
            <strong>For government</strong>
            <p>Better monitoring, clearer communication, and stronger district coordination.</p>
          </div>
          <div className="message-card">
            <strong>For extension teams</strong>
            <p>More visible response queues and a cleaner path from report to action.</p>
          </div>
        </div>
      </article>

      <article className="content-card" id="contact">
        <div className="section-title">
          <span className="eyebrow">Contact</span>
          <h3>Who this platform is intended to support</h3>
        </div>
        <p className="section-lead">
          Use the access page to sign in, register the right stakeholder role,
          and continue into the workspace that matches your agricultural duties.
        </p>
        <div className="contact-grid">
          {contactChannels.map((item) => (
            <div key={item.title} className="contact-card">
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </article>

      <footer className="content-card full-span public-footer">
        <div>
          <span className="eyebrow">AgroLink</span>
          <h3>Smart Agricultural Information and Agro-Input Management System</h3>
          <p>
            Designed to strengthen farmer, extension, dealer, and local
            government interaction in Bushenyi District.
          </p>
        </div>
        <div className="footer-columns">
          {footerColumns.map((column) => (
            <div key={column.title} className="footer-column">
              <strong>{column.title}</strong>
              {column.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </section>
  )
}

export default OverviewPage
