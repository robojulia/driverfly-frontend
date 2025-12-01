import Link from 'next/link';
import Head from 'next/head';
import { PublicLayout } from "../components/layouts/public-layout";
import Terms from "../public/css/terms.module.css"
import { useTranslation } from '../hooks/use-translation';

export default function TermsOfService() {

    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("TERMS_OF_SERVICES_META_TITLE")}  </title>
                <meta
                    name="description"
                    content={t("TERMS_OF_SERVICES_META_DESC")} key="desc"
                />
            </Head>
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>{t("TERMS_OF_SERVICE")}</h2>
                    </div>
                </div>
            </div>
            <div className={Terms.terms}>
                <ul>
                    <li>
                        <h4>Legal Action</h4>
                        <ul>
                            <li>
                                <h4>Arbitration and Dispute Resolution</h4>
                                <ul>
                                    <li>
                                        <h4>Disputes and Arbitration</h4>
                                        <p>DriverFly is committed to customer satisfaction. If you
                                            have a problem or dispute, we will try to resolve it. If we
                                            are unsuccessful, you may pursue your claim as explained in
                                            this section.</p>
                                        <p>You agree to give us an opportunity to resolve any problem,
                                            dispute, or claim relating in any way to the Sites and/or any
                                            of its related applications or services; any dealings with DriverFly,
                                            including with our marketing and customer service agents; the purchase,
                                            use, or performance of any services or products available through
                                            this Site; any representations made by DriverFly; or our Privacy
                                            Policy (collectively, “Claims”) by providing Notice to Customer
                                            Support. Unless prohibited by applicable law, any Claim must be brought
                                            within two (2) years from the date on which such Claim arose or accrued.
                                            If we are unable to resolve your Claims within 60 days of receipt, you may
                                            seek relief through arbitration or small claims court, as set forth below.
                                            This informal process is a condition precedent to your ability to initiate
                                            a claim in arbitration or small claims court.</p>
                                        <p>This Agreement shall be governed by the laws of the State of Delaware, United States of America, without regard to conflict of laws. All Claims or other matters in dispute between you or any Third- party and DriverFly, its subsidiaries or affiliates, or any third party partners or companies offering products or services through the Site, whether based upon contract, tort, statute, or otherwise, shall be governed by the laws of the State of Delaware, without regard to conflict of laws provisions that would result in the application of the laws of any other jurisdiction.</p>
                                    </li>
                                    <li>
                                        <h4>Mandatory Arbitration</h4>
                                        <p>Please read this provision carefully. It requires that any and all claims must be resolved by binding arbitration or in small claims court, and it prevents you from pursuing a class action or similar proceeding in any forum. These limitations apply to any claims against DriverFly, its subsidiaries or affiliates, any third party partners or companies offering products or services through the Site.</p>
                                        <p>In arbitration, a dispute is resolved by an arbitrator instead of a judge or jury. The arbitrator’s decision will generally be final and binding, with no right of appeal. Arbitration procedures are simpler and more limited than court procedures.</p>
                                        <ul>
                                            <li>
                                                <p>By using this Site, you, any Third-party, and DriverFly agree that any Claim, including claims regarding the applicability or validity of this arbitration provision, shall be resolved exclusively by final and binding arbitration administered by the American Arbitration Association (“AAA”) and conducted before a single arbitrator pursuant to the then applicable Rules and Procedures established by AAA (“Rules and Procedures”), except that, pursuant to subsection (e) below, under no circumstances may any claim be brought or arbitrated as a class action or proceed on a basis involving claims brought on a purported representative capacity (either on behalf of the general public or other users or persons, except that the arbitrator shall have the authority to award public injunctive relief where applicable).</p>
                                                <p>As an exception to arbitration, you, any Third-party, and DriverFly retain the right to pursue in a small claims court located in the federal judicial district that includes you or the Third-party’s billing address at the time of the Claim, any Claim that is within the court’s jurisdiction and proceeds on an individual basis. All Claims you or a Third-party bring against DriverFly, its subsidiaries or affiliates, or any third party partners or companies offering products or services through the Site must be resolved in accordance with this Disputes and Arbitration Section. All Claims filed or brought contrary to this Section shall be considered improperly filed and void.</p>
                                            </li>
                                            <li>
                                                <p>If you decide to seek arbitration, you must first send, by certified mail, a written Notice of Dispute (“Notice”) addressed to: Legal Department, DriverFly Inc, 2140 S. Dupont Highway, Camden, DE 19934 (“Notice Address”). The Notice must (i) describe the nature and basis of the Claim; and (ii) set forth the specific relief sought. If DriverFly and you, or DriverFly and any Third-party, do not reach an agreement to resolve the Claim within 60 days after the Notice is received, you, or the Third-party, may commence an arbitration proceeding. During the arbitration, the amount of any settlement offer made shall not be disclosed to the arbitrator until after the arbitrator determines the amount, if any, to which you, any Third-party, or DriverFly is entitled. The arbitration shall be held at a location determined by AAA pursuant to the Rules and Procedures, or at such other location as may be mutually agreed upon.</p>
                                            </li>
                                            <li>
                                                <p>To the extent that any Claim is held not to be subject to arbitration and proceeds in a Court other than small claims court, such Claim shall be filed only in the United States District Court for Delaware or, if there is no federal jurisdiction over the action, in the courts of the State of Delaware. You hereby consent and submit to the personal jurisdiction of such courts for the purposes of litigating any such Claim that is not subject to the arbitration provision and not pursued in small claims court, and agree that any such claim shall be resolved individually, without resort to any form of class action (as described more fully in section I.A.2.d below). You further agree that any and all Claims or other matters asserted in such dispute, whether based upon contract, tort, statute, or otherwise, shall be governed by the laws of the State of Delaware, without regard to conflict of laws provisions that would result in the application of the laws of any other jurisdiction.</p>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>Acceptable Use of the Website</li>
                    <li>User Rights and Responsibilities</li>
                </ul>
            </div>
        </>
    )

}

TermsOfService.getLayout = function getLayout(page) {
    return (
        <PublicLayout title="terms_of_services">
            {page}
        </PublicLayout>
    )
}
