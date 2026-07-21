import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { PublicLayout } from '../components/layouts/public-layout';
import PartnerSurveyModal from '../components/partner/partner-survey-modal';
import styles from '../public/css/partner-signup.module.css';

const SIGNUP_URL = 'https://app.driverfly.co/signup';
const INVITATION_CODE = 'R3ADYTOLAUNCH!';
const VIDEO_EMBED = 'https://drive.google.com/file/d/1di8Hl8b8Lo4shZAgmU09fNhjDOqBPnzf/preview';

interface ShotProps {
  src: string;
  alt: string;
  caption?: string;
}

const Shot: React.FC<ShotProps> = ({ src, alt, caption }) => (
  <>
    <div className={styles.shot}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
    </div>
    {caption ? <div className={styles.caption}>{caption}</div> : null}
  </>
);

export default function PartnerSignup() {
  const [showSurvey, setShowSurvey] = useState(false);

  return (
    <>
      <Head>
        <title>Driverfly | Partner Welcome &amp; Getting Started</title>
        {/* Keep this page out of search engines — it is shared directly with invited partners. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        {/* ---------------- Hero ---------------- */}
        <section className={styles.hero}>
          <div className="container">
            <span className={styles.badge}>Special Offer</span>
            <h1>Welcome to DriverFly</h1>
            <p className="sub">
              You&apos;ve been invited to get started with an exclusive offer built for early
              partners. Follow the quick steps below to set up your account and get your recruiting
              engine running.
            </p>

            <div className={styles.perks}>
              <div className={styles.perk}>✅ 2 months of free coverage</div>
              <div className={styles.perk}>💸 Specially discounted long-term rates</div>
              <div className={styles.perk}>🤝 Hands-on onboarding from our team</div>
            </div>

            <div className={styles.ctaRow}>
              <a className={styles.btnPrimary} href={SIGNUP_URL} target="_blank" rel="noreferrer">
                Create Your Account
              </a>
              <span className={styles.codePill}>
                Invitation Code:&nbsp;<strong>{INVITATION_CODE}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ---------------- Video walkthrough ---------------- */}
        <section className={styles.section}>
          <div className={styles.kicker}>Watch first</div>
          <h2>A quick walkthrough</h2>
          <p className={styles.lead}>
            Prefer to watch instead of read? This short video walks you through everything on this
            page. You can follow along step-by-step below.
          </p>
          <div className={styles.videoWrap}>
            <iframe
              src={VIDEO_EMBED}
              title="DriverFly walkthrough"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </section>

        {/* ---------------- Step 1: Register ---------------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`} id="register">
          <div className={styles.kicker}>Getting Started</div>
          <h2>Step 1 — Create your account</h2>
          <p className={styles.lead}>
            If you haven&apos;t already set up an account, head to{' '}
            <a href={SIGNUP_URL} target="_blank" rel="noreferrer">
              app.driverfly.co/signup
            </a>{' '}
            and use these settings:
          </p>

          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <h3>Register as a Company</h3>
              <ul>
                <li>
                  Set <strong>Role = Company</strong>.
                </li>
                <li>
                  Leave <strong>&quot;Managing multiple companies&quot;</strong> turned{' '}
                  <strong>off</strong> — unless you are a third-party recruiter managing more than
                  one company.
                </li>
                <li>
                  Enter Invitation Code <code>{INVITATION_CODE}</code> to unlock your special offer.
                </li>
              </ul>
            </div>
          </div>

          <p className={styles.lead}>
            Once you&apos;re logged in, there are two things to set up — creating your first job and
            initializing your recruiting settings. We cover both below.
          </p>
        </section>

        {/* ---------------- Step 2: First job ---------------- */}
        <section className={styles.section}>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <h3>Create your first job</h3>
              <p>
                Go to <strong>Job Listings &gt; Create</strong> and add details for however many
                open positions you have — as much or as little as you&apos;d like.
              </p>
              <Shot
                src="/partner-onboarding/01-job-listings.png"
                alt="Job Listings page with the Create button highlighted"
                caption="Job Listings → Create"
              />
              <Shot
                src="/partner-onboarding/02-create-job.png"
                alt="Create Job form showing basic details and benefits"
                caption="Fill in job details, then click Add Job"
              />
              <p>
                Once saved, the job is pushed to our local job board. You can also export it as XML
                to upload to Indeed and other boards, or copy the details over manually (be sure to
                include your company&apos;s full application URL). If you register for{' '}
                <strong>Auto Recruiting</strong>, our job matching uses these details to match
                candidates to your roles.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- Step 3: Recruiting settings ---------------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <h3>Initialize your recruiting settings</h3>
              <p>
                Open the <strong>Recruitment</strong> tab to find your full driver application link
                and configure your preferences.
              </p>
              <Shot
                src="/partner-onboarding/03-recruitment-settings.png"
                alt="Company Preferences page showing the Digital Hiring Application link and driver qualifications"
                caption="Recruitment → Company Preferences"
              />

              <div className={styles.callout}>
                <strong>Tip — track your lead sources.</strong> Add UTM parameters to the end of
                your Digital Hiring App URL and we&apos;ll capture the source on each driver
                application. For example, for an Indeed posting add{' '}
                <code>?source=indeed</code>:{' '}
                <code>app.driverfly.co/apply/your-company?source=indeed</code>.
              </div>

              <p>Below the link you can tell our system whether you&apos;d like to:</p>
              <ul className={styles.checklist}>
                <li>
                  Join the <strong>Refer Back Program</strong> — share ill-fit candidates (per your
                  match criteria) and earn <strong>$250</strong> each time our system successfully
                  places one elsewhere.
                </li>
                <li>
                  Join the <strong>Auto Recruiting Program</strong> — receive full applications from
                  candidates who meet your criteria and are interested in one of your jobs.
                </li>
                <li>Request and store a driver&apos;s SSN on the full application.</li>
                <li>
                  Automatically send out <strong>Verification of Employment (VOE)</strong> requests.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- Email the team ---------------- */}
        <section className={styles.section}>
          <div className={styles.kicker}>One quick email</div>
          <h2>Send us a few details</h2>
          <p className={styles.lead}>
            Once your account is set up, email our team at{' '}
            <a href="mailto:info@driverfly.co">info@driverfly.co</a> and include:
          </p>
          <ul className={styles.checklist}>
            <li>
              The <strong>.csv or .xls file</strong> of applicants and/or employees you&apos;d like
              tracked in the system.
            </li>
            <li>
              Your preferred <strong>area code</strong> for your company phone number.
            </li>
          </ul>

          <div className={styles.card} style={{ marginTop: 18 }}>
            <h4>Want to use our AI agents?</h4>
            <p style={{ marginBottom: 12 }}>
              If so, also let us know:
            </p>
            <ul className={styles.checklist} style={{ marginBottom: 0 }}>
              <li>Inbound or outbound communication?</li>
              <li>The mode — call or SMS?</li>
              <li>
                The use case (e.g. &quot;reach out to drivers 60 days before their license and
                medical cards expire&quot;).
              </li>
              <li>The audience to target (e.g. all employees in the system).</li>
              <li>
                <em>Optional:</em> the agent&apos;s name and persona (e.g. &quot;a younger woman
                named Jessica with a warm, persistent demeanor&quot;).
              </li>
              <li>
                <em>Optional:</em> your API key from Tenstreet or other tools you&apos;d like to
                integrate (with the tool&apos;s name and purpose).
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------- Other things to do ---------------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.kicker}>Make the most of it</div>
          <h2>Other things you can do</h2>

          <div className={styles.step} style={{ marginTop: 24 }}>
            <div className={styles.stepBody} style={{ width: '100%' }}>
              <h3>Bulk-upload your applicants &amp; hires</h3>
              <p>
                Using DriverFly as your applicant tracking system? You can add candidates one at a
                time or mass-import them by CSV — for both applicants and employees.
              </p>
              <Shot
                src="/partner-onboarding/04-import-applicants.png"
                alt="Applicants page with the Import Applicants button highlighted"
                caption="Applicants → Import Applicants"
              />
              <Shot
                src="/partner-onboarding/05-import-employees.png"
                alt="Employee Directory page with the Import Employees button highlighted"
                caption="Employees → Import Employees"
              />
              <p>
                First click <strong>Download Template</strong> (#1) to get all the fields, format
                your source data to match, then upload and click <strong>Import</strong> (#2).
              </p>
              <Shot
                src="/partner-onboarding/06-employee-template.png"
                alt="Import screen showing the Download Template and Import buttons"
                caption="Download the template (#1), then upload and Import (#2)"
              />
              <div className={styles.callout}>
                Run into a formatting issue on upload (e.g. <code>08.02.2026</code> vs{' '}
                <code>08/02/2026</code>)? Reach out — we&apos;ll help transform your data into the
                right format.
              </div>
            </div>
          </div>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h4>Notification configuration</h4>
              <p>
                Want DriverFly to send compliance reminders to your employees? Go to{' '}
                <strong>Employees</strong> and click the bell icon to configure them.
              </p>
            </div>
            <div className={styles.card}>
              <h4>Add additional recruiters</h4>
              <p>
                Add recruiters or processing agents under{' '}
                <strong>Settings &gt; Users &gt; Create</strong>. New accounts are approved by our
                team, so there may be a short delay before they gain access.
              </p>
            </div>
          </div>

          <div className={styles.step} style={{ marginTop: 32 }}>
            <div className={styles.stepBody} style={{ width: '100%' }}>
              <h3>Update your company profile</h3>
              <p>
                In <strong>Settings &gt; Company</strong>, fill out your company profile — this is
                what shows up on our public-facing job board (which you&apos;ll also have access
                to).
              </p>
              <Shot
                src="/partner-onboarding/07-company-profile.png"
                alt="Company settings page for updating name, website, about and photo"
                caption="Settings → Company"
              />
              <Shot
                src="/partner-onboarding/08-add-users.png"
                alt="Users page with the Create button highlighted"
                caption="Settings → Users → Create to add recruiters"
              />
            </div>
          </div>
        </section>

        {/* ---------------- Feedback band ---------------- */}
        <section className={styles.band}>
          <h2>How are we doing?</h2>
          <p>
            Your feedback shapes what we build next. It takes about 2 minutes and goes straight to
            our team.
          </p>
          <button className={styles.btnFeedback} onClick={() => setShowSurvey(true)}>
            Share Your Feedback
          </button>
          <div className={styles.supportNote}>
            Found a bug? Report it in-app under <strong>Settings &gt; Support</strong>, or email{' '}
            <a href="mailto:info@driverfly.co">info@driverfly.co</a> and we&apos;ll pass it to our
            development team.
          </div>
        </section>
      </div>

      <PartnerSurveyModal show={showSurvey} onClose={() => setShowSurvey(false)} />
    </>
  );
}

PartnerSignup.getLayout = function getLayout(page: React.ReactElement) {
  return <PublicLayout title="Partner Welcome">{page}</PublicLayout>;
};

// This page is shared privately with invited partners via an unguessable URL.
// Set the noindex directive as an HTTP header (not just a meta tag) so crawlers
// that don't execute JS still honor it — the app renders a client-side shell,
// so the <Head> meta isn't present in the initial server HTML on its own.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return { props: {} };
};
