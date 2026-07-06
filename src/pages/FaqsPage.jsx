import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { Reveal } from '../components/RevealUtils'
import { faqItems } from '../data/appData'

const EXTRA_FAQS = [
  { question: 'How do I create an account?', answer: 'Go to the Sign in page, switch to Register, choose your role (farmer, extension officer, dealer, or district office), fill in your details, and create your account. You can also register with Google — Google sign-ups are created as farmer accounts by default.' },
  { question: 'Can I sign in with Google?', answer: 'Yes. Use the "Sign in with Google" button on the access page. If you already have an AgroLink account linked to that Google email, you will be signed in. If not, you will be prompted to create an account.' },
  { question: 'What happens if I log a wrong report?', answer: 'Go to the Reports section of your farmer dashboard, select the report, and use the "Withdraw report" option. This removes it from the active response queue.' },
  { question: 'Is my data secure?', answer: 'Yes. AgroLink is built on Google Firebase — role-based security rules ensure each user only accesses the records their role permits. Passwords are managed by Firebase Authentication and never stored in plain text.' },
  { question: 'Can dealers update their stock listings?', answer: 'Yes. Dealers can add, update verification status, and manage all their stock records from the Stock Board and Add Stock sections in their dashboard.' },
]

const ALL_FAQS = [...faqItems, ...EXTRA_FAQS]

function FaqsPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <SiteLayout
      title="Frequently Asked Questions"
      subtitle="Quick answers about AgroLink — how it works, who it's for, and how to get started."
    >
      <section className="lp-section lp-section-white">
        <Reveal>
          <h2 className="lp-section-h2">Common questions.</h2>
        </Reveal>
        <div className="lp-faq-list lp-faq-list-page">
          {ALL_FAQS.map((item, i) => (
            <Reveal key={item.question} delay={i * 40}>
              <div className={`lp-faq-item ${openFaq === i ? 'lp-faq-open' : ''}`}>
                <button className="lp-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}>
                  <span>{item.question}</span>
                  <span className="lp-faq-chevron">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div className="lp-faq-a"><p>{item.answer}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lp-cta-strip">
        <Reveal>
          <div className="lp-cta-strip-inner">
            <div>
              <h2 className="lp-cta-strip-h2">Still have questions?</h2>
              <p className="lp-cta-strip-sub">Reach the team directly through the contact page.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <NavLink to="/contact" className="lp-cta-primary lp-cta-strip-btn">Contact us →</NavLink>
              <NavLink to="/access" className="lp-cta-primary lp-cta-strip-btn" style={{ background: 'rgba(255,255,255,0.15)', boxShadow: 'none' }}>Get started →</NavLink>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  )
}

export default FaqsPage
