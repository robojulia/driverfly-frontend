import { toast } from 'react-toastify'
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from '../../hooks/useAuth'
import { Row, Button, Col, ButtonToolbar } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ApplicantApi from "../../pages/api/applicant";
import { useEffectAsync } from "../../utils/react";
import { CloudArrowDownFill } from 'react-bootstrap-icons';
import {
    PDFDownloadLink,
    PDFViewer,
    Page,
    Text,
    View,
    Document,
    StyleSheet
} from '@react-pdf/renderer';
import ReactDOM from 'react-dom';

export default function DriverResume() {

    const { user } = useAuth();
    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();

    useEffectAsync(async () => {
        const applicant = await applicantApi.me.get();
    }, []);

    // Create styles
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

    const handleDownloadClick = () => {
        return <PDFViewer>
            <MyResume />
        </PDFViewer>
    }
    const MyResume = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );


    return (
        <>
            <Button
                onClick={handleDownloadClick}
                // active={true}
                variant="outline-secondary"
                className="download-resume mt-3 d-block"
            >
                {/* <span className="spinner-grow spinner-grow-sm"></span> */}
                <CloudArrowDownFill /> {t("RESUME")}
            </Button>
            <PDFDownloadLink document={<MyResume />} fileName="somename.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download now!'
                }
            </PDFDownloadLink>
        </>
    )
}
