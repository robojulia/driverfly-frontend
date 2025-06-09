import Link from 'next/link';
import Image from 'next/image';
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  CheckCircleFill,
  Star,
  TrophyFill,
  PeopleFill,
  GearFill,
  RocketFill,
} from 'react-bootstrap-icons';
import VoeFormContext from '../../../../context/voeform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { PrimaryButton, SecondaryButton } from '../../jotform/form-buttons';

export function VoeThankYouPage() {
  const {
    state: { applicant, employer },
  } = useContext(VoeFormContext);
  const { t } = useTranslation();

  useEffect(() => {
    toast.success(t('VOE_SUCCESSFULLY_SUBMITTED'));
  }, [t]);

  const benefits = [
    {
      icon: <RocketFill size={24} className="text-primary" />,
      title: t('POST_JOBS_INSTANTLY'),
      description: t('POST_JOBS_INSTANTLY_DESC'),
    },
    {
      icon: <PeopleFill size={24} className="text-success" />,
      title: t('ACCESS_VERIFIED_DRIVERS'),
      description: t('ACCESS_VERIFIED_DRIVERS_DESC'),
    },
    {
      icon: <GearFill size={24} className="text-info" />,
      title: t('STREAMLINE_HIRING'),
      description: t('STREAMLINE_HIRING_DESC'),
    },
    {
      icon: <TrophyFill size={24} className="text-warning" />,
      title: t('AUTOMATE_HIRING'),
      description: t('AUTOMATE_HIRING_DESC'),
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '2rem 1rem',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {/* Success Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '3rem',
              padding: '2rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircleFill size={40} color="white" />
            </div>

            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
              }}
            >
              {t('THANK_YOU')}
            </h1>

            <p
              style={{
                fontSize: '1.2rem',
                color: '#64748b',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              {t('VOE_THANK_YOU_MESSAGE', {
                EMPLOYER_NAME: employer.name,
                APPLICANT_NAME: `${applicant.first_name} ${applicant.last_name}`,
              })}
            </p>

            <div
              style={{
                marginTop: '2rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '16px',
                border: '1px solid #bfdbfe',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#1e40af',
                  fontWeight: '600',
                  fontSize: '1rem',
                }}
              >
                ✅ Verification of Employment completed successfully
              </p>
            </div>
          </div>

          {/* Marketing Section */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '24px',
              padding: '3rem 2rem',
              marginBottom: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #0073b1 0%, #005582 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem',
                }}
              >
                {t('DISCOVER_DRIVERFLY')}
              </h2>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: '#64748b',
                  maxWidth: '500px',
                  margin: '0 auto',
                  lineHeight: '1.6',
                }}
              >
                Join thousands of companies using Driverfly to streamline their hiring process
              </p>
            </div>

            {/* Benefits Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem',
              }}
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>{benefit.icon}</div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    style={{
                      color: '#64748b',
                      lineHeight: '1.5',
                      margin: 0,
                      fontSize: '0.95rem',
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'linear-gradient(135deg, #0073b1 0%, #005582 100%)',
                borderRadius: '20px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background Pattern */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3,
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Image
                    src="/img/logo.png"
                    alt="Driverfly Logo"
                    width={200}
                    height={54}
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>

                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: 'white',
                  }}
                >
                  {t('VOE_JOIN_DRIVERFLY_CTA')}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link href="/signup">
                    <a style={{ textDecoration: 'none' }}>
                      <PrimaryButton
                        style={{
                          background: 'white',
                          color: '#0073b1',
                          fontWeight: '700',
                          padding: '1rem 2rem',
                          border: 'none',
                          minWidth: '200px',
                        }}
                      >
                        {t('GET_STARTED_FREE')} 🚀
                      </PrimaryButton>
                    </a>
                  </Link>

                  <SecondaryButton
                    style={{
                      background: 'transparent',
                      color: 'white',
                      border: '2px solid white',
                      fontWeight: '600',
                      padding: '1rem 2rem',
                      minWidth: '160px',
                    }}
                  >
                    Learn More
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
            }}
          >
            <h4
              style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1rem',
              }}
            >
              Need Help?
            </h4>
            <p
              style={{
                color: '#64748b',
                marginBottom: '1rem',
                lineHeight: '1.6',
              }}
            >
              {t('VOE_CONTACT_SUPPORT')}
            </p>
            <a
              href="mailto:support@driverfly.com"
              style={{
                color: '#0073b1',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '1.1rem',
              }}
            >
              support@driverfly.com
            </a>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '2rem',
              padding: '1rem',
              color: '#94a3b8',
              fontSize: '0.9rem',
            }}
          >
            <p style={{ margin: 0 }}>
              © 2024 Driverfly. Streamlining transportation hiring nationwide.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
