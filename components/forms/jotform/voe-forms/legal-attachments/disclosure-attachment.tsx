import { useContext } from 'react';
import { Col, Row } from 'react-bootstrap'
import JotformContext, { JotFormContextType } from '../../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../../../hooks/use-translation';
import styles from "../../../../../styles/jotform.module.css";


export default function DisclosureAttachment() {
	const {
		state: { applicantExtras, applicant }
	}: JotFormContextType = useContext(JotformContext);
	const signature = applicant?.extras?.find(sign => sign?.type === ApplicantExtras.SIGNATURE)
	const { t } = useTranslation();
	return (
		<form>
			<div className="Row">
				<div className='Col'>
					<h1 style={{ fontWeight: 'bold', textAlign: "center" }}>
						{t(
							"{COMPANY_NAME}",
							{ COMPANY_NAME: applicant?.company?.name },
							{ translateProps: true }
						)}
					</h1>
				</div>
			</div>

			<div className="Row">
				<div className='Col'>
					<h4 style={{ fontWeight: 'bold', textAlign: "center" }}>IMPORTANT DISCLOSURE REGARDING BACKGROUND REPORTS FROM THE PSP ONLINE SERVICE</h4>
				</div>
			</div>
			<div className="Row">
				<div className='Col'>
					<h4 style={{ fontWeight: 'bold', textAlign: "center" }}>THE BELOW DISCLOSURE AND AUTHORIZATION LANGUAGE IS FOR MANDATORY USE BY ALL ACCOUNT HOLDERS</h4>
				</div>
			</div>
			<div className="Row">
				<div className='Col'>
					<h5 style={{ fontWeight: 'bold', textAlign: "center" }}>THE BELOW DISCLOSURE AND AUTHORIZATION LANGUAGE IS FOR MANDATORY USE BY ALL ACCOUNT HOLDERS</h5>
				</div>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>In connection with your application for employment with Nautilus Trucking (“Prospective Employer”), Prospective Employer, its employees, agents or contractors may obtain one or more reports regarding your driving, and safety inspection history from the Federal Motor Carrier Safety Administration (FMCSA).</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>When the application for employment is submitted in person, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer will provide you with a copy of the report upon which its decision was based and a written summary of your rights under the Fair Credit Reporting Act before taking any final adverse action. If any final adverse action is taken against you based upon your driving history or safety report, the Prospective Employer will notify you that the action has been taken and that the action was based in part or in whole on this report.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>When the application for employment is submitted by mail, telephone, computer, or other similar means, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer must provide you within three business days of taking adverse action oral, written or electronic notification: that adverse action has been taken based in whole or in part on information obtained from FMCSA; the name, address, and the toll free telephone number of FMCSA; that the FMCSA did not make the decision to take the adverse action and is unable to provide you the specific reasons why the adverse action was taken; and that you may, upon providing proper identification, request a free copy of the report and may dispute with the FMCSA the accuracy or completeness of any information or report. If you request a copy of a driver’s record from the Prospective Employer who procured the report, then, within 3 business days of receiving your request, together with proper identification, the Prospective Employer must send or provide to you a copy of your report and a summary of your rights under the Fair Credit Reporting Act.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>Neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the capability to correct any safety data that appears to be incorrect. You may challenge the accuracy of the data by submitting a request to https://dataqs.fmcsa.dot.gov. If you challenge crash or inspection information reported by a State, FMCSA cannot change or correct this data. Your request will be forwarded by the DataQs system to the appropriate State for adjudication.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>Any crash or inspection in which you were involved will display on your PSP report. Since the PSP report does not report, or assign, or imply fault, it will include all Commercial Motor Vehicle (CMV) crashes where you were a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, all inspections, with or without violations, appear on the PSP report. State citations associated with Federal Motor Carrier Safety Regulations (FMCSR) violations that have been adjudicated by a court of law will also appear, and remain, on a PSP report.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>The Prospective Employer cannot obtain background reports from FMCSA without your authorization</p>
			</div>
			<div className="Row">
				<div className='Col'>
					<h4 style={{ fontWeight: 'bold', textAlign: "center" }}>AUTHORIZATION</h4>
				</div>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>If you agree that the Prospective Employer may obtain such background reports, please read the following and sign below:</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>I authorize Nautilus Trucking (“Prospective Employer”) to access the FMCSA Pre-Employment Screening Program (PSP) system to seek information regarding my commercial driving safety record and information regarding my safety inspection history. I understand that I am authorizing the release of safety performance information including crash data from the previous five (5) years and inspection history from the previous three (3) years. I understand and acknowledge that this release of information may assist the Prospective Employer to decide regarding my suitability as an employee.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>I further understand that neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the capability to correct any safety data that appears to be incorrect. I understand I may challenge the accuracy of the data by submitting a request to 1 https://dataqs.fmcsa.dot.gov. If I challenge crash or inspection information reported by a State, FMCSA cannot change or correct this data. I understand my request will be forwarded by the DataQs system to the appropriate State for adjudication.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>I understand that any crash or inspection in which I was involved will display on my PSP report. Since the PSP report does not report, or assign, or imply fault, I acknowledge it will include all CMV crashes where I was a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, I understand all inspections, with or without violations, will appear on my PSP report, and State citations associated with FMCSR violations that have been adjudicated by a court of law will also appear, and remain, on my PSP report..</p>
			</div>

			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>I have read the above Disclosure Regarding Background Reports provided to me by Prospective Employer and I understand that if I sign this Disclosure and Authorization, Prospective Employer may obtain a report of my crash and inspection history. I hereby authorize Prospective Employer and its employees, authorized agents, and/or affiliates to obtain the information authorized above.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>I understand that any crash or inspection in which I was involved will display on my PSP report. Since the PSP report does not report, or assign, or imply fault, I acknowledge it will include all CMV crashes where I was a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, I understand all inspections, with or without violations, will appear on my PSP report, and State citations associated with FMCSR violations that have been adjudicated by a court of law will also appear, and remain, on my PSP report.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>I have read the above Disclosure Regarding Background Reports provided to me by Prospective Employer and I understand that if I sign this Disclosure and Authorization, Prospective Employer may obtain a report of my crash and inspection history. I hereby authorize Prospective Employer and its employees, authorized agents, and/or affiliates to obtain the information authorized above.</p>
			</div>

			<div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
				<div className='Col'>
					<p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>Name:</p>
					<p style={{ color: 'black', display: 'inline' }}>Test Name</p>
				</div>
			</div>
			<div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
				<div className='Col'>
					<p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>Signature</p>
					<p style={{ color: 'black', display: 'inline' }}>Signature goes here</p>
				</div>
			</div>
			<div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
				<div className='Col'>
					<p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>Date:</p>
					<p style={{ color: 'black', display: 'inline' }}>Saturday, October 15, 2022</p>
				</div>
			</div>


			<div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>NOTICE: This form is made available to monthly account holders by NIC on behalf of the U.S. Department of Transportation, Federal Motor Carrier Safety Administration (FMCSA). Account holders are required by federal law to obtain an Applicant’s written or electronic consent prior to accessing the Applicant’s PSP report. Further, account holders are required by FMCSA to use the language contained in this Disclosure and Authorization form to obtain an Applicant’s consent. The language must be used in whole, exactly as provided. Further, the language on this form must exist as one stand-alone document. The language may NOT be included with other consent forms or any other language.</p>
			</div>

			<div className='Row' style={{ textAlign: 'center' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>NOTICE: The prospective employment concept referenced in this form contemplates the definition of “employee” contained at 49</p>
			</div>
			<div className='Row' style={{ textAlign: 'center' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>C.F.R. 383.5.</p>
			</div>
			<div className='Row' style={{ textAlign: 'center' }}>
				<p style={{ color: 'black', textAlign: 'left' }}>LAST UPDATED 12/22/2015</p>
			</div>
			<img src={signature?.value} style={{ width: '300px', height: '200px', border: '1px solid black' }} alt="image" />
		</form>

	)
}
