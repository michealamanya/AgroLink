import SiteLayout from '../components/SiteLayout'
import { Reveal } from '../components/RevealUtils'

const CONTACTS = [
  { icon: '📧', label: 'Email',     value: 'nkesigagodfrey1972@gmail.com', href: 'mailto:nkesigagodfrey1972@gmail.com',            color: '#fee2e2', textColor: '#dc2626' },
  { icon: '💬', label: 'WhatsApp',  value: '+256 779 226 596',          href: 'https://wa.me/256779226596',                 color: '#dcfce7', textColor: '#16a34a' },
  { icon: '𝕏',  label: 'X (Twitter)', value: '@nkesiga_godfrey',        href: 'https://x.com/godfrey',              color: '#f1f5f9', textColor: '#0f172a' },
  { icon: '💼', label: 'LinkedIn',  value: 'nkesiga godfrey',            href: 'https://linkedin.com/in/nkesiga_godfrey',     color: '#dbeafe', textColor: '#1d4ed8' },
  { icon: '🐙', label: 'GitHub',    value: 'nkesiga godfrey',             href: 'https://github.com/nkesigagodfrey1972-bot',           color: '#f3f4f6', textColor: '#111827' },
  { icon: '📞', label: 'Phone',     value: '+256 779 226 596',          href: 'tel:+256779226596',                          color: '#fef9c3', textColor: '#a16207' },
]

function ContactPage() {
  return (
    <SiteLayout
      title="Contact Us"
      subtitle="Reach the AgroLink development team through any of these channels."
    >
      <section className="lp-section lp-section-white">
        <Reveal>
          <h2 className="lp-section-h2">
            Get in touch with<br />
            <span className="lp-green">the development team.</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="lp-section-lead">
            Have a question, feedback, or want to collaborate on the AgroLink platform?
            Reach us through any of the channels below.
          </p>
        </Reveal>

        <div className="lp-contact-grid">
          {CONTACTS.map((c, i) => (
            <Reveal key={c.label} delay={i * 80}>
              <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer" className="lp-contact-card">
                <div className="lp-contact-icon" style={{ background: c.color, color: c.textColor }}>
                  <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                </div>
                <div className="lp-contact-info">
                  <strong>{c.label}</strong>
                  <span>{c.value}</span>
                </div>
                <span className="lp-contact-arrow">→</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={500}>
          <div className="lp-dev-note" style={{ marginTop: '48px' }}>
            <div className="lp-dev-avatar">NG</div>
            <div>
              <strong>Godfrey Nkesiga</strong>
              <p>Lead Developer · AgroLink Platform · Bushenyi District, Uganda</p>
              <p style={{ marginTop: '4px' }}>
                This platform is developed and maintained as a Smart Agricultural
                Information and Agro-Input Management System for Bushenyi District.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  )
}

export default ContactPage
