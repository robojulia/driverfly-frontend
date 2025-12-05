import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './title';
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
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
});

const LicenseInformation = ({ applicant, t }) => {
    return (
        <View style={styles.container}>
            <Title>{t("LICENSE_INFORMATION")}</Title>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("driver_license_number")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.license_number || 'N/A'}</Text>
                    </Text>
                </View>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("state_issued")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.license_state || 'N/A'}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("expiration_date")}: </Text>
                        <Text style={styles.fieldValue}>
                            {applicant?.license_expiry
                                ? moment(applicant.license_expiry).format('MM/DD/YYYY')
                                : 'N/A'}
                        </Text>
                    </Text>
                </View>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("CDL_CLASS")}: </Text>
                        <Text style={styles.fieldValue}>
                            {applicant?.license_type
                                ? t(`DriverLicenseType.${applicant.license_type}`)
                                : 'N/A'}
                        </Text>
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("years_cdl_experience")}: </Text>
                        <Text style={styles.fieldValue}>
                            {applicant?.years_cdl_experience
                                ? `${applicant.years_cdl_experience} ${t('YEARS')}`
                                : 'N/A'}
                        </Text>
                    </Text>
                </View>
            </View>

            {applicant?.license_restrictions && applicant.license_restrictions.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("LICENSE_RESTRICTIONS")}: </Text>
                            <Text style={styles.fieldValue}>
                                {applicant.license_restrictions.map(r => t(`LicenseRestrictions.${r}`)).join(', ')}
                            </Text>
                        </Text>
                    </View>
                </View>
            )}

            {applicant?.endorsements && applicant.endorsements.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("ENDORSEMENTS")}: </Text>
                            <Text style={styles.fieldValue}>
                                {applicant.endorsements.map(e => t(`DriverEndorsement.${e}`)).join(', ')}
                            </Text>
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

LicenseInformation.displayName = 'LicenseInformation';

export default LicenseInformation;
