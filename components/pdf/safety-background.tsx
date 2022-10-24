/* eslint-disable react/no-array-index-key */

import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import List, { Item } from './list';

const styles = StyleSheet.create({
    container: {
        width: 100,
        flex: 1,
        paddingTop: 30,
        paddingLeft: 15,
        '@media max-width: 400': {
            paddingTop: 10,
            paddingLeft: 0,
        },
    },
    entryContainer: {
        marginBottom: 10,
    },
    date: {
        fontSize: 11,
        fontFamily: 'Lato Italic',
    },
    detailLeftColumn: {
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10,
    },
    detailRightColumn: {
        flexDirection: 'column',
        flexGrow: 9,
    },
    bulletPoint: {
        fontSize: 10,
    },
    details: {
        fontSize: 10,
        fontFamily: 'Lato',
    },
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    leftColumn: {
        flexDirection: 'column',
        flexGrow: 9,
    },
    rightColumn: {
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'flex-end',
        justifySelf: 'flex-end',
    },
    title: {
        fontSize: 11,
        color: 'black',
        textDecoration: 'none',
        fontFamily: 'Lato Bold',
    },
});


const SafetyExperience = ({ t, applicant }) => {

    return (
        <View style={styles.entryContainer}>
            <List>
                <Item >
                    {t("has_past_duis")} &nbsp;{applicant?.has_past_dui && t("yes")}
                </Item>
                <Item >
                    {t("can_pass_drug_test")} &nbsp;{applicant?.can_pass_drug_test && t("yes")}
                </Item>
                <Item >
                    {t("positive_drug_test")}: &nbsp;{applicant?.positive_drug_test_details && t("yes")}
                </Item>
                <Item >
                    {t("license_revoked")}:  &nbsp;{applicant?.license_revoked && t("yes")}
                </Item>
                <Item >
                    {t("license_revoked_details")}:  &nbsp;{applicant?.license_revoked_details}
                </Item>
            </List>
        </View>
    );
};


export default SafetyExperience;