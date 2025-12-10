import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from '../title';
import moment from 'moment';
import { ApplicantExtrasEntity } from '../../../models/applicant/applicant-extras.entity';
import { ApplicantExtras } from '../../../enums/applicants/applicant-extras.enum';

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

const BasicInformation = ({ applicant, t }) => {
    const age = applicant?.birthdate
        ? moment().diff(moment(applicant.birthdate), 'years')
        : null;

    return (
        <View style={styles.container}>
            <Title>{t("Basic Information")}</Title>

            {/* Name Row */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("First Name")}</Text>
                    <Text style={styles.value}>{applicant?.first_name || 'N/A'}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Last Name")}</Text>
                    <Text style={styles.value}>{applicant?.last_name || 'N/A'}</Text>
                </View>
            </View>

            {/* Contact Row */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Phone Number")}</Text>
                    <Text style={styles.value}>{applicant?.phone || 'N/A'}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Email")}</Text>
                    <Text style={styles.value}>{applicant?.email || 'N/A'}</Text>
                </View>
            </View>

            {/* Address Row */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Street Address")}</Text>
                    <Text style={styles.value}>{applicant?.address_1 || applicant?.street || 'N/A'}</Text>
                </View>
                {applicant?.address_2 && (
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Address Line 2")}</Text>
                        <Text style={styles.value}>{applicant.address_2}</Text>
                    </View>
                )}
            </View>

            {/* City, State, Zip Row */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("City")}</Text>
                    <Text style={styles.value}>{applicant?.city || 'N/A'}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("State")}</Text>
                    <Text style={styles.value}>{applicant?.state || 'N/A'}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Zip Code")}</Text>
                    <Text style={styles.value}>{applicant?.zip_code || 'N/A'}</Text>
                </View>
            </View>

            {/* Date of Birth Row */}
            {applicant?.birthdate && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Date of Birth")}</Text>
                        <Text style={styles.value}>
                            {moment(applicant.birthdate).format('MM/DD/YYYY')}
                            {age && ` (Age: ${age})`}
                        </Text>
                    </View>
                </View>
            )}

            {/* SSN Row */}
            {applicant?.ssn_last4 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Social Security Number")}</Text>
                        <Text style={styles.value}>***-**-{applicant.ssn_last4}</Text>
                    </View>
                </View>
            )}

            {/* Education Level */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Highest Degree")}</Text>
                    <Text style={styles.value}>
                        {applicant?.highest_degree
                            ? t(`EducationLevel.${applicant.highest_degree}`)
                            : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Owner Operator Status */}
            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Owner Operator")}</Text>
                    <Text style={styles.value}>
                        {applicant?.is_owner_operator ? t('YES') : t('NO')}
                    </Text>
                </View>
            </View>

            {/* Owner Operator Business Details - Only show if owner operator */}
            {applicant?.is_owner_operator && (
                <>
                    {(() => {
                        const businessName = applicant.extras?.find((e: ApplicantExtrasEntity) => e.type === ApplicantExtras.BUSINESS_NAME)?.value;
                        const dotNumber = applicant.extras?.find((e: ApplicantExtrasEntity) => e.type === ApplicantExtras.DOT_NUMBER)?.value;

                        if (businessName || dotNumber) {
                            return (
                                <View style={styles.row}>
                                    {businessName && (
                                        <View style={styles.field}>
                                            <Text style={styles.label}>{t("Business Name")}</Text>
                                            <Text style={styles.value}>{businessName}</Text>
                                        </View>
                                    )}
                                    {dotNumber && (
                                        <View style={styles.field}>
                                            <Text style={styles.label}>{t("DOT Number")}</Text>
                                            <Text style={styles.value}>{dotNumber}</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        }
                        return null;
                    })()}
                </>
            )}
        </View>
    );
};

BasicInformation.displayName = 'BasicInformation';

export default BasicInformation;
