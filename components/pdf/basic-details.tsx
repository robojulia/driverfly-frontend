import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './title';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderRight: '1px solid #2DA2AF',
  },
  school: {
    fontFamily: 'Lato Bold',
    fontSize: 10,
  },
  degree: {
    fontFamily: 'Lato',
    fontSize: 10,
    marginBottom: '5px'
  },
  candidate: {
    fontFamily: 'Lato Italic',
    fontSize: 10,
  },
});

export default ({ applicant }) => (
  <View style={styles.container}>
    <Title>Basic Details</Title>
    <Text style={styles.degree}>{applicant?.phone}</Text>
    <Text style={styles.degree}>{applicant?.city}</Text>
    <Text style={styles.degree}>{applicant?.highest_degree}</Text>
    <Text style={styles.degree}>{applicant?.state}</Text>
    <Text style={styles.degree}>{applicant?.authorized_to_work_in_us && 'authorized to work in us'}</Text>
  </View>
);