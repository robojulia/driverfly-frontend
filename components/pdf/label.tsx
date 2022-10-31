import React from 'react';
import { Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    label: {
        fontFamily: 'Lato Bold',
        fontSize: 10,
        marginBottom: 10,
        fontWeight:700,
        color: '#000000',
        textTransform: 'uppercase',
        borderBottomColor: '#2DA2AF',
    },
});

const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;

export default Label;