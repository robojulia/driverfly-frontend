import React from "react";
import {
    Text,
    View,
    StyleSheet
} from '@react-pdf/renderer';
import List, { Item } from './list';
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum";
import { ApplicantExperienceEntity } from "../../models/applicant/applicant-experience.entity";
import { ApplicantEquipmentEntity } from "../../models/applicant/applicant-equipment.entity";
import { VehicleTransmissionType } from "../../enums/vehicles/vehicle-transmission-type.enum";
import { JobGeography } from "../../enums/jobs/job-geography.enum";
import Title from "./title";

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Poppins Bold',
        fontSize: 11,
        marginBottom: 10,
    },
    skills: {
        fontFamily: 'Poppins',
        fontSize: 10,
        marginBottom: 10,
    },
});

const SkillEntry = ({ applicant, t }) => (
    <View>
        <Title>{t("EQUIPMENT_TYPE_AND_YEAR")}</Title>
        <List>
            {applicant?.equipment_experience?.map((v: ApplicantExperienceEntity, index) => (
                <Item key={index}>
                    {v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`)}
                    {v.start_year && v.end_year ? ` (${v.start_year} - ${v.end_year}, ${v?.years} ${t('YEARS')})` : ` (${v?.years} ${t('YEARS')})`}
                </Item>
            ))}
        </List>

        {
            applicant?.is_owner_operator &&
            <>
                <Title>{t("OWNER_OPERATOR")}</Title>
                <Text style={styles.title}>
                    {t("OWNER_OPERATOR")}? : {applicant?.is_owner_operator ? t('YES') : t("No")}
                </Text>
                <Text style={styles.title}>{t("EQUIPMENT_OWNED")}</Text>
                <List>
                    {applicant?.equipment_owned?.map((v: ApplicantEquipmentEntity, index) => (
                        <Item key={index}>{v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`)} ({`${t('QUANTITY')} ${v?.quantity}`})</Item>
                    ))}
                </List>
            </>
        }

        <Title>{t("ENDORSEMENTS")}</Title>
        <List>
            {applicant?.endorsements?.map((v: DriverEndorsement, e) => (
                <Item key={e}>{t(`DriverEndorsement.${v}`)}</Item>
            ))}
        </List>

        <Title>{t("TRANSMISSION_EXPERIENCE")}</Title>
        <List>
            {applicant?.transmission_type?.map((v: VehicleTransmissionType, index) => (
                <Item key={index}>{t(`VehicleTransmissionType.${v}`)}</Item>
            ))}
        </List>

        <Title>{t("PREFERRED_LOCATION")}</Title>
        <List>
            {applicant?.preferred_location?.map((v: JobGeography, index) => (
                <Item key={index}>{t(`JobGeography.${v}`)}</Item>
            ))}
        </List>

    </View >
)

const Skills = ({ applicant, t }) => (
    <View>
        <SkillEntry t={t} applicant={applicant} />
    </View>
);

export default Skills;