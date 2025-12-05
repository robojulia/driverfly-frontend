import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        marginBottom: 5,
        listStyle: 'none'
    },
    bulletPoint: {
        width: 10,
        fontSize: 10,
        color: '#006078',
    },
    itemContent: {
        flex: 1,
        justifyContent: 'space-between',
        fontSize: 10,
        fontFamily: 'Poppins',
    },
});

const List = ({ children }) => children;

export const Item = ({ children }) => (
    <View style={styles.item}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text key={children} style={styles.itemContent}>{children}</Text>
    </View>
);

export default List;