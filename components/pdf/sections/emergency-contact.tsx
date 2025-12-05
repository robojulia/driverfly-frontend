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
});

const EmergencyContact = ({ applicant, t }) => {
    const hasEmergencyContact =
        applicant?.emergency_contact_name ||
        applicant?.emergency_contact_number ||
        applicant?.emergency_contact_relationship;

    if (!hasEmergencyContact) {
        return null; // Don't show section if no emergency contact info
    }

    return (
        <View style={styles.container}>
            <Title>{t("Emergency Contact")}</Title>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Emergency Contact Name")}</Text>
                    <Text style={styles.value}>{applicant?.emergency_contact_name || 'N/A'}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Emergency Contact Phone")}</Text>
                    <Text style={styles.value}>{applicant?.emergency_contact_number || 'N/A'}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.field}>
                    <Text style={styles.label}>{t("Relationship")}</Text>
                    <Text style={styles.value}>{applicant?.emergency_contact_relationship || 'N/A'}</Text>
                </View>
            </View>
        </View>
    );
};

EmergencyContact.displayName = 'EmergencyContact';

export default EmergencyContact;
