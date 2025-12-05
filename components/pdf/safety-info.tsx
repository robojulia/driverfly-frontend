import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './title';

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 11,
        color: '#006078',
        marginBottom: 8,
        marginTop: 8,
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
    detailsBox: {
        backgroundColor: '#F5F5F5',
        padding: 8,
        marginTop: 4,
        marginBottom: 8,
        borderRadius: 4,
    },
    detailsText: {
        fontFamily: 'Poppins',
        fontSize: 9,
        lineHeight: 1.4,
    },
});

const SafetyInfo = ({ applicant, t }) => {
    return (
        <View style={styles.container}>
            <Title>{t("SAFETY_INFORMATION")}</Title>

            {/* Drug Testing Section */}
            <Text style={styles.sectionTitle}>{t("DRUG_TESTING")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("can_pass_drug_test")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.can_pass_drug_test ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("positive_drug_test")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.positive_drug_test ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
            </View>
            {applicant?.positive_drug_test_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.positive_drug_test_details}</Text>
                </View>
            )}

            {/* DUI Section */}
            <Text style={styles.sectionTitle}>{t("DUI_HISTORY")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("has_past_duis")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.has_past_dui ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
                {applicant?.dui_years && applicant.dui_years.length > 0 && (
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("YEARS")}: </Text>
                            <Text style={styles.fieldValue}>{applicant.dui_years.join(', ')}</Text>
                        </Text>
                    </View>
                )}
            </View>

            {/* License Revocation Section */}
            <Text style={styles.sectionTitle}>{t("LICENSE_STATUS")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("license_revoked")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.license_revoked ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
            </View>
            {applicant?.license_revoked_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.license_revoked_details}</Text>
                </View>
            )}

            {/* Criminal History Section */}
            <Text style={styles.sectionTitle}>{t("CRIMINAL_HISTORY")}</Text>
            {applicant?.criminal_history ? (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.criminal_history}</Text>
                </View>
            ) : (
                <View style={styles.row}>
                    <Text style={styles.fieldValue}>{t("NONE_REPORTED")}</Text>
                </View>
            )}

            {/* Accidents Section */}
            <Text style={styles.sectionTitle}>{t("ACCIDENTS_LAST_5_YEARS")}</Text>
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("COUNT")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.accident_count || 0}</Text>
                    </Text>
                </View>
            </View>
            {applicant?.accident_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.accident_details}</Text>
                </View>
            )}

            {/* Violations Section */}
            <Text style={styles.sectionTitle}>{t("VIOLATIONS")}</Text>

            {/* PSP Violations */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("PSP_VIOLATIONS")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.psp_violations ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
            </View>
            {applicant?.psp_violations_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.psp_violations_details}</Text>
                </View>
            )}

            {/* Tickets */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("TICKETS_LAST_5_YEARS")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.tickets ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
                {applicant?.tickets_count && (
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("COUNT")}: </Text>
                            <Text style={styles.fieldValue}>{applicant.tickets_count}</Text>
                        </Text>
                    </View>
                )}
            </View>
            {applicant?.tickets_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.tickets_details}</Text>
                </View>
            )}

            {/* Infractions */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("INFRACTIONS_LAST_5_YEARS")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.infractions ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
                {applicant?.infractions_count && (
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("COUNT")}: </Text>
                            <Text style={styles.fieldValue}>{applicant.infractions_count}</Text>
                        </Text>
                    </View>
                )}
            </View>
            {applicant?.infractions_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.infractions_details}</Text>
                </View>
            )}

            {/* Moving Violations */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("MOVING_VIOLATIONS_LAST_3_YEARS")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.moving_violations ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
                {applicant?.moving_violations_count && (
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("COUNT")}: </Text>
                            <Text style={styles.fieldValue}>{applicant.moving_violations_count}</Text>
                        </Text>
                    </View>
                )}
            </View>
            {applicant?.moving_violations_details && (
                <View style={styles.detailsBox}>
                    <Text style={styles.detailsText}>{applicant.moving_violations_details}</Text>
                </View>
            )}
        </View>
    );
};

SafetyInfo.displayName = 'SafetyInfo';

export default SafetyInfo;
