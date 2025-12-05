import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './title';
import List, { Item } from './list';
import SafetyExperience from './safety-background';

const styles = StyleSheet.create({
    container: {
        width: 100,
        flex: 1,
        paddingTop: 30,
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
        fontFamily: 'Poppins',
    },
    detailContainer: {
        flexDirection: 'row',
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
        fontFamily: 'Poppins',
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
        fontFamily: 'Poppins Bold',
    },
});

const ExperienceEntry = ({ workHistory, t }) => {
    const formattedStartDate = workHistory?.start_at?.replace("T00:00:00.000Z", "") || '';
    const formattedEndDate = workHistory?.end_at?.replace("T00:00:00.000Z", "") || t("present")
    return (
        <View style={styles.entryContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.leftColumn}>
                    <Text style={styles.title}> {t("company")} | {workHistory?.name}</Text>
                </View>
            </View>
            <List>
                <Item>
                    {workHistory?.phone}
                </Item>
                <Item>
                    {formattedStartDate} - {formattedEndDate}
                </Item>
                <Item>
                    {workHistory?.city}
                </Item>
            </List>
        </View>
    );
};

const Experience = ({ applicant, t }) => (
    <View style={styles.container}>
        <Title>{t("safety_background")}</Title>
        <SafetyExperience t={t} applicant={applicant} />
    </View>
);

export default Experience;