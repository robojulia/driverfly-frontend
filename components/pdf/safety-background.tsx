/* eslint-disable react/no-array-index-key */

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import Title from './title';
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
    borderLeft: '1px solid #2DA2AF',
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


const SafetyExperience = ({ applicant }) => {

  return (
    <View style={styles.entryContainer}>
      <List>
        <Item style={styles.detailContainer}>
          past dui: &nbsp;{applicant.has_past_dui && 'yes'}
        </Item>
        <Item style={styles.detailContainer}>
          pass drug test: &nbsp;{applicant.can_pass_drug_test && 'yes'}
        </Item>
        <Item style={styles.detailContainer}>
          positive drug test: &nbsp;{applicant.positive_drug_test_details && 'yes'}
        </Item>
        <Item style={styles.detailContainer}>
          license revoked:  &nbsp;{applicant.license_revoked && 'yes'}
        </Item>
        <Item style={styles.detailContainer}>
          {applicant.license_revoked_details}
        </Item>
      </List>
    </View>
  );
};


export default SafetyExperience;