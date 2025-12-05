import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 4,
        borderBottomColor: '#006078',
        borderBottomStyle: 'solid',
        alignItems: 'stretch',
        marginBottom: "5px",
        paddingBottom: "8px"
    },
    detailColumn: {
        flexDirection: 'column',
        flexGrow: 9,
        textTransform: 'uppercase',
    },
    linkColumn: {
        flexDirection: 'column',
        flexGrow: 2,
        alignSelf: 'flex-end',
        justifySelf: 'flex-end',
    },
    name: {
        fontSize: 24,
        fontFamily: 'Poppins Bold',
        color: '#006078',

    },
    subtitle: {
        fontSize: 10,
        justifySelf: 'flex-end',
        fontFamily: 'Poppins',
    },
    link: {
        fontFamily: 'Poppins',
        fontSize: 10,
        color: 'black',
        textDecoration: 'none',
        alignSelf: 'flex-end',
        justifySelf: 'flex-end',
    },
});

const Header = ({ applicant }) => (

    <View style={styles.container}>
        <View style={styles.detailColumn}>
            <Text style={styles.name}>{applicant?.first_name}</Text>
            <Text style={styles.subtitle}>{applicant?.last_name}</Text>
        </View>
        <View style={styles.linkColumn}>
            <Text style={styles.link}>{applicant?.email}</Text>
        </View>
    </View>
);

Header.displayName = 'Header';

export default Header;