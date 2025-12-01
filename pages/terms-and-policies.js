import Link from 'next/link';
import Head from 'next/head';
import { PublicLayout } from "../components/layouts/public-layout";
import { useTranslation } from '../hooks/use-translation';

export default function TermsAndPolicies() {

    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t("TERMS_AND_POLICIES_META_TITLE")} </title>
                <meta
                    name="description"
                    content={t("TERMS_AND_POLICIES_META_DESC")} key="desc"
                />
            </Head>
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h1>{t("TERMS_AND_POLICIES")}</h1>
                    </div>
                </div>
            </div>
            <div className='container my-5 terms__and__policies__container'>
                <h5 className="">I. Legal Action</h5>
                <h5 className='py-3 '>A. Arbitration and Dispute Resolution</h5>
                <h5 className='pb-3'>1. Disputes and Arbitration</h5>
                <p className='text-secondary'>DriverFly is committed to customer satisfaction. If you have a problem or dispute, we will try to resolve it. If we are unsuccessful, you may pursue your claim as explained in this section.</p>
                <p className='text-secondary'>You agree to give us an opportunity to resolve any problem, dispute, or claim relating in any way to the Sites and/or any of its related applications or services; any dealings with DriverFly, including with our marketing and customer service agents; the purchase, use, or performance of any services or products available through this Site; any representations made by DriverFly; or our Privacy Policy (collectively, “Claims”) by providing Notice to Customer Support. Unless prohibited by applicable law, any Claim must be brought within two (2) years from the date on which such Claim arose or accrued. If we are unable to resolve your Claims within 60 days of receipt, you may seek relief through arbitration or small claims court, as set forth below. This informal process is a condition precedent to your ability to initiate a claim in arbitration or small claims court.</p>
                <p className='text-secondary'>This Agreement shall be governed by the laws of the State of Delaware, United States of America, without regard to conflict of laws. All Claims or other matters in dispute between you or any Third- party and DriverFly, its subsidiaries or affiliates, or any third party partners or companies offering products or services through the Site, whether based upon contract, tort, statute, or otherwise, shall be governed by the laws of the State of Delaware, without regard to conflict of laws provisions that would result in the application of the laws of any other jurisdiction.</p>
                <h5 className=" py-3">2. Mandatory Arbitration</h5>
                <p className='text-secondary'>Please read this provision carefully. It requires that any and all claims must be resolved by binding arbitration or in small claims court, and it prevents you from pursuing a class action or similar proceeding in any forum. These limitations apply to any claims against DriverFly, its subsidiaries or affiliates, any third party partners or companies offering products or services through the Site.</p>
                <p className='text-secondary'>In arbitration, a dispute is resolved by an arbitrator instead of a judge or jury. The arbitrator’s decision will generally be final and binding, with no right of appeal. Arbitration procedures are simpler and more limited than court procedures.</p>
                <ol>
                    <li>
                        <p>By using this Site, you, any Third-party, and DriverFly agree that any Claim, including claims regarding the applicability or validity of this arbitration provision, shall be resolved exclusively by final and binding arbitration administered by the American Arbitration Association (“AAA”) and conducted before a single arbitrator pursuant to the then applicable Rules and Procedures established by AAA (“Rules and Procedures”), except that, pursuant to subsection (e) below, under no circumstances may any claim be brought or arbitrated as a class action or proceed on a basis involving claims brought on a purported representative capacity (either on behalf of the general public or other users or persons, except that the arbitrator shall have the authority to award public injunctive relief where applicable).</p>
                    </li>
                    <li>
                        <p>As an exception to arbitration, you, any Third-party, and DriverFly retain the right to pursue in a small claims court located in the federal judicial district that includes you or the Third-party’s billing address at the time of the Claim, any Claim that is within the court’s jurisdiction and proceeds on an individual basis. All Claims you or a Third-party bring against DriverFly, its subsidiaries or affiliates, or any third party partners or companies offering products or services through the Site must be resolved in accordance with this Disputes and Arbitration Section. All Claims filed or brought contrary to this Section shall be considered improperly filed and void.</p>
                    </li>
                    <li>
                        <p>If you decide to seek arbitration, you must first send, by certified mail, a written Notice of Dispute (“Notice”) addressed to: Legal Department, DriverFly Inc, 2140 S. Dupont Highway, Camden, DE 19934 (“Notice Address”). The Notice must (i) describe the nature and basis of the Claim; and (ii) set forth the specific relief sought. If DriverFly and you, or DriverFly and any Third-party, do not reach an agreement to resolve the Claim within 60 days after the Notice is received, you, or the Third-party, may commence an arbitration proceeding. During the arbitration, the amount of any settlement offer made shall not be disclosed to the arbitrator until after the arbitrator determines the amount, if any, to which you, any Third-party, or DriverFly is entitled. The arbitration shall be held at a location determined by AAA pursuant to the Rules and Procedures, or at such other location as may be mutually agreed upon.</p>
                    </li>
                    <li>
                        <p>To the extent that any Claim is held not to be subject to arbitration and proceeds in a Court other than small claims court, such Claim shall be filed only in the United States District Court for Delaware or, if there is no federal jurisdiction over the action, in the courts of the State of Delaware. You hereby consent and submit to the personal jurisdiction of such courts for the purposes of litigating any such Claim that is not subject to the arbitration provision and not pursued in small claims court, and agree that any such claim shall be resolved individually, without resort to any form of class action (as described more fully in section I.A.2.d below). You further agree that any and all Claims or other matters asserted in such dispute, whether based upon contract, tort, statute, or otherwise, shall be governed by the laws of the State of Delaware, without regard to conflict of laws provisions that would result in the application of the laws of any other jurisdiction.</p>
                    </li>
                    <li>
                        <p>You and any Third-party further agree that no proceeding against DriverFly, its affiliates, or any third party partners or companies offering products or services through the Site (under this provision or otherwise) may proceed as a class action’ or proceed on a basis involving claims brought in a purported representative capacity (either on behalf of the general public or other users or persons). However, where applicable, the arbitrator shall have the authority to award equitable or injunctive relief which necessarily may affect the rights and obligations of persons not party to the arbitration (i.e. public injunctive relief).</p>
                    </li>
                    <li>
                        <p>Upon motion of one or more affected parties, the arbitrator may, in its discretion, consolidate more than one arbitration with one or more related arbitrations involving similar claims in an effort to ensure that the arbitration process is an efficient, timely and cost-effective alternative to litigation. All parties will retain the right to request an individualized hearing. Notwithstanding the foregoing, the arbitrator may not preside over any form of a representative or class proceeding that would affect the rights of any individual, unless that individual has actually initiated and is currently maintaining a demand for arbitration pursuant to this Agreement.</p>
                    </li>
                    <li>
                        <p> In order to initiate arbitration, each party will be responsible for paying the filing fees required by the AAA. In the event that you are able to demonstrate that the costs of arbitration will be prohibitive as compared to costs of litigation, DriverFly will pay as much of your filing fee in connection with the arbitration as the arbitrator deems necessary to prevent the arbitration from being cost-prohibitive as compared to the costs of litigation. For any arbitration involving Claims that together seek damages that exceed $25,000, if you, or any Third-party, prevail in the arbitration of any Claim against DriverFly, DriverFly will reimburse such prevailing party for any fees or costs the prevailing party paid to AAA in connection with the arbitration.</p>
                    </li>
                    <li>
                        <p> If you prevail in the arbitration, the arbitrator may award you statutory damages and/or your reasonable attorney fees and expenses, to the extent that the arbitrator believes them to be necessary or mandated by law. Any dispute regarding attorney’s fees to be paid pursuant to this paragraph will be decided by the arbitrator who decided the underlying Claim. If you or the Third-party do not prevail on the claim or prevail but are awarded an amount less than or equal to DriverFly’s last written settlement offer to you, DriverFly will pay only the amount of the award, not the minimum recovery.</p>
                    </li>
                    <li>
                        <p>Notwithstanding any other provision of law or any of the Rules and Procedures established by AAA which may be to the contrary, DriverFly will not be entitled to seek reimbursement of its attorney’s fees for any Claim the arbitrator finds to be non-frivolous.</p>
                    </li>
                    <li>
                        <p>With the exception of sub-part (d) above (the class action waiver), if any part of this arbitration provision is held to be invalid, unenforceable or illegal, or otherwise conflicts with the Rules and Procedures established by AAA, then the balance of this arbitration provision shall remain in effect and shall be construed in accordance with its terms as if the invalid, unenforceable, illegal or conflicting provision were not contained herein. If, however, subpart (d) above (the class action waiver) is held to be invalid, unenforceable or illegal, then the entirety of this arbitration provision shall be null and void, and neither you nor any Third-party, nor DriverFly shall be entitled to arbitrate their dispute.</p>
                    </li>
                    <li>
                        <p>Arbitration rules and forms may be obtained from AAA at https://www.adr.org or by calling AAA at 1-800-778-7879.</p>
                    </li>
                    <li>
                        <p>f you or any Third-party do not choose to accept this binding arbitration provision, you or such third-party must notify DriverFly in writing by certified mail within thirty (30) days of the initial filing. Such notice shall be sent to the notice address defined in subsection (b), above. If you so notify us by that time that you do not accept the binding arbitration provision, you and any such third-party may not continue to access services or products on this Site unless and until DriverFly notifies you or such third-party otherwise.</p>
                    </li>
                </ol>
                <h5 className=" py-3">B. Disclaimer of Warranties</h5>
                <p className='text-secondary'>All content contained within or available through this Site are provided to you on an “as is,” basis. DriverFly makes no representations or warranties of any kind, either express or implied, as to the operation of this Site or the information, content or materials included on this Site. To the fullest extent permissible, DriverFly disclaims all representations and warranties, including, but not limited to, the implied warranties of merchantability or satisfactory workmanlike effort, informational content, title, or non-infringement of the rights of third parties. <span className='font-weight-bold'>DriverFly does not warrant or make any representations that this Site will operate error-free or uninterrupted, that defects will be corrected, or that this Site and/or its servers will be free of viruses and/or other harmful components. DriverFly does not warrant or make any representations regarding suitability, availability, accuracy, reliability, completeness, or timeliness of any material of any kind contained within this Site for any purpose, including software, products, services, information, text and related graphics content. </span></p>
                <p className='text-secondary'>Without limiting the foregoing, no warranty or guarantee is made (i) regarding the acceptance of any request, (ii) that a user will receive the lowest available price for goods and/or services available through this Site, (iii) regarding the availability of products and/or services through this Site or, where applicable, at any participating retailer or retailer location, or (iv) regarding the results that may be obtained from the use of this Site.</p>
                <h5 className=" py-3">C. General Limitation of Liability</h5>
                <p className='text-secondary'><span className='font-weight-bold'>To the extent permitted by law, in no event shall DriverFly, including its respective officers, directors, employees, representatives, parents, subsidiaries, affiliates, distributors, suppliers, licensors, agents or others involved in creating, sponsoring, promoting, or otherwise making available the Site and its contents (collectively the “Covered Parties”), be liable to any person or entity for any direct, indirect, incidental, special, exemplary, compensatory, consequential, or punitive damages or any damages whatsoever,</span> including but not limited to: (i) loss of goodwill, profits, business interruption, data or other intangible losses; (ii) your inability to use, unauthorized use of, performance or non-performance of the Site; (iii) unauthorized access to or tampering with your personal information or transmissions; (iv) the provision or failure to provide any service; (v) errors or inaccuracies contained on the ite or any information, software, products, services, and related graphics obtained through the Site; (vi) any transactions entered into through this Site; (vii) any property damage including damage to your computer or computer system caused by viruses or other harmful components, during or on account of access to or use of this Site or any Site to which it provides hyperlinks; or (viii) damages otherwise arising out of the use of the Site, any delay or inability to use the Site, or any information, products, or services obtained through the Site. The limitations of liability shall apply regardless of the form of action, whether based on contract, tort, negligence, strict liability or otherwise, even if a Covered Party has been advised of the possibility of damages.</p>
                <h5 className=" py-3">Indemnification</h5>
                <p className='text-secondary'>You agree to defend and indemnify DriverFly and the Covered Parties from and against any claims, causes of action, demands, recoveries, losses, damages, fines, penalties or other costs or expenses of any kind or nature including but not limited to reasonable legal and accounting fees, brought (i) by you or on behalf of you in excess of the liability described above; or (ii) by third parties as a result of:</p>
                <ol>
                    <li>
                        <p> breach of this Agreement </p>
                    </li>
                    <li>
                        <p> your violation of any law or the rights of a third party; or</p>
                    </li>
                    <li>
                        <p> your use of this Site in violation of this Agreement.</p>
                    </li>
                </ol>
                <h5 className=" py-3">D. Copyright and Trademark Notices</h5>
                <p className="text-secondary">The content on this Site is protected under United States and international laws, including trademark and copyright laws. The content on this Site, including without limitation, the information, text, software, code, photographs, videos, typefaces, graphics, music, sounds, images, illustrations, maps, lodging star rating system, designs, icons, trademarks, service marks, logos, and written content (collectively, “Content”), and the arrangement and compilation of the Content and the infrastructure used to provide such Content (which are also included in the definition of “Content”), are proprietary to and owned by DriverFly, its corporate affiliates, and/or it’s third party partners. Some trademarks, service marks and other company designations on the Site may belong to third parties and are used on the Site under license or for identification purposes only. The use of marks on the Site that belong to third parties, and the availability on the Site of goods or services from such third parties, should not be construed as an affiliation, endorsement or sponsorship of this Site and its services by any such third party.</p>
                <p className="text-secondary">The Content includes, but is not limited to, the following trademarks and service marks, and registered trademarks and service marks, owned by DriverFly.co: DRIVERFLY, DRIVERFLY.CO, DRIVERFLYAPP, DIGITALHIRINGAPP.COM.</p>
                <h5 className=" py-3">E. Claims of Copyright Infringement</h5>
                <p className="text-secondary">DriverFly respects the intellectual property rights of others and asks that you do the same. If you believe in good faith that material or content on the Site infringes your copyrighted work, you (or your agent) may send us a written notice under the Digital Millennium Copyright Act that includes the following information:</p>

                <ol>
                    <li>
                        <p> A clear identification of the copyrighted work that you claim has been infringed. </p>
                    </li>
                    <li>
                        <p> A clear identification of the material you claim infringes the copyrighted work, and information that will allow us to locate that material on the Site, such as a link to the infringing material.</p>
                    </li>
                    <li>
                        <p> Your contact information so that we can reply to your complaint, preferably including an email address and telephone number.</p>
                    </li>
                    <li>
                        <p> A statement that you have a “good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.”</p>
                    </li>
                    <li>
                        <p> A statement that “the information in the notification is accurate, and under penalty of perjury, the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.”</p>
                    </li>
                    <li>
                        <p> The written notice must be signed by the person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</p>
                    </li>
                </ol>

                <p className="text-secondary">Copyright infringement notifications can be sent to DriverFly.co by email to legal@DriverFly.co.</p>
                <p className="text-secondary">We will not process your notice if it is incomplete. DriverFly.co reserves the right to remove content on the Site alleged to be infringing without prior notice, at its sole discretion. You may wish to seek legal counsel prior to submitting a copyright infringement notification. You could be held liable for alleging false claims of copyright infringement.</p>
                <h5 className=" py-3">II. Acceptable Use of the Website</h5>
                <p className="text-secondary">You must be at least 18 years of age to be eligible to participate in any services available through DriverFly. Accessing materials on this Site by certain persons in certain countries may not be lawful.</p>
                <p className="text-secondary">DriverFly grants you a limited, personal, nontransferable, non-sub licensable, revocable license to access and use this Site only as expressly permitted in this Agreement. You may only use this Site to hire or apply for jobs. You agree to provide correct and true information in connection with your use of this Site. It is a violation of law to falsify your driving records and background information. DriverFly reserves the right to cancel any application that it reasonably believes to have been fraudulently made.</p>
                <p className="text-secondary">Your use of and access to the Site does not grant you any license or right to use any of the Content on the Site. Any rights or licenses not expressly granted herein are reserved. It is expressly prohibited for you to use, transmit, copy, reproduce, download, print, modify, display, “frame”, “mirror”, publish, create derivative works from, transfer or sell the Content or any part of the Site without authorization from DriverFly.co or Digitalhiringapp.com.</p>
                <p className="text-secondary">Without limiting the above, and whether or not you have a commercial purpose, you agree not to:</p>

                <ol>
                    <li>
                        <p> use this Site to make any speculative, false or fraudulent Requests or any Requests in anticipation of demand;</p>
                    </li>
                    <li>
                        <p>access, monitor, copy, or reproduce any Content of this Site using any robot, spider, scraper or other automated means or manual process for any purpose without express written permission of DriverFly.co or Digitalhiringapp.com;</p>
                    </li>
                    <li>
                        <p>violate the restrictions in any robot exclusion headers on this Site or bypass or circumvent other measures employed to prevent or limit access to this Site;</p>
                    </li>
                    <li>
                        <p> take any action that imposes, or may impose, in our discretion, an unreasonable or disproportionately large load on our infrastructure;</p>
                    </li>
                    <li>
                        <p>deep-link to any portion of this Site for any purpose;</p>
                    </li>
                    <li>
                        <p>submit, post, transmit, upload or deliver any unlawful content, information or comments to or through this Site;</p>
                    </li>
                    <li>
                        <p>submit, post, transmit, deliver, upload or provide links to, any content containing material that could be considered harmful, harassing, obscene, pornographic, indecent, violent, abusive, profane, insulting, threatening, tortuous, defamatory, false, hateful or otherwise objectionable;</p>
                    </li>
                    <li>
                        <p>submit, post, transmit, upload or deliver any content, information or comments to this Site that infringe or violate the intellectual property of others including, without limitation, copyrights, patents, trademarks, laws governing trade secrets, and/or rights to privacy or publicity;</p>
                    </li>
                    <li>
                        <p>submit, post, transmit, upload or deliver any content or information that you do not have a right to make available under law or contractual or fiduciary relationships;</p>
                    </li>
                    <li>
                        <p>manipulate identifiers, including by forging headers, in order to disguise the origin of any content or information that you post, transmit or deliver;</p>
                    </li>
                    <li>
                        <p>use this Site in any manner which could damage, disable, overburden, impair or otherwise interfere with the use of this Site or other users’ computer equipment, or cause damage, disruption or limit the functioning of any software, hardware, or telecommunications equipment;</p>
                    </li>
                    <li>
                        <p>attempt to gain unauthorized access to this Site, any related website, Content, accounts, computer system, or networks connected to this Site, through hacking, password mining, or any other means; or</p>
                    </li>
                    <li>
                        <p>obtain or attempt to obtain any Content through any means not intentionally made available through this Site, including harvesting or otherwise collecting information about others such as email addresses.</p>
                    </li>
                </ol>
                <h5> III. User Rights and Responsibilities</h5>
                <h5 className='py-3'>Privacy Policy</h5>
                <p className="text-secondary">Your privacy is very important to us. Please read our
                    <Link href="/privacy-policy">
                        <a > Privacy Policy</a>
                    </Link>
                    , which governs your use of this Site. By using this Site, you agree that the terms of this policy are reasonable and satisfactory to you. You consent to the use of your personal information by DriverFly.co, digitalhiringapp.com, and/or any third party partners in accordance with the terms of this policy. DriverFly will not be responsible for any damages resulting from a lapse in compliance with the Privacy Policy.</p>
                <h5 className=" py-3">Accounts, Security, Passwords</h5>
                <p className="text-secondary">You may register to use this Site by completing the specified registration process and providing us with current, complete, and accurate information as requested by the online registration form. It is your responsibility to maintain the completeness and accuracy of your registration data, and any loss caused by your failure to do so is your responsibility. As part of the registration process, you will be asked to choose a security question. It is your responsibility to maintain the confidentiality of your security question and your account. You agree to notify DriverFly immediately of any unauthorized use of your account. DriverFly is not liable for any loss that you may incur as a result of someone else using your account, either with or without your knowledge.</p>
                <h5 className=" py-3">Third Parties</h5>
                <p className="text-secondary">Each User using this Site for or on behalf of a Third-party agrees to indemnify and hold each Covered Party harmless from and against any and all liabilities, losses, damages, suits and claims (including the costs of defense), relating to the Third-party’s or the User’s failure to fulfill any of its obligations as described above.</p>
                <h5 className=" py-3">No Agency Relationship</h5>
                <p className="text-secondary">DriverFly.co does not agree to act as your agent or recruiter in providing services through the Site.</p>
                <h5 className=" py-3">Modification/Termination of Usage</h5>
                <p className="text-secondary">DriverFly solely reserves the right to modify, suspend, or terminate this Site and/or any portion thereof, including any service or product available through the Site, and/or your profile, account password, or use of the Site, at any time for any reason with or without notice to you. In the event of termination, you will still be bound by your obligations under this Agreement and any additional terms, including the warranties made by you, and by the disclaimers and limitations of liability. Additionally, DriverFly shall not be liable to you or any third-party for any termination of your access to this Site.</p>
                <h5 className=" py-3">Links to Other Websites and Services</h5>
                <p className="text-secondary">To the extent this Site contains links to outside services and resources, or to the extent that third party websites link to this Site, any concerns regarding such services or resources should be directed to the particular outside service or resource provider. The presence of a link to a third-party site does not constitute or imply DriverFly’s endorsement or recommendation of the third-party, or of its content, products or services. If you choose to access any third-party site, you do so at your own risk.</p>
                <h5 className=" py-3">User Comments, Feedback, and Other Submissions</h5>
                <ol>
                    <li>
                        <p>Certain portions of the Site may permit you to submit, post, transmit or upload content created by you, such as photographs, information, text, images, and/or communications with other Site users (“User Submissions”). User Submissions also include content you post on your own social media pages that you give DriverFly permission to use; or example, by your posting of a hashtag that DriverFly is promoting or by any other indication of your acceptance of this Agreement.</p>
                    </li>
                    <li>
                        <p>User Submissions must comply with Section II of this Agreement. In addition, you agree that you will not submit any User Submission that: (a) includes material that is copyrighted, protected by trade secret, or otherwise subject to any other proprietary rights (including, without limitation, trademark rights or privacy and publicity rights) unless you are the owner of such rights or have express permission from the owner to post such material; (b) includes any material that, infringes upon, misappropriates, or violates the rights of any person or entity, or violates any applicable laws; (c) is unlawful, obscene, defamatory, libelous, threatening, pornographic, harassing, indecent, violent, abusive, profane, false, hateful, racially or ethnically offensive, encourages conduct that would be considered a criminal offense, gives rise to civil liability, violates any law, or is otherwise inappropriate; (d) contains advertisements or solicitations of any funds, goods, or services; (e) is a communication by a user impersonating another user; (f) contains personal information, such as messages which identify an individual’s names, telephone numbers, social security numbers, account numbers, and/or addresses; or (g) could be considered bulk unsolicited communications.</p>
                    </li>
                    <li>
                        <p>By submitting, transmitting, posting, uploading, modifying or otherwise providing any User Submission to DriverFly via the Site, social media, or otherwise, whether solicited or unsolicited, you agree that you are granting DriverFly a royalty-free, fully paid, non-exclusive, irrevocable, perpetual, unrestricted, worldwide, sub-licensable, transferable license to use, copy, reproduce, broadcast, publish, print, transmit, perform, display, create derivative works from, translate, adapt, modify, distribute, exhibit, disseminate and otherwise exploit (collectively, “Use”) such User Submission for any purpose, including, without limitation, for advertising, marketing and promotional purposes, in any media, now or hereafter known, even if this Agreement is later modified or terminated.</p>
                    </li>
                    <li>
                        <p>Subject to the terms of its Privacy Policy, DriverFly shall also have the right, but not the obligation, to Use your username, real name, image, likeness, caption, location information, and/or other identifying information in connection with the Use of User Submissions.</p>
                    </li>
                    <li>
                        <p>You represent and warrant that the Use of the User Submission by DriverFly will not infringe upon, misappropriate or violate the intellectual property, privacy, publicity, statutory, contractual, personal or other rights of any person or entity, or violate any applicable law. You agree to obtain all necessary rights for the Use by DriverFly of User Submission, including without limitation, written releases of all rights of privacy and publicity from all individuals included in any way in a User Submission.</p>
                    </li>
                    <li>
                        <p>DriverFly reserves the right to monitor, review, alter, edit, refuse to post, or remove any User Submission. You agree that DriverFly does not have any obligation to use or respond to any User Submission. DriverFly has no control over whether User Submissions are of a nature that you might find offensive, distasteful or otherwise unacceptable and, accordingly, DriverFly expressly disclaims any and all responsibility for User Submissions.</p>
                    </li>
                    <li>
                        <p>DriverFly will fully cooperate with any law enforcement authorities or court order requesting or directing DriverFly to disclose the identity of anyone posting User Submissions that violate these Terms and Conditions or any law or regulation. DriverFly may also disclose such information if it has a good faith belief that such disclosure is reasonably necessary to protect the rights, property, or personal safety of DriverFly, it’s customers, the Covered Parties, or the public.</p>
                    </li>
                    <li>
                        <p>By submitting a User Submission, you acknowledge that any personal data supplied by you may be used by DriverFly or its agents for sending commercial marketing and communication emails to you. DriverFly may also share any such personal data with third parties for the purpose of commercial marketing and communications. You hereby consent to such use. You have the right to access, modify and request the destruction of your personal data at any time by sending a request to DriverFly; and you have the right to opt out from receiving such marketing and communication at any time by sending a message to DriverFly.</p>
                    </li>
                    <li>
                        <p>You agree to defend and indemnify DriverFly and any Covered Parties that are involved in creating, sponsoring, promoting, or otherwise making available the Site and its Content from and against any claims, causes of action, demands, recoveries, losses, damages, fines, penalties, or other costs or expenses of any kind or nature (including, but not limited to reasonable legal and accounting fees) that result from any User Submission that you made or any Use of a User Submission by DriverFly.</p>
                    </li>
                </ol>
            </div>
        </>
    )

}

TermsAndPolicies.getLayout = function getLayout(page) {
    return (
        <PublicLayout title="terms_and_condition">
            {page}
        </PublicLayout>
    )
}
