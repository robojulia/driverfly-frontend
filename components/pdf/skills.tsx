import React from "react";
import {
    Text,
    View,
    StyleSheet
} from '@react-pdf/renderer';
import List, { Item } from './list';
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";

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
            {applicant?.equipment_experience?.map((v) => (
                <Item key={v.id}> {v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`)} ({`${v?.years} ${t('YEARS')}`})</Item>
            ))}
        </List>

        {
            applicant.is_owner_operator &&
            <>
                <Text style={styles.title}>{t("EQUIPMENT_OWNED")}</Text>
                <List>
                    {applicant?.equipment_owned?.map((v) => (
                        <Item key={v.id}>{v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`)} ({`${t('QUANTITY')} ${v?.quantity}`})</Item>
                    ))}
                </List>
            </>
        }

        <Text style={styles.title}>{t("ENDORSEMENTS")}</Text>
        <List>
            {applicant?.endorsements?.map((v, e) => (
                <Item key={e}>{t(`DriverEndorsement.${v}`)}</Item>
            ))}
        </List>

        <Text style={styles.title}>{t("TRANSMISSION_EXPERIENCE")}</Text>
        <List>
            {applicant?.transmission_type?.map((v, e) => (
                <Item key={e}>{t(`VehicleTransmissionType.${v}`)}</Item>
            ))}
        </List>

    </View>
)

const Skills = ({ applicant, t }) => (
    <View>
        <SkillEntry t={t} applicant={applicant} />
    </View>
);

export default Skills;