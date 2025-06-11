import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './title';
import Label from './label';
import { PlusCircle } from 'react-bootstrap-icons'

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        borderRight: '1px solid #2DA2AF',
    },
    school: {
        fontFamily: 'Lato Bold',
        fontSize: 10,
    },
    degree: {
        fontFamily: 'Lato',
        fontSize: 10,
        marginBottom: '5px'
    },
    candidate: {
        fontFamily: 'Lato Italic',
        fontSize: 10,
    },
});

const BasicDetails = ({ applicant, t }) => (
    <View style={styles.container}>
        <Title>{t("basic_details")}</Title>
        <Text style={styles.degree}><PlusCircle />{applicant?.phone}</Text>
        <Text style={styles.degree}><Label>{t("PHONE")} : </Label>{applicant?.phone}</Text>
        <Text style={styles.degree}><Label>{t("EMAIL")} : </Label>{applicant?.email}</Text>
        <Text style={styles.degree}><Label>{t("STREET")} : </Label>{applicant?.street}</Text>
        <Text style={styles.degree}><Label>{t("CITY")} : </Label>{applicant?.city}</Text>
        <Text style={styles.degree}><Label>{t("HIGHEST_DEGREE")} : </Label>{applicant?.highest_degree}</Text>
        <Text style={styles.degree}><Label>{t("STATE")} : </Label>{applicant?.state}</Text>
        <Text style={styles.degree}><Label>{t("ZIP_CODE")} : </Label>{applicant?.zip_code}</Text>
        <Text style={styles.degree}><Label>{t("driver_license_number")} : </Label>{applicant?.license_number}</Text>
        <Text style={styles.degree}><Label>{t("expiration_date")} : </Label>{applicant?.license_expiry}</Text>
        <Text style={styles.degree}><Label>{t("state_issued")} : </Label>{applicant?.license_state}</Text>
        <Text style={styles.degree}><Label>{t("CDL_CLASS")} : </Label>{applicant?.license_type}</Text>
        <Text style={styles.degree}><Label>{t("years_cdl_experience")} : </Label>{applicant?.years_cdl_experience}</Text>
        <Text style={styles.degree}><Label>{t("EMERGENCY_CONTACT")} : </Label>{applicant?.emergency_contact_number}</Text>
        <Text style={styles.degree}><Label>{t("FULL_NAME")} : </Label>{applicant?.emergency_contact_name}</Text>
        <Text style={styles.degree}><Label>{t("RELATIONSHIP")} : </Label>{applicant?.emergency_contact_relationship}</Text>
        <Text style={styles.degree}><Label>{t("AUTHORIZED_TO_WORK_IN_THE_US")} : </Label>{applicant?.authorized_to_work_in_us ? t('YES') : t("No")}</Text>
    </View>
);

BasicDetails.displayName = 'BasicDetails';

export default BasicDetails;