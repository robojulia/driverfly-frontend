import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from '../title';
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    field: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 9,
        color: '#666666',
        marginBottom: 2,
    },
    value: {
        fontFamily: 'Poppins',
        fontSize: 10,
        color: '#000000',
    },
});

const ApplicationDetails = ({ applicant, t }) => {
    const hasApplicationDetails =
        applicant?.already_applied_to_company !== undefined ||
        applicant?.already_worked_to_company !== undefined ||
        applicant?.authorize_to_communicate;

    if (!hasApplicationDetails) {
        return null; // Don't show section if no application details
    }

    return (
        <View style={styles.container}>
            <Title>{t("Application Details")}</Title>

            {/* Already Applied */}
            {applicant?.already_applied_to_company !== undefined && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Previously Applied to Company")}</Text>
                        <Text style={styles.value}>
                            {applicant.already_applied_to_company ? t('YES') : t('NO')}
                        </Text>
                    </View>
                </View>
            )}

            {/* Already Worked */}
            {applicant?.already_worked_to_company !== undefined && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Previously Worked for Company")}</Text>
                        <Text style={styles.value}>
                            {applicant.already_worked_to_company ? t('YES') : t('NO')}
                        </Text>
                    </View>
                </View>
            )}

            {/* Work Dates if previously worked */}
            {applicant?.already_worked_to_company && (
                <View style={styles.row}>
                    {applicant?.already_worked_start_date && (
                        <View style={styles.field}>
                            <Text style={styles.label}>{t("Start Date")}</Text>
                            <Text style={styles.value}>
                                {moment(applicant.already_worked_start_date).format('MM/DD/YYYY')}
                            </Text>
                        </View>
                    )}
                    {applicant?.already_worked_end_date && (
                        <View style={styles.field}>
                            <Text style={styles.label}>{t("End Date")}</Text>
                            <Text style={styles.value}>
                                {moment(applicant.already_worked_end_date).format('MM/DD/YYYY')}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/* Authorization to Communicate */}
            {applicant?.authorize_to_communicate && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Authorized to Communicate")}</Text>
                        <Text style={styles.value}>{applicant.authorize_to_communicate}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

ApplicationDetails.displayName = 'ApplicationDetails';

export default ApplicationDetails;
