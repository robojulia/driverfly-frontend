import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './title';
import { PlusCircle } from 'react-bootstrap-icons'

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

export default ({ applicant, t }) => (
  <View style={styles.container}>
    <Title>{t("basic_details")}</Title>
    <Text style={styles.degree}><PlusCircle />{applicant?.phone}</Text>
    <Text style={styles.degree}>{applicant?.city}</Text>
    <Text style={styles.degree}>{applicant?.highest_degree}</Text>
    <Text style={styles.degree}>{applicant?.state}</Text>
    <Text style={styles.degree}>{applicant?.authorized_to_work_in_us && t("authorized_to_work_in_us")}</Text>
  </View>
);