import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  CheckCircleFill,
  TruckFrontFill,
  PeopleFill,
  GearFill,
  RocketFill,
  StarFill,
} from 'react-bootstrap-icons';
import { useTranslation } from '../../../../hooks/use-translation';
import JotformContext from '../../../../context/jotform-context';
import { JotFormContextType } from '../../../../context/jotform-context';
import { PrimaryButton, SecondaryButton } from '../form-buttons';

export function ThankyouPage() {
  const {
    state: { company },
  }: JotFormContextType = useContext(JotformContext);
  const { t } = useTranslation();

  useEffect(() => {
    toast.success(t('successfully_saved_information'));
  }, []);

  const features = [
    {
      icon: <TruckFrontFill size={28} className="text-primary" />,
      title: 'Find Your Perfect Match',
      description: 'Connect with top trucking companies actively hiring drivers like you',
    },
    {
      icon: <RocketFill size={28} className="text-success" />,
      title: 'Fast Application Process',
      description: 'Apply to multiple companies with one profile - no repetitive paperwork',
    },
    {
      icon: <PeopleFill size={28} className="text-info" />,
      title: 'Verified Opportunities',
      description: 'All job postings are verified and from legitimate transportation companies',
    },
    {
      icon: <StarFill size={28} className="text-warning" />,
      title: 'Career Growth',
      description: 'Access better opportunities and advance your driving career',
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        style={{
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
              padding: '3rem 2rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem auto',
                boxShadow: '0 15px 30px rgba(16, 185, 129, 0.4)',
              }}
            >
              <CheckCircleFill size={90} color="white" />
            </div>

            <h1
              style={{
                fontSize: '3rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1.5rem',
                lineHeight: '1.2',
              }}
            >
              {t('THANK_YOU')}
            </h1>

            <div
              style={{
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              <p
                style={{
                  fontSize: '1.3rem',
                  color: '#64748b',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                }}
              >
                {company
                  ? t('DHA_THANK_YOU_MESSAGE', { company: company.name })
                  : t('DHA_THANK_YOU_MESSAGE_CLOSE')}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.95rem',
            }}
          >
            <p style={{ margin: '0 0 0.5rem 0' }}>
              🚛 <strong>Driverfly</strong> - Connecting drivers with opportunities nationwide
            </p>
            <p style={{ margin: 0, opacity: 0.8 }}>
              © 2025 Driverfly. Driving careers forward, one connection at a time.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
