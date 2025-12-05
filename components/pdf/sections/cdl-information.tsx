import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from '../title';
import moment from 'moment';
import { formatEnumValue, formatEnumValues } from '../utils/format-enum';

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

const CDLInformation = ({ applicant, t }) => {
    return (
        <View style={styles.container}>
            <Title>{t("CDL Information")}</Title>

            {/* License Number and State */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("driver_license_number")}</Text>
                    <Text style={styles.value}>{applicant?.license_number || 'N/A'}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("state_issued")}</Text>
                    <Text style={styles.value}>{applicant?.license_state || 'N/A'}</Text>
                </View>
            </View>

            {/* Expiration and CDL Class */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("expiration_date")}</Text>
                    <Text style={styles.value}>
                        {applicant?.license_expiry
                            ? moment(applicant.license_expiry).format('MM/DD/YYYY')
                            : 'N/A'}
                    </Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("cdl_class_type")}</Text>
                    <Text style={styles.value}>
                        {applicant?.license_type
                            ? t(`DriverLicenseType.${applicant.license_type}`)
                            : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Years of Experience */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("years_cdl_experience")}</Text>
                    <Text style={styles.value}>
                        {applicant?.years_cdl_experience !== null && applicant?.years_cdl_experience !== undefined
                            ? `${applicant.years_cdl_experience} ${t('YEARS')}`
                            : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Endorsements */}
            {applicant?.endorsements && applicant.endorsements.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("ENDORSEMENTS")}</Text>
                        <Text style={styles.value}>
                            {formatEnumValues(applicant.endorsements)}
                        </Text>
                    </View>
                </View>
            )}

            {/* License Restrictions */}
            {applicant?.license_restrictions && applicant.license_restrictions.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("LICENSE_RESTRICTIONS")}</Text>
                        <Text style={styles.value}>
                            {formatEnumValues(applicant.license_restrictions)}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

CDLInformation.displayName = 'CDLInformation';

export default CDLInformation;
