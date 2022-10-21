import { toast } from 'react-toastify'
import { useTranslation } from "../../hooks/useTranslation";
import React, { useEffect, useState } from "react";
import { useEffectAsync } from "../../utils/react";
import { CloudArrowDownFill } from 'react-bootstrap-icons';
import ReactPDF, {
    PDFDownloadLink,
    PDFViewer,
    Page,
    Text,
    View,
    Document,
    StyleSheet
} from '@react-pdf/renderer';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import { ApplicantEntity } from '../../models/applicant/applicant.entity';
import { Button } from 'react-bootstrap';

export interface ApplicantResumeProps extends ViewApplicantDetailProps {
    disabled?: boolean | (() => boolean);
    className?: string;
}

export default function ApplicantResume({ applicant, disabled, className }: ApplicantResumeProps) {

    const { t } = useTranslation();

    const [resume, setResume] = useState<any>(null)
    const recreateResume = () => setResume(applicant ? generateResume(applicant) : null)

    useEffectAsync(async () => {
        recreateResume()
    }, [applicant]);

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    const generateResume = (applicant: ApplicantEntity) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>{applicant?.first_name}</Text>
                </View>
                <View style={styles.section}>
                    <Text>{applicant?.transmission_type}</Text>
                </View>
            </Page>
        </Document>
    );


    return (
        <>
            {resume &&
                <PDFDownloadLink
                    className={className}
                    document={resume}
                    fileName="Resume.pdf"
                >
                    {({ blob, url, loading, error }) =>
                        <Button disabled={!!disabled} className='btn btn-outline-secondary'>
                            {loading ? <span className="spinner-grow spinner-grow-sm"></span> : <CloudArrowDownFill />} {t("RESUME")}
                        </Button>
                    }
                </PDFDownloadLink>
            }
        </>
    )
}
