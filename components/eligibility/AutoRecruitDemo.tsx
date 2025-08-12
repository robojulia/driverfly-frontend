import React from 'react';
import AutoRecruitIndicator from './AutoRecruitIndicator';

/**
 * Demo component showing how the AutoRecruitIndicator appears in different contexts
 * This component is for demonstration purposes only
 */
const AutoRecruitDemo: React.FC = () => {
  const demoApplicants = [
    {
      id: 1,
      name: 'John Smith',
      status: 'ELIGIBLE',
      type: 'USER',
    },
    {
      id: 2,
      name: 'Jane Doe',
      status: 'ELIGIBLE',
      type: 'AUTO_RECRUIT',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      status: 'ELIGIBLE',
      type: 'DIRECT_JOB_APPLY',
    },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>Auto-Recruit Indicator Demo</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
              Applicant
            </th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {demoApplicants.map((applicant) => (
            <tr key={applicant.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{applicant.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {applicant.status}
                  </span>
                  {applicant.type === 'AUTO_RECRUIT' && <AutoRecruitIndicator />}
                </div>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{applicant.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Note:</strong> Hover over the lightning bolt to see the "Auto-recruited" tooltip.
        Only applicants with type "AUTO_RECRUIT" will show this indicator.
      </p>
    </div>
  );
};

export default AutoRecruitDemo;
