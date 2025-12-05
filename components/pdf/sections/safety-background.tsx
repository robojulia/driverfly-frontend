import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from '../title';

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
    detailsBox: {
        backgroundColor: '#F9F9F9',
        padding: 8,
        marginTop: 4,
        marginBottom: 8,
        borderLeftWidth: 2,
        borderLeftColor: '#006078',
    },
    detailsText: {
        fontFamily: 'Poppins',
        fontSize: 9,
        lineHeight: 1.3,
        color: '#333333',
    },
    subsectionTitle: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 10,
        color: '#006078',
        marginTop: 10,
        marginBottom: 6,
    },
});

const SafetyBackground = ({ applicant, t }) => {
    return (
        <View style={styles.container}>
            <Title>{t("Safety Background")}</Title>

            {/* Drug Testing */}
            <Text style={styles.subsectionTitle}>{t("Drug Testing")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("CAN_PASS_DRUG_TEST")}</Text>
                    <Text style={styles.value}>{applicant?.can_pass_drug_test ? t('YES') : t('NO')}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("has_had_positive_drug_test")}</Text>
                    <Text style={styles.value}>{applicant?.positive_drug_test ? t('YES') : t('NO')}</Text>
                </View>
            </View>
            {applicant?.positive_drug_test_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.positive_drug_test_details}</Text>
                </View>
            )}

            {/* DUI History */}
            <Text style={styles.subsectionTitle}>{t("DUI History")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("HAS_DUIS")}</Text>
                    <Text style={styles.value}>{applicant?.has_past_dui ? t('YES') : t('NO')}</Text>
                </View>
                {applicant?.dui_years && applicant.dui_years.length > 0 && (
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("years_of_past_duis")}</Text>
                        <Text style={styles.value}>{applicant.dui_years.join(', ')}</Text>
                    </View>
                )}
            </View>

            {/* Criminal History */}
            <Text style={styles.subsectionTitle}>{t("Criminal History")}</Text>
            {applicant?.criminal_history ? (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.criminal_history}</Text>
                </View>
            ) : (
                <Text style={styles.value}>{t("NONE_REPORTED")}</Text>
            )}

            {/* Accidents */}
            <Text style={styles.subsectionTitle}>{t("accidents_last_5_years")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("COUNT")}</Text>
                    <Text style={styles.value}>{applicant?.accident_count || 0}</Text>
                </View>
            </View>
            {applicant?.accident_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.accident_details}</Text>
                </View>
            )}

            {/* Moving Violations */}
            <Text style={styles.subsectionTitle}>{t("voilations_in_last_3_years")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("COUNT")}</Text>
                    <Text style={styles.value}>{applicant?.moving_violations_count || 0}</Text>
                </View>
            </View>
            {applicant?.moving_violations_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.moving_violations_details}</Text>
                </View>
            )}

            {/* License Revocation */}
            <Text style={styles.subsectionTitle}>{t("has_had_license_revoked")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.value}>{applicant?.license_revoked ? t('YES') : t('NO')}</Text>
                </View>
            </View>
            {applicant?.license_revoked_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.license_revoked_details}</Text>
                </View>
            )}

            {/* PSP Violations */}
            <Text style={styles.subsectionTitle}>{t("has_had_psp_violations")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.value}>{applicant?.psp_violations ? t('YES') : t('NO')}</Text>
                </View>
            </View>
            {applicant?.psp_violations_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.psp_violations_details}</Text>
                </View>
            )}

            {/* Tickets */}
            <Text style={styles.subsectionTitle}>{t("has_had_tickets_last_5_years")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.value}>{applicant?.tickets ? t('YES') : t('NO')}</Text>
                </View>
            </View>
            {applicant?.tickets_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.tickets_details}</Text>
                </View>
            )}
        </View>
    );
};

SafetyBackground.displayName = 'SafetyBackground';

export default SafetyBackground;
