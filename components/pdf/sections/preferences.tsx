import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from '../title';
import { VehicleTransmissionType } from '../../../enums/vehicles/vehicle-transmission-type.enum';
import { JobGeography } from '../../../enums/jobs/job-geography.enum';
import { formatEnumValues, formatEnumValue } from '../utils/format-enum';
import { ApplicantExtrasEntity } from '../../../models/applicant/applicant-extras.entity';
import { OtherRequirementType } from '../../../enums/users/other-requirements.enum';

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
    noData: {
        fontFamily: 'Poppins',
        fontSize: 9,
        fontStyle: 'italic',
        color: '#666666',
    },
});

const Preferences = ({ applicant, t }) => {
    // Get other requirements from extras
    const otherRequirements = applicant?.extras?.find(
        (e: ApplicantExtrasEntity) => e.type === 'OTHER_ABSOLUTELY_REQUIREMENTS'
    )?.value as OtherRequirementType[] | undefined;

    // Only show Automated Recruiting Lead if answer is yes
    const showAutomatedLead = applicant?.is_automated_recruiting_lead === true;

    const hasPreferences =
        (applicant?.preferred_location && applicant.preferred_location.length > 0) ||
        (applicant?.transmission_type && applicant.transmission_type.length > 0) ||
        (applicant?.routes && applicant.routes.length > 0) ||
        (applicant?.other_requirements && applicant.other_requirements.length > 0) ||
        (otherRequirements && otherRequirements.length > 0) ||
        showAutomatedLead ||
        applicant?.employment_type;

    if (!hasPreferences) {
        return null; // Don't show section if no preferences
    }

    return (
        <View style={styles.container}>
            <Title>{t("Preferences")}</Title>

            {/* Preferred Locations */}
            {applicant?.preferred_location && applicant.preferred_location.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("PREFERRED_LOCATION")}</Text>
                        <Text style={styles.value}>
                            {formatEnumValues(applicant.preferred_location)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Transmission Type Experience */}
            {applicant?.transmission_type && applicant.transmission_type.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("transmission_type")}</Text>
                        <Text style={styles.value}>
                            {formatEnumValues(applicant.transmission_type)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Route Types */}
            {applicant?.routes && applicant.routes.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("ROUTE_TYPE")}</Text>
                        <Text style={styles.value}>
                            {formatEnumValues(applicant.routes)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Employment Type */}
            {applicant?.employment_type && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("employment_type")}</Text>
                        <Text style={styles.value}>
                            {formatEnumValue(applicant.employment_type)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Other Requirements */}
            {applicant?.other_requirements && applicant.other_requirements.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Other Requirements")}</Text>
                        <Text style={styles.value}>
                            {formatEnumValues(applicant.other_requirements)}
                            {applicant.other_requirements.includes(OtherRequirementType.OTHERS) && applicant.other_requirements_other &&
                                ` - ${applicant.other_requirements_other}`
                            }
                        </Text>
                    </View>
                </View>
            )}

            {/* Other Absolutely Requirements (from extras) */}
            {otherRequirements && otherRequirements.length > 0 && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Other Non-Negotiables")}</Text>
                        <Text style={styles.value}>
                            {formatEnumValues(otherRequirements)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Automated Recruiting Lead - Only show if Yes */}
            {showAutomatedLead && (
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t("Automated Recruiting Lead")}</Text>
                        <Text style={styles.value}>{t('YES')}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

Preferences.displayName = 'Preferences';

export default Preferences;
