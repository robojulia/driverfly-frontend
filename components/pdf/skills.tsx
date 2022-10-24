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

const SkillEntry = ({ applicant, t }) => (
    <View>
        <Text style={styles.title}>{t("EQUIPMENT_TYPE_AND_YEAR")}</Text>
        <List>
            {applicant?.equipment_experience.map((equipment) => (
                <>
                    <Item key={equipment.id}> {equipment.type_other ? equipment.type_other : equipment.type} {equipment?.years}</Item>
                </>
            ))}
        </List>
        <Text style={styles.title}>{t("EQUIPMENT_OWNED")}</Text>
        <List>
            {applicant?.equipment_owned.map((equipment) => (
                <>
                    <Item key={equipment.id}>{equipment.type_other ? equipment.type_other : equipment.type} {equipment?.quantity}</Item>
                </>
            ))}
        </List>
        <Text style={styles.title}>{t("ENDORSEMENTS")}</Text>

        <List>
            {applicant?.endorsements.map((endorsement, e) => (
                <>
                    <Item key={e}>{endorsement}</Item>
                </>
            ))}
        </List>
        <Text style={styles.title}>{t("TRANSMISSION_EXPERIENCE")}</Text>
        <Item>{applicant?.transmission_type[0]}</Item>
        <Item>{applicant?.transmission_type[1]}</Item>
    </View>
)

const Skills = ({ applicant, t }) => (
    <View>
        <SkillEntry t={t} applicant={applicant} />
    </View>
);

export default Skills;