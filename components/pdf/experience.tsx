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

const ExperienceEntry = ({ workHistory }) => {
  return (
    <View style={styles.entryContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>Company | {workHistory.name}</Text>
        </View>
      </View>
      <List>
        <Item style={styles.detailContainer}>
          {workHistory.phone}
        </Item>
        <Item style={styles.detailContainer}>
          {workHistory.start_at}
        </Item>
        <Item style={styles.detailContainer}>
          {workHistory.end_at || "present"}
        </Item>
        <Item style={styles.detailContainer}>
          {workHistory.city}
        </Item>
      </List>
    </View>
  );
};

const Experience = ({ applicant }) => (
  <View style={styles.container}>
    <Title>Experience</Title>
    {applicant.employers.map((workHistory, i) => (
      <ExperienceEntry workHistory={workHistory} />
    ))}
    <SafetyExperience style={styles} applicant={applicant} />
  </View>
);

export default Experience;