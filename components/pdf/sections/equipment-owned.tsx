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
    tableColQuantity: {
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

const EquipmentOwned = ({ applicant, t }) => {
    // Only show this section if they are an owner-operator
    if (!applicant?.is_owner_operator) {
        return null;
    }

    const equipment = applicant?.equipment_owned || [];

    return (
        <View style={styles.container}>
            <Title>{t("Equipment Owned")}</Title>

            {equipment.length === 0 ? (
                <Text style={styles.noData}>{t("NO_EQUIPMENT_OWNED")}</Text>
            ) : (
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={styles.tableColType}>
                            <Text style={styles.headerText}>{t("Equipment Type")}</Text>
                        </View>
                        <View style={styles.tableColQuantity}>
                            <Text style={styles.headerText}>{t("Quantity")}</Text>
                        </View>
                    </View>
                    {equipment.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.tableColType}>
                                <Text style={styles.cellText}>
                                    {item.type === JobEquipmentType.OTHER
                                        ? item.type_other
                                        : formatEnumValue(item.type)}
                                </Text>
                            </View>
                            <View style={styles.tableColQuantity}>
                                <Text style={styles.cellText}>{item.quantity || 0}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

EquipmentOwned.displayName = 'EquipmentOwned';

export default EquipmentOwned;
