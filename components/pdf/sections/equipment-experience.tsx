import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from '../title';
import { JobEquipmentType } from '../../../enums/jobs/job-equipment-type.enum';
import { formatEnumValue } from '../utils/format-enum';

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    table: {
        marginTop: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        padding: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#006078',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    tableColType: {
        flex: 3,
    },
    tableColStartYear: {
        flex: 1,
    },
    tableColEndYear: {
        flex: 1,
    },
    tableColYears: {
        flex: 1,
    },
    headerText: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 9,
        color: '#006078',
    },
    cellText: {
        fontFamily: 'Poppins',
        fontSize: 9,
        color: '#000000',
    },
    noData: {
        fontFamily: 'Poppins',
        fontSize: 9,
        fontStyle: 'italic',
        color: '#666666',
        marginTop: 8,
    },
});

const EquipmentExperience = ({ applicant, t }) => {
    const equipment = applicant?.equipment_experience || [];

    return (
        <View style={styles.container}>
            <Title>{t("Equipment Experience")}</Title>

            {equipment.length === 0 ? (
                <Text style={styles.noData}>{t("NO_EQUIPMENT_EXPERIENCE_PROVIDED")}</Text>
            ) : (
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={styles.tableColType}>
                            <Text style={styles.headerText}>{t("Equipment Type")}</Text>
                        </View>
                        <View style={styles.tableColStartYear}>
                            <Text style={styles.headerText}>{t("START_YEAR")}</Text>
                        </View>
                        <View style={styles.tableColEndYear}>
                            <Text style={styles.headerText}>{t("END_YEAR")}</Text>
                        </View>
                        <View style={styles.tableColYears}>
                            <Text style={styles.headerText}>{t("YEARS")}</Text>
                        </View>
                    </View>
                    {equipment.map((exp, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.tableColType}>
                                <Text style={styles.cellText}>
                                    {exp.type === JobEquipmentType.OTHER
                                        ? exp.type_other
                                        : formatEnumValue(exp.type)}
                                </Text>
                            </View>
                            <View style={styles.tableColStartYear}>
                                <Text style={styles.cellText}>
                                    {exp.start_year || '-'}
                                </Text>
                            </View>
                            <View style={styles.tableColEndYear}>
                                <Text style={styles.cellText}>
                                    {exp.end_year || '-'}
                                </Text>
                            </View>
                            <View style={styles.tableColYears}>
                                <Text style={styles.cellText}>
                                    {exp.years || 0}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

EquipmentExperience.displayName = 'EquipmentExperience';

export default EquipmentExperience;
