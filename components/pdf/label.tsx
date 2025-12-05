import React from 'react';
import { Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    label: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 10,
        marginBottom: 10,
        fontWeight:700,
        color: '#000000',
        textTransform: 'uppercase',
        borderBottomColor: '#006078',
    },
});

const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;

export default Label;