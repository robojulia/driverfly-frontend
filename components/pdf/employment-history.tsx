import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './title';
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    employmentEntry: {
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        borderBottomStyle: 'solid',
    },
    companyName: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 11,
        color: '#006078',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    field: {
        fontFamily: 'Poppins',
        fontSize: 10,
        flex: 1,
    },
    fieldLabel: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 10,
        marginRight: 5,
    },
    fieldValue: {
        fontFamily: 'Poppins',
        fontSize: 10,
    },
    noData: {
        fontFamily: 'Poppins',
        fontSize: 10,
        fontStyle: 'italic',
        color: '#666666',
    },
});

const EmploymentHistory = ({ applicant, t }) => {
    const employers = applicant?.employers || [];

    return (
        <View style={styles.container}>
            <Title>{t("EMPLOYMENT_HISTORY")}</Title>

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
                        <View key={index} style={styles.employmentEntry}>
                            <Text style={styles.companyName}>{employer?.name || t("COMPANY_NAME_NOT_PROVIDED")}</Text>

                            <View style={styles.row}>
                                <View style={styles.field}>
                                    <Text>
                                        <Text style={styles.fieldLabel}>{t("PHONE")}: </Text>
                                        <Text style={styles.fieldValue}>{employer?.phone || 'N/A'}</Text>
                                    </Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>
                                        <Text style={styles.fieldLabel}>{t("LOCATION")}: </Text>
                                        <Text style={styles.fieldValue}>{employer?.city || 'N/A'}</Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.field}>
                                    <Text>
                                        <Text style={styles.fieldLabel}>{t("EMPLOYMENT_PERIOD")}: </Text>
                                        <Text style={styles.fieldValue}>{startDate} - {endDate}</Text>
                                    </Text>
                                </View>
                            </View>

                            {employer?.position && (
                                <View style={styles.row}>
                                    <View style={styles.field}>
                                        <Text>
                                            <Text style={styles.fieldLabel}>{t("POSITION")}: </Text>
                                            <Text style={styles.fieldValue}>{employer.position}</Text>
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })
            )}

            {applicant?.employment_gap_details && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("EMPLOYMENT_GAP_DETAILS")}: </Text>
                            <Text style={styles.fieldValue}>{applicant.employment_gap_details}</Text>
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

EmploymentHistory.displayName = 'EmploymentHistory';

export default EmploymentHistory;
