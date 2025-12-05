import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './title';
import Label from './label';
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

const PersonalInformation = ({ applicant, t }) => {
    const age = applicant?.birthdate
        ? moment().diff(moment(applicant.birthdate), 'years')
        : null;

    return (
        <View style={styles.container}>
            <Title>{t("PERSONAL_INFORMATION")}</Title>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("FULL_NAME")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.first_name} {applicant?.last_name}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("PHONE")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.phone}</Text>
                    </Text>
                </View>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("EMAIL")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.email}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("STREET")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.street || applicant?.address_1}</Text>
                    </Text>
                </View>
            </View>

            {applicant?.address_2 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("ADDRESS_2")}: </Text>
                            <Text style={styles.fieldValue}>{applicant?.address_2}</Text>
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("CITY")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.city}</Text>
                    </Text>
                </View>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("STATE")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.state}</Text>
                    </Text>
                </View>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("ZIP_CODE")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.zip_code}</Text>
                    </Text>
                </View>
            </View>

            {applicant?.birthdate && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("DATE_OF_BIRTH")}: </Text>
                            <Text style={styles.fieldValue}>
                                {moment(applicant.birthdate).format('MM/DD/YYYY')}
                                {age && ` (${age} ${t('YEARS_OLD')})`}
                            </Text>
                        </Text>
                    </View>
                </View>
            )}

            {applicant?.ssn_last4 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text>
                            <Text style={styles.fieldLabel}>{t("SSN_LAST_4")}: </Text>
                            <Text style={styles.fieldValue}>***-**-{applicant.ssn_last4}</Text>
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("HIGHEST_DEGREE")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.highest_degree ? t(`EducationLevel.${applicant.highest_degree}`) : 'N/A'}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("AUTHORIZED_TO_WORK_IN_THE_US")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.authorized_to_work_in_us ? t('YES') : t('NO')}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("EMERGENCY_CONTACT")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.emergency_contact_name}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("EMERGENCY_CONTACT_PHONE")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.emergency_contact_number}</Text>
                    </Text>
                </View>
                <View style={styles.field}>
                    <Text>
                        <Text style={styles.fieldLabel}>{t("RELATIONSHIP")}: </Text>
                        <Text style={styles.fieldValue}>{applicant?.emergency_contact_relationship}</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

PersonalInformation.displayName = 'PersonalInformation';

export default PersonalInformation;
