import styles from "../../../../../styles/jotform.module.css";
import { Col, Row } from 'react-bootstrap';

export default function ConsentAlcoholDrug() {
    return (
        <form>
            <div className="Row">
                <div className="Col">
                    <h1 style={{ fontWeight: 'bold', textAlign: "center" }}>Nautilus Trucking</h1>
                </div>
            </div>
            <div className="Row">
                <div className="Col">
                    <h4 style={{ fontWeight: 'bold', textAlign: "center" }}>GENERAL CONSENT FOR LIMITED QUERIES OF THE FMCSA DRUG AND ALCOHOL CLEARINGHOUSE</h4>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>Name:</p>
                    <p style={{ color: 'black', display: 'inline' }}>Test name</p>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>Employer's Name:</p>
                    <p style={{ color: 'black', display: 'inline' }}>Nautilus Trucking</p>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>CDL License Number:</p>
                    <p style={{ color: 'black', display: 'inline' }}>12133445</p>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>Expiration Date:</p>
                    <p style={{ color: 'black', display: 'inline' }}>Friday, October 21, 2022</p>
                </div>
            </div>
            <div className="Row">
                <p style={{ color: 'black', display: 'inline' }}>I, Test name, hereby provide consent to Nautilus Trucking to conduct a limited query of the FMCSA Commercial Driver’s License Drug and Alcohol Clearinghouse (Clearinghouse) to determine whether drug or alcohol violation information about me exists in the Clearinghouse.</p>
            </div>
            <div className="Row">
                <p style={{ color: 'black', display: 'inline' }}>I understand that if the limited query conducted by Nautilus Trucking indicates that drug or alcohol violation information about me exists in the Clearinghouse, FMCSA will not disclose that information to Nautilus Trucking without first obtaining additional specific consent from me.</p>
            </div>
            <div className="Row">
                <p style={{ color: 'black', display: 'inline' }}>I further understand that if I refuse to provide consent for Nautilus Trucking to conduct a limited query of the Clearinghouse, Nautilus Trucking must prohibit me from performing safety-sensitive functions, including driving a commercial motor vehicle, as required by FMCSA’s drug and alcohol program regulations.</p>
            </div>
            <div className="Row" style={{ marginTop: '30px' }}>
                <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>Employee Signature</p>
            </div>
            <div className="Row" style={{ marginTop: '100px', marginBottom: '30px' }}>
                <p style={{ color: 'black', display: 'inline' }}>Signature goes here</p>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>Date of Consent:</p>
                    <p style={{ color: 'black', display: 'inline' }}>Saturday, October 15, 2022</p>
                </div>
            </div>
            <div className="Row">
                <p style={{ color: 'black', display: 'inline' }}>Instructions: Section 382.703(a) of the Title 49 CFR, states “No employer may query the Clearinghouse to determine whether a record exists for any particular driver without first obtaining that driver’s written or electronic consent.” The type of consent required depends on the type of query. For a limited query, a general consent is required. This will be obtained outside the Clearinghouse. Employers may obtain a multi-year general consent from the driver for limited queries. For a full query, the driver must provide specific consent to the employer prior to each full query. This consent must be provided electronically within the Clearinghouse.</p>
            </div>

        </form>
    )
}
