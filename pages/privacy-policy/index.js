import Head from "next/head";
import Breadcrumb from "../../components/breadcrumbs/breadcrumb";
import { PublicLayout } from "../../components/layouts/public-layout";
import { useTranslation } from "../../hooks/use-translation";

export default function TermsAndPolicies2() {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("PRIVACY_POLICY_META_TITLE")} </title>
                <meta
                    name="description"
                    content={t("PRIVACY_POLICY_META_DESC")}
                    key="desc"
                />
            </Head>
            <div className="container my-5 privacy__policies__container">
                <h2 className="my-4">Privacy &amp; Cookies Policy </h2>
                <p className="text-secondary">
                    Your privacy and the security and confidentiality of your data are very important to us.
                    You’ve placed your trust in us by using our services. We value that trust. We are
                    committed to protecting and safeguarding any personal data that you give us. We want
                    you to understand how we use your data and your rights regarding that data.</p>
                <p className="text-secondary">
                    This website is owned and operated by DriverFly Inc. (“DriverFly”). This Privacy & Cookies
                    Policy explains how we collect, use, share, and process personal data through the
                    DriverFly website, the DriverFly mobile site, our iPhone, Android and other mobile
                    applications and any other online communications and interfaces (the “site”).</p>
                <p className="text-secondary">
                    Please read the Privacy & Cookies policy below to learn about our practices. By visiting
                    the site, you acknowledge that you have read and understand the practices described in
                    this policy.                </p>
                <p className="text-secondary">
                    1. Our Collection of Your Personal Data
                </p>
                <p className="text-secondary">
                    In order to provide you with our online driver recruiting software and services, we must
                    collect personally identifiable information (“Personal Data”). We may collect the following
                    categories of Personal Data you provide to us while you are using the site:                </p>
                <div>
                    <ol>
                        <li>
                            <b>Identifiers</b>:
                            <ol>
                                <li>Name</li>
                                <li>Address</li>
                                <li>Phone number</li>
                                <li>Email address</li>
                                <li>Age</li>
                                <li>Date of birth</li>
                                <li>Gender</li>
                                <li>
                                    Username and password for our site and any other information you may
                                    choose to provide either directly or through your use of social media sign-in
                                    features (such as Facebook Connect) or as may be required to fulfill the
                                    requested service; and                                </li>
                                <li>IP address</li>
                            </ol>
                        </li>
                    </ol>
                    <ol>
                        <li>
                            <b>Commercial information</b>:
                            <ol>
                                <li>
                                    Credit card number and payment information (where applicable)
                                </li>
                            </ol>
                        </li>
                    </ol>
                    <ol>
                        <li>
                            <b>Internet or other electronic network activity information</b>:
                            <ol>
                                <li>IP address</li>
                                <li>Device information</li>
                                <li>Web log information</li>
                                <li>Search preferences related to specific searches and</li>
                                <li>Bids through your interactions with our site</li>
                            </ol>
                        </li>
                    </ol>
                    <ol>
                        <li>
                            <b>Inferences drawn from other Personal Data</b>:
                            <ol>
                                <li>
                                    Profile or purchasing habits inferred from Personal Data
                                </li>
                                <li>Device information</li>
                                <li>Web log information</li>
                                <li>Search preferences related to specific searches and</li>
                                <li>Bids through your interactions with our site</li>
                            </ol>
                        </li>
                    </ol>
                    <ol>
                        <li>
                            <b>Geolocation data</b>:
                            <ol>
                                <li>General device location and</li>
                                <li>With consent, specific device location</li>
                            </ol>
                        </li>
                    </ol>
                    <p className="text-secondary">
                        In addition, we may receive certain categories of Personal Data listed above from sources
                        other than you, specifically from the following categories of sources:                    </p>
                    <ol>
                        <li>
                            Third party applications (including, but not limited to Facebook and Google) that you use for single sign-on
                        </li>
                        <li>Our affiliates, subsidiaries, or business partners</li>
                        <li>Third party data providers and</li>
                        <li>Individuals purchasing services on your behalf.</li>
                    </ol>
                    <p className="text-secondary">
                        If you submit data on behalf of other applicants or users of the system, you must make sure that you have the right to provide their personal Data to us and that those other applicants or users have accepted how DriverFly uses their information as stated in this policy. Personal Data of other applicants or users is collected only for the purpose of providing such Personal Data to the appropriate employer or applicant to fulfill the requested service, or as otherwise may be required or permitted by applicable law.
                    </p>
                    <ol>
                        <li> Protecting Your Personal Data</li>
                    </ol>
                    <p className="text-secondary">Protecting your Personal Data is a top priority at DriverFly. We employ technical,
                        administrative and physical safeguards that are designed to prevent unauthorized access,
                        maintain data accuracy, and to ensure correct use of Personal Data. If you have reason
                        to believe that your interaction with us is no longer secure (e.g., if you feel that the security
                        of any account you might have with us has been compromised), please contact us
                        immediately as detailed in the “Contact Us” section of this Privacy & Cookies Policy.</p>
                    <ol>
                        <li> Use of Your Personal Data</li>
                    </ol>
                    <p className="text-secondary">
                        We use Personal Data to provide you with services, to build features that will make the
                        services easier to use, and to contact you. This includes a faster website experience,
                        better customer support, timely notice of new services and special offers, and more
                        relevant content.                    </p>
                    <p className="text-secondary">
                        Our legal basis to use your data, where one is required to be provided by applicable law, is as follows:
                    </p>
                    <p className="text-secondary">
                        (a) as necessary to perform a transaction;
                    </p>
                    <p className="text-secondary">
                        (b) as necessary to comply with a legal obligation (such as record keeping to substantiate our compliance with law);
                    </p>
                    <p className="text-secondary">
                        (c) where you have provided consent as appropriate under applicable law; and
                    </p>
                    <p className="text-secondary">
                        (d) necessary for legitimate interests such as marketing that you have not previously objected to receiving.
                    </p>
                    <p className="text-secondary">
                        In general, you need to provide the Personal Data in order to create or apply for jobs and
                        otherwise enter into a transaction with us, for us to provide you with driver recruiting
                        services, and as may be required for our compliance purposes in connection with such
                        transactions, except in limited instances when we indicate that certain information is
                        voluntary. Not providing Personal Data may prevent us from providing you with requested
                        information and carrying out transactions. However, you can always exercise control over
                        our use of Personal Data for direct marketing and you can control the use of cookies on
                        our site by contacting legal@DriverFly.co.</p>
                    <p className="text-secondary">
                        We also use your Personal Data as described in the “Sharing Your Personal Data” section below.
                    </p>
                    <ol>
                        <li> Sharing Your Personal Data</li>
                    </ol>
                    <p className="text-secondary">
                        DriverFly only shares your Personal Data as disclosed in this Privacy &amp; Cookies Policy or as otherwise authorized by you.
                    </p>
                    <p className="text-secondary">
                        <b>Sharing your Personal Data for business purposes</b>: We may share your Personal Data that we collect with the categories of recipients below for our business purposes:
                    </p>
                    <p className="text-secondary">
                        <b>Suppliers</b>: We may share your Personal Data with motor carriers or other involved third parties. Please refer to the websites of third-party suppliers for their Privacy Policies.
                    </p>
                    <p className="text-secondary">
                        <b>Business Partners</b>: In order to provide you with certain services, we may share your
                        Personal Data with our business partners, or require that you transact directly with a
                        business partner. When you provide Personal Data in connection with these types of
                        services, you are providing such Personal Data to those business partners, which hold
                        such Personal Data on our behalf. Our contracts with our business partners offering these
                        services require them to maintain such Personal Data in accordance with this Privacy &
                        Cookies Policy. Please refer to the websites of business partners for their Privacy Policies
                        and other information.
                    </p>
                    <p className="text-secondary">
                        <b>DriverFly’s Agents and Vendors</b>: Many of the operations we perform require us to hire other companies to help us. Examples of such operations include sending and delivering postal mail and email, analyzing data we collect, marketing our services, handling credit card transactions and providing customer service. While the companies we engage have access to Personal Data to perform their functions, they may not use it for other purposes. DriverFly requires these vendors to enter into confidentiality agreements and to agree to act in a manner consistent with the relevant principles articulated in this Privacy & Cookies Policy. In some instances, we utilize service provider platforms to help us provide certain services, such as career service providers. This Privacy & Cookies Policy governs the collection and use of your Personal Data even though you are on a third-party website. In these instances, you will always know whose Privacy & Cookies Policy governs the collection and use of your Personal Data by clicking on the Privacy & Cookies Policy link provided.
                    </p>
                    <p className="text-secondary">
                        <b>Future Business Transfers</b>: Our business is constantly changing. As part of that process, DriverFly may sell or buy other companies, and Personal Data may be transferred as part of these transactions. It is also possible that DriverFly, or substantially all of its assets, may be acquired by another company, whether by merger, sale of assets or otherwise, and Personal Data may be transferred as part of such a transaction. In such cases, the acquiring company would be required to honor the privacy promises in this Privacy & Cookies Policy or obtain your consent to any material changes to how your Personal Data will be handled.
                    </p>
                    <p className="text-secondary">
                        <b>Compliance with Law and Other Disclosures</b>: DriverFly reserves the right to release Personal Data in order to comply with applicable law or to comply with a judicial proceeding, court order, or legal process served on us: We may also release Personal Data to enforce or apply Terms and Conditions applicable to the services, to protect us or others against fraudulent or inappropriate activities, or to otherwise protect the rights, property or safety of DriverFly, our affiliated companies, our customers, or others.
                    </p>
                    <p className="text-secondary">
                        <b>Sharing your Personal Data for other purposes</b>: As described below in the section on Our Policy on Cookies and Other Tracking Technologies we may share internet or other electronic network activity information about you, as well as general geolocation data based on IP address, with third party cookie providers we use on our Sites which may use this data for purposes other than strictly operational purposes. In certain jurisdictions, such sharing may be considered a “sale” of your Personal Data and you may have the right under applicable law to opt-out of or object to such sharing.
                    </p>
                    <ol>
                        <li>
                            Your Choices Regarding Our Collection and Use of Your Data for
                            Marketing and Other Purposes
                        </li>
                    </ol>
                    <p className="text-secondary">
                        As explained above, you may choose not to provide us with Personal Data; however, doing so may prevent us from providing you with requested information and carrying out transactions.                    </p>
                    <p className="text-secondary">
                        <b>
                            You have control regarding our use of your Personal Data for direct marketing.
                        </b> If you would prefer not to receive notices of special savings or promotions, or other marketing materials or offers, you may simply opt-out from receiving them by using the unsubscribe hyperlink provided in any communication, updating your choices in your account profile or by contacting legal@DriverFly.co. Where required by law, we ask for your prior consent for such direct marketing. Please note that even if you opt-out of receiving marketing communications from us, we may need to send you service-related communications, such as confirmations of any future job creations or application submissions you make.
                    </p>
                    <p className="text-secondary">
                        You may also have the opportunity on our site to provide a mobile phone number to receive certain alerts or updates, which may be discontinued at any time. You may also use the settings within your mobile app to enable or turn off mobile push notifications from us. Text opt-in consent data will not be sold or shared with third parties for promotional or marketing purposes.
                    </p>
                    <ol>
                        <li> Our Policy On Cookies and Other Tracking Technologies</li>
                    </ol>
                    <p className="text-secondary">
                        Cookies and similar tracking technologies, such as beacons, scripts, and tags, are small bits of code, usually stored on a user’s computer hard drive or device, which enable a website to “personalize” itself for each user by remembering information about the user’s visit to the website.
                    </p>
                    <p className="text-secondary">
                        The site uses cookies to store your preferences, display content based upon what you view to personalize your visit, analyze trends, administer the site, track users’ movements around the site, serve targeted advertising and gather demographic information about our user base as a whole. On mobile websites and mobile apps, we may use Anonymous Device IDs and/or Advertiser Identifiers in a manner similar to our use of cookies on our websites. Although these activities involve developing an understanding of you as a user, we use this information for the purposes described. Given the nature of our site and services as an applicant tracking software solution and job board, and the limited amount of Personal Data we obtain about you, this activity does not produce legal effects for you nor otherwise does it significantly affect you. More detailed information about our use of cookies and how to opt-out of advertising and certain other cookies is provided below.                    </p>
                    <p className="text-secondary">
                        <b>DriverFly Cookies (First Party Cookies)</b>: We use our cookies to improve your web-browsing experience. For example, we use a cookie to reduce the time it takes for you to submit company job information or driver application data by storing prior submission data. We will also use a cookie to keep track of your search criteria while you are engaging in any of DriverFly’s corresponding services. DriverFly cookies are associated with your Personal Data. However, no third party may use the information we collect through DriverFly cookies for their own purposes.
                    </p>
                    <p className="text-secondary">
                        <b>Third Party Cookies</b>: We work with third parties that place cookies on our site to provide their services, including:
                    </p>
                    <ol>
                        <li>
                            <b>Ad Targeting</b>: We work with third-party advertising companies to serve ads while you are visiting our site. We permit these companies to place and access their own cookies on your computer in the course of serving advertisements on this site. In order to provide advertisements about goods and services of interest to you, these companies may use information obtained through their cookies (which do not include your name, address, email address or telephone number) about your visits to the site and other websites, in combination with non-personally identifiable information about your purchases and interests from other online sites. Other companies’ use of their cookies is subject to their own privacy policies and not ours.
                        </li>
                        <li>
                            <b>Data Providers</b>: We also allow data providers to collect web log data from you (including IP address and information about your browser or operating system), when you visit our site, or place or recognize a unique cookie on your browser to enable you to receive customized ads or content. These cookies contain no personally identifiable information. The cookies may reflect demographic or other data, with identifying elements removed, linked to data you voluntarily have submitted to us, e.g., your email address, that we may share with data providers solely in hashed, non-human readable form.
                        </li>
                        <li>
                            <b>Analytics/Measurement</b>: We also use third-party analytics cookies to gain insight into how our visitors use the site and optimize and improve our site. The data we gather includes which web pages you have viewed, which referring/exit pages you have entered and arrived from, which platform type you have used, date and time stamp information, and details such as the number of clicks you make on a given page, your mouse movements and scrolling activity, the search words you use and the text you type while using our site. We also make use of analytics cookies as part of our online advertising campaigns to learn how users interact with our site after they have been shown an online advertisement, which may include advertisements on third-party websites.
                        </li>
                        <li>
                            <b>Remarketing Pixel Tags and Other Technologies</b>: We may share web site usage information with third-party advertising companies for the purpose of managing and targeting advertisements and for market research. For these purposes, we and our third-party advertising companies may place or recognize a cookie on your computer or device or directly in our emails or communications or may place pixel tags (also called clear gifs) on certain web pages. We will then use the information that is collected to serve you relevant advertisements when you are visiting other sites on the Internet. These advertisements may be targeted to specific searches you conducted on DriverFly during earlier browsing sessions.
                        </li>
                        <li>
                            <b>Flash Cookies</b>: Our partners, who provide certain features on our site or display advertising based on your browsing activity, also use Local Shared Objects such as Flash cookies, and Local Storage such as HTML5, to collect and store content information and preferences. Various browsers may offer their own management tools for removing HTML5 local storage. To manage Flash cookies, please <a
                                target={"blank"}
                                href="https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html"
                            >
                                click here{" "}
                            </a>
                            .
                        </li>
                        <li>
                            <b>Controlling Cookies</b>: You have a choice over the use of cookies as described in this Privacy & Cookies Policy. Our site is not currently configured to respond to Do Not Track signals. If you would rather we do not use DriverFly cookies when you visit us, please configure your specific browser settings to reject cookies.
                        </li>
                    </ol>
                    <p className="text-secondary">
                        To opt-out of third-party cookies, please utilize the appropriate option(s) below:
                    </p>
                    <ol>
                        <li>
                            To opt-out of ad targeting cookies set by Google and double click on our Site, click here: <a
                                target={"blank"}
                                href="https://www.google.com/settings/u/0/ads?hl=en"
                            >
                                https://www.google.com/settings/u/0/ads?hl=en
                            </a>
                            .
                        </li>
                        <li>
                            To disable the display of advertisements served by Criteo, click here: <a target={"blank"} href="https://www.criteo.com/privacy/">
                                https://www.criteo.com/privacy/
                            </a>.
                        </li>
                        <li>
                            To generally (i.e. not just for this Site) opt-out of receiving personalized ads from third party advertisers and ad networks who are members of the Network Advertising Initiative (NAI) or who follow the Digital Advertising Alliance’s (DAA) Self-Regulatory Principles for Online Behavioral Advertising visit the opt-out pages on the NAI website and DAA website or <a target={"blank"} href="https://preferences-mgr.truste.com/">click here</a>. If you are located in the European Union, please <a target={"blank"} href="https://www.youronlinechoices.eu/">
                                click here
                            </a> to opt out.
                        </li>
                        <li>
                            In order to control the collection of data for analytical purposes by Google Analytics, you may want to visit the following link: <a
                                target={"blank"}
                                href="https://tools.google.com/dlpage/gaoptout"
                            >
                                https://tools.google.com/dlpage/gaoptout
                            </a>.
                        </li>
                        <li>
                            For instructions on how to configure your browser settings to reject cookies being served by companies that are not part of the NAI or DAA, click here. You can also delete all cookies that are already on your computer’s hard drive by searching for and deleting files with “cookie” in it.
                        </li>
                    </ol>
                    <p className="text-secondary">
                        Please keep in mind that without cookies you may not have access to certain features on the site, including access to your profile or account and certain personalized content. Removing all cookies from your computer could also affect your subsequent visits to certain web sites, including this site, by requiring that, for example, you enter your login name when you return to that website.                    </p>
                    <p className="text-secondary">
                        <b>Mobile Devices</b>
                    </p>
                    <ol>
                        <li>
                            We and/or our data providers may collect and store a unique identifier matched to your mobile device in order to deliver customized ads or content while you use applications or surf the internet, or to identify you in a unique manner across other devices or browsers. In order to customize these ads or content, we or a data partner may collect demographic or other data, with identifying elements removed, about you received from third parties, as well as data you voluntarily have submitted to us (e.g., your email address) and/or data passively collected from you, such as your device identifier or IP address. For advertising purposes, however, we will share your email address with our data partners solely in hashed, non-human readable form.
                        </li>
                    </ol>
                    <p className="text-secondary">
                        If you no longer wish to receive interest-based advertising on your mobile device browser or applications, please refer to your device’s operating system settings, or follow instructions below.
                    </p>
                    <ol>
                        <li>
                            Android Users (version 2.3 and above): To use the “opt-out of interest-based advertising” option, follow the instructions provided by Google here: <a
                                target={"blank"}
                                href="https://support.google.com/googleplay/answer/3405269"
                            >
                                Google Play Help
                            </a>.
                        </li>
                        <li>
                            iOS users (version 6 and above): To use the “Limit Ad-Tracking” option, follow the instructions provided by Apple here: <a
                                target={"blank"}
                                href="https://support.apple.com/en-us/HT202074"
                            >
                                Apple Support Center
                            </a>. You can also use the tools available at <a href="https://youradchoices.com/appchoices" target="blank">https://youradchoices.com/appchoices</a> and <a href="https://www.networkadvertising.org/mobile-choice" target="blank">https://www.networkadvertising.org/mobile-choice</a> to control cookies and similar technologies on your mobile device.
                        </li>
                    </ol>
                    <ol>
                        <li>
                            How You Can Access or Change Your Personal Data and Your Data Subject Rights
                        </li>
                    </ol>
                    <p className="text-secondary">
                        DriverFly understands that you may want to change, access or delete your Personal Data. You may do so by accessing your profile or by reaching out to legal@DriverFly.co. To protect your privacy and security, we will need to verify your identity before acting on a request. In most circumstances, we will then answer your request within 30 days of verification. If you have created a profile on any of the services available on the site, your email address and password are required in order to access your profile information.</p>
                    <p className="text-secondary">
                        Depending on the jurisdiction where you reside, you may have specific rights under local legislation to: (i) request access to your Personal Data; (ii) request rectification of your Personal Data; (iii) request erasure of your Personal Data; (iv) request restriction of processing of your Personal Data; (v) request data portability; and (vi) object to the processing of your Personal Data, including opting out of certain sharing of your Personal Data or processing of your Personal Data for marketing purposes. You may also have the right to request from us the Personal Data from or about you that we have “sold” (as such term is defined under applicable law) or disclosed for a business purpose within the past 12 months. Please contact legal@DriverFly.co if you would like to exercise such rights. You may also have the right to lodge a complaint with a supervisory authority. Please note that, in order to provide appropriate security to your information, we may require additional data points or information from you in order to verify your identity prior to completing certain requests related to your Personal Data (e.g., requiring the matching of two or three data points provided by you with information maintained by DriverFly).</p>
                    <p className="text-secondary">
                        We will retain your information for as long as your account is active or as needed to provide you services. In addition, we will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.                    </p>
                    <ol>
                        <li> Cross-Border Data Transfer</li>
                    </ol>
                    <p className="text-secondary">
                        Our site is operated in the United States. If you are located outside the US, your Personal Data will be transferred to the US, a jurisdiction that may not provide an equivalent level of protection as your home jurisdiction. The cross-border transfer to the US is necessary for the conclusion or performance of your transaction, and/or for the establishment, exercise, and defense of legal claims. To the extent the provision of your Personal Data is not necessary for those purposes, or as otherwise permitted by local law, your use of the site or provision of any Personal Data constitutes your consent to the cross-border transfer of Personal Data and the other activities identified in this Privacy & Cookies Policy.                    </p>
                    <p className="text-secondary">
                        We take appropriate steps and have put safeguards in place to help ensure that your Personal Data remains protected in keeping with this Privacy & Cookies Policy. For example, DriverFly enters into data transfer agreements which incorporate strict data transfer terms, such as the European Commission’s Standard Contractual Clauses, and require that a contract partner protect the Personal Data they process in accordance with applicable data protection law. DriverFly also participates in the EU-U.S. and Swiss-U.S. Privacy Shield Frameworks for Personal Data received in the United States from the European Union (“EU”) and Switzerland about customers and visitors to this site from the EU and Switzerland. While the European Court of Justice has held that the EU – U.S. Privacy Shield Framework is no longer “adequate” for the transfer of personal data from the EU to the U.S., DriverFly continues to abide by the privacy principles and other requirements of EU – U.S. Privacy Shield Framework with respect to personal data we collect in the U.S. from data subjects in the European Union.                    </p>
                    <ol>
                        <li> Age Restrictions</li>
                    </ol>
                    <p className="text-secondary">
                        You must be 18 years or older to use the site.
                    </p>
                    <ol>
                        <li> Links to Other Websites and Third-Party Services</li>
                    </ol>
                    <p className="text-secondary">
                        Our site contains links to other websites or services that are not owned or controlled by us, including links to websites of vendors, advertisers, sponsors, and partners. This Privacy & Cookies Policy only applies to information collected by our site. We have no control over these third-party websites, and your use of third-party websites and features are subject to privacy policies posted on those websites. We are not responsible or liable for the privacy or business practices of any third-party websites linked to our site or third-party social media feature or functionality offered on our site, such as Facebook, Google Plus, Twitter, and YouTube. Your use of third parties’ websites linked to our sites is at your own risk, so we encourage you to read the privacy policies of any linked third-party websites when you leave one of our sites, link into our site from another website or through a sign-in feature (for example, Facebook Connect or an Open ID provider), or utilize a third-party social media feature or functionality available on our site.                    </p>
                    <ol>
                        <li> California Residents – Your California Privacy Rights</li>
                    </ol>
                    <p className="text-secondary">
                        Pursuant to the California Consumer Privacy Act, California residents have the right to opt-out of the “sale” of your Personal Data, as detailed above. To exercise this right, contact legal@DriverFly.co. To protect your privacy and security, we will need to verify your identity before acting on a request. Please also refer to the options available for directly managing cookies and similar technologies on your desktop of mobile device, as described above.                    </p>
                    <ol>
                        <li> Changes to the Privacy &amp; Cookies Policy</li>
                    </ol>
                    <p className="text-secondary">
                        DriverFly may revise this Privacy & Cookies Policy to reflect changes in the law, our Personal Data collection and use practices, the features of our site, or advancements in technology. If we make any material changes, we will notify you by email (sent to the email address specified in your account) or through a prominent notice on the site prior to the change becoming effective.                    </p>
                    <ol>
                        <li> How to Contact Us</li>
                    </ol>
                    <p className="text-secondary">
                        Should you have any questions, or to exercise you rights as detailed above, please contact us at legal@DriverFly.co.</p>
                    <p className="text-secondary"></p>
                    <p className="text-secondary"></p>
                    <p className="text-secondary"></p>
                </div>
            </div>
        </>
    );
}

TermsAndPolicies2.getLayout = function getLayout(page) {
    return <PublicLayout title="privacy_policy">{page}</PublicLayout>;
}; 
