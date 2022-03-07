import Link from 'next/link';
import Breadcrumbs from 'nextjs-breadcrumbs';
import Layout from "../components/layouts";

export default function TermsAndPolicies() {
    return (
        <>
          <div className="top-links-sec">
              <div className="container">
                  <div className="top-links-inner d-flex align-items-center justify-content-between">
                      <h2>Terms And Policies</h2>
                      < Breadcrumbs />
                    </div>
                </div>
            </div>
            <div className='container my-5'>
                <h4 className="font-weight-normal">Website Terms and Conditions</h4>
                <p className='py-3 text-secondary'>01. Introduction Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Driver Hiring USA’s relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website. The term ‘Driver Hiring USA’ or ‘us’ or ‘we’ refers to the owner of the website, Custom Trucker LLC, a California company. The term ‘you’ refers to the user or viewer of our website</p>
                <h4 className="font-weight-normal">Information on this Site</h4>
                <p className='py-3 text-secondary'>While we make every effort to ensure that the information on our Website is accurate and complete, some of the information is supplied to us by third parties and we are not able to check the accuracy or completeness of that information. We do not accept any liability arising from any inaccuracy or omission in any of the information on our Website or any liability in respect of information on the Website supplied by you, any other website user or any other person.</p>
                <h4 className="font-weight-normal">Your Use of this Site</h4>
                <p className='py-3 text-secondary'>You may only use the Website for lawful purposes to seek employment or help with your career, to recruit drivers or other staff members, or to acquire any other services promoted specifically by the site, itself. You may not under any circumstances seek to undermine the security of the Website or any information submitted to or available through it. In particular, but without limitation, you are not authorized to seek to access, alter or delete any information to which you do not have authorized access, scrape any information from the site, seek to overload the system via spamming or flooding, take any action or use any device, routine or software to crash, delay, damage or otherwise interfere with the operation of the Website or attempt to decipher, disassemble or modify any of the software, coding or information comprised in the Website.</p>
                <p className='mb-3 text-secondary'>You are solely responsible for any information submitted by you to the Website. You are responsible for ensuring that all information supplied by you is true, accurate, up-to-date and not misleading or likely to mislead or deceive and that it is not discriminatory, obscene, offensive, defamatory or otherwise illegal, unlawful or in breach of any applicable legislation, regulations, guidelines or codes of practice or the copyright, trade mark or other intellectual property rights of any person in any jurisdiction. You are also responsible for ensuring that all information, data and files are free of viruses or other routines or engines that may damage or interfere with any system or data prior to being submitted to the Website. We reserve the right to remove any information supplied by you from the Website at our sole discretion, at any time and for any reason without being required to give any explanation.</p>
            </div>
        </>
    )

}

TermsAndPolicies.getLayout = function getLayout(page){
    return (
        <Layout>
            {page}
        </Layout>
    )
}