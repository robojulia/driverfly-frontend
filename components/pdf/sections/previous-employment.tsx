import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from '../title';
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    employerEntry: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#F9F9F9',
        borderLeftWidth: 3,
        borderLeftColor: '#006078',
        marginBottom: 8,
    },
    companyName: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 10,
        color: '#006078',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    field: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 8,
        color: '#666666',
        marginBottom: 2,
    },
    value: {
        fontFamily: 'Poppins',
        fontSize: 9,
        color: '#000000',
    },
    noData: {
        fontFamily: 'Poppins',
        fontSize: 9,
        fontStyle: 'italic',
        color: '#666666',
        marginTop: 8,
    },
});

const PreviousEmployment = ({ applicant, t }) => {
    const employers = applicant?.employers || [];

    return (
        <View style={styles.container}>
            <Title>{t("Previous Employment")}</Title>

            {employers.length === 0 ? (
                <Text style={styles.noData}>{t("NO_EMPLOYMENT_HISTORY_PROVIDED")}</Text>
            ) : (
                employers.map((employer, index) => {
                    const startDate = employer?.start_at
                        ? moment(employer.start_at).format('MM/DD/YYYY')
                        : 'N/A';
                    const endDate = employer?.end_at
                        ? moment(employer.end_at).format('MM/DD/YYYY')
                        : t("PRESENT");

                    return (
                        <View key={index} style={styles.employerEntry}>
                            <Text style={styles.companyName}>
                                {employer?.name || t("Company Name Not Provided")}
                            </Text>

                            <View style={styles.row}>
                                <View style={styles.field}>
                                    <Text style={styles.label}>{t("Employment Period")}</Text>
                                    <Text style={styles.value}>{startDate} - {endDate}</Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.field}>
                                    <Text style={styles.label}>{t("Phone")}</Text>
                                    <Text style={styles.value}>{employer?.phone || 'N/A'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text style={styles.label}>{t("Location")}</Text>
                                    <Text style={styles.value}>{employer?.city || 'N/A'}</Text>
                                </View>
                            </View>

                            {employer?.position && (
                                <View style={styles.row}>
                                    <View style={styles.field}>
                                        <Text style={styles.label}>{t("Position")}</Text>
                                        <Text style={styles.value}>{employer.position}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })
            )}

            {applicant?.employment_gap_details && (
                <View style={{marginTop: 10}}>
                    <Text style={styles.label}>{t("EMPLOYMENT_GAP_DETAILS")}</Text>
                    <Text style={styles.value}>{applicant.employment_gap_details}</Text>
                </View>
            )}
        </View>
    );
};

PreviousEmployment.displayName = 'PreviousEmployment';

export default PreviousEmployment;
