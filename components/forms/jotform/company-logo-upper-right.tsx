import { useContext, useEffect, useState } from 'react';
import JotformContext, { JotFormContextType } from '../../../context/jotform-context';
import styles from '../../../styles/digitalhiringapp.module.css';
import DocumentApi from '../../../pages/api/document';

export function CompanyLogoUpperRight() {
  const {
    state: { applicant, company },
  }: JotFormContextType = useContext(JotformContext);

  const companyName = applicant?.company?.name || company?.name;
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>('');

  useEffect(() => {
    const fetchLogoUrl = async () => {
      const photo = applicant?.company?.photo || company?.photo;
      if (photo?.id) {
        try {
          const api = new DocumentApi();
          const document = await api.getSignedUrl(photo.id);
          setCompanyLogoUrl(document?.path || '');
        } catch (error) {
          console.error('Error fetching company logo:', error);
        }
      } else if (photo?.path) {
        setCompanyLogoUrl(photo.path);
      }
    };
    fetchLogoUrl();
  }, [applicant?.company?.photo, company?.photo]);

  if (!companyLogoUrl) return null;

  return (
    <div className={styles.companyLogoUpperRight}>
      <img src={companyLogoUrl} alt={`${companyName} logo`} />
    </div>
  );
}
