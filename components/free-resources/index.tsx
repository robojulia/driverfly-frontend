import { Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { SocialLinks } from '../social/social-links';
import ViewCard from '../viewDetails/viewCard';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowUpRightSquare } from 'react-bootstrap-icons';

export default function FreeResources() {
    const { t } = useTranslation();
    function renderLink(url) {
        return (
            <Link href={url}>
                <Button
                    size="sm"
                    variant="primary"
                >
                    <ArrowUpRightSquare />

                </Button>
            </Link>
        );
    }

    return (<>
        <Row>
            <Col lg="4" sm="12">
                <ViewCard
                    title="vendor_discounts"
                    actions={renderLink("/third-party-resources")}
                >
                    {t("vendor_discounts_paragraph")}
                </ViewCard>
            </Col>
            <Col lg="4" sm="12">
                <ViewCard
                    title="salary_comparison_tool"
                    actions={renderLink("https://ctrecruiting.com/pay-calculator")}
                >
                    {t("salary_comparison_tool_paragraph")}
                </ViewCard>
            </Col>
            <Col lg="4" sm="12">
                <ViewCard
                    title="access_your_mvr"
                    actions={renderLink("/dashboard/driver/settings/applicant")}
                >
                    {t("access_your_mvr_paragraph")}
                </ViewCard>
            </Col>
        </Row>
        <Row>
            <Col lg="4" sm="12">
                <ViewCard
                    title="refer_a_friend_program"
                    actions={renderLink("https://ctrecruiting.com/referral")}
                >
                    {t("refer_a_friend_paragraph")}
                </ViewCard>
            </Col>
            <Col lg="4" sm="12">
                <ViewCard
                    title="enter_sweepstakes"
                // actions={(
                //     <Link href="/dashboard/driver/settings/applicant">
                //         <Button
                //             size="sm"
                //             variant="primary"
                //         >
                //             <ArrowUpRightSquare />

                //         </Button>
                //     </Link>
                // )}
                >
                    {t("enter_sweepstakes_paragraph")}
                </ViewCard>
            </Col>
            <Col lg="4" sm="12">
                <ViewCard
                    title="become_your_own_boss"
                    actions={renderLink("https://drivergrowth.com/")}
                >
                    {t("become_your_own_boss_paragraph")}
                </ViewCard>
            </Col>
        </Row>
        <Row>
            <Col lg="4" sm="12">
                <ViewCard
                    title="connect_with_our_community"
                // actions={(
                //     <Link href="/dashboard/driver/settings/applicant">
                //         <Button
                //             size="sm"
                //             variant="primary"
                //         >
                //             <ArrowUpRightSquare />

                //         </Button>
                //     </Link>
                // )}
                >
                    {t("join_our_driverfly_community")}
                </ViewCard>
            </Col>
            <Col lg="4" sm="12">
                <ViewCard
                    title="follow_us"
                // actions={(
                //     <Link href="/dashboard/driver/settings/applicant">
                //         <Button
                //             size="sm"
                //             variant="primary"
                //         >
                //             <ArrowUpRightSquare />

                //         </Button>
                //     </Link>
                // )}
                >
                    {t("follow_us_paragraph")}
                    <br />
                    <br />
                    <SocialLinks
                        showText
                        iconSize={25}
                        breakComponent={<br />}
                    />
                </ViewCard>
            </Col>
            <Col lg="4" sm="12">
                <ViewCard
                    title="sign_up_for_newsletter"
                // actions={(
                //     <Link href="https://drivergrowth.com/">
                //         <Button
                //             size="sm"
                //             variant="primary"
                //         >
                //             <ArrowUpRightSquare />

                //         </Button>
                //     </Link>
                // )}
                >
                    {t("sign_up_for_newsletter_paragraph")}
                </ViewCard>
            </Col>
        </Row>
    </>);
}
