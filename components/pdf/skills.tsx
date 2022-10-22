import React from "react";
import {
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';
import List, { Item } from './list';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Lato Bold',
    fontSize: 11,
    marginBottom: 10,
  },
  skills: {
    fontFamily: 'Lato',
    fontSize: 10,
    marginBottom: 10,
  },
});
const SkillEntry = ({ applicant }) => (
  <View>
    <Text style={styles.title}>Equipment Type | Years Of Experience</Text>
    <List>
      {applicant.equipment_experience.map((equipment, i) => (
        <>
          <Item key={i}>{equipment.type_other ? equipment.type_other : equipment.type}   {equipment.years}</Item>
        </>
      ))}
    </List>
    <Text style={styles.title}>Equipment Owned</Text>
    <List>
      {applicant.equipment_experience.map((equipment, i) => (
        <>
          <Item key={i}>{equipment.type_other ? equipment.type_other : equipment.type}  {equipment.quantity}</Item>
        </>
      ))}
    </List>
    <Text style={styles.title}>Endorsements/TWIC</Text>

    <List>
      {applicant.endorsements.map((endorsement, i) => (
        <>
          <Item key={i}>{endorsement}</Item>
        </>
      ))}
    </List>
    <Text style={styles.title}>Transmission Experience</Text>
    <Text style={styles.skills}>1{applicant.transmission_type[0]}</Text>
    <Text style={styles.skills}>2{applicant.transmission_type[1]}</Text>
  </View>
)

const Skills = ({ applicant }) => (
  <View>
    <SkillEntry applicant={applicant} />
  </View>
);

export default Skills;