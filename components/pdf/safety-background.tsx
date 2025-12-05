/* eslint-disable react/no-array-index-key */

import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import List, { Item } from "./list";

const styles = StyleSheet.create({
  container: {
    width: 100,
    flex: 1,
    paddingTop: 30,
    paddingLeft: 15,
    "@media max-width: 400": {
      paddingTop: 10,
      paddingLeft: 0,
    },
  },
  entryContainer: {
    marginBottom: 10,
  },
  date: {
    fontSize: 11,
    fontFamily: "Poppins",
  },
  detailLeftColumn: {
    flexDirection: "column",
    marginLeft: 10,
    marginRight: 10,
  },
  detailRightColumn: {
    flexDirection: "column",
    flexGrow: 9,
  },
  bulletPoint: {
    fontSize: 10,
  },
  details: {
    fontSize: 10,
    fontFamily: "Poppins",
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  leftColumn: {
    flexDirection: "column",
    flexGrow: 9,
  },
  rightColumn: {
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "flex-end",
    justifySelf: "flex-end",
  },
  title: {
    fontSize: 11,
    color: "black",
    textDecoration: "none",
    fontFamily: "Poppins Bold",
  },
});

const SafetyExperience = ({ t, applicant }) => {
  return (
    <View style={styles.entryContainer}>
      <List>
        <Item>
          {t("has_past_duis")} &nbsp;{applicant?.has_past_dui ? t("yes") : null}
        </Item>
        <Item>
          {t("can_pass_drug_test")} &nbsp;
          {applicant?.can_pass_drug_test && t("yes")}
        </Item>
        <Item>
          {t("positive_drug_test")}: &nbsp;
          {applicant?.positive_drug_test_details && t("yes")}
        </Item>
        <Item>
          {t("license_revoked")}: &nbsp;{applicant?.license_revoked && t("yes")}
        </Item>
        <Item>
          {t("license_revoked_details")}: &nbsp;
          {applicant?.license_revoked_details}
        </Item>
        <Item>
          {t("criminal_history_last_3_years")} :
          {applicant?.criminal_history}
        </Item>
        <Item>
          {t("accidents_last_5_years")} :
          {applicant?.accident_count}
        </Item>
        <Item>
          {t("accident_details")} :
          {applicant?.accident_details}
        </Item>
        <Item>
          {t("has_had_license_revoked")} :
          {applicant?.license_revoked}
        </Item>
        <Item>
          {t("details")} :
          {applicant?.license_revoked_details}
        </Item>
        <Item>
          {t("has_had_psp_violations")} :
          {applicant?.psp_violations}
        </Item>
        <Item>
          {t("details")} :
          {applicant?.psp_violations_details}
        </Item>
        <Item>
          {t("has_had_tickets_last_5_years")} :
          {applicant?.tickets}
        </Item>
        <Item>
          {t("COUNT")} :
          {applicant?.tickets_count}
        </Item>
        <Item>
          {t("details")} :
          {applicant?.tickets_details}
        </Item>
        <Item>
          {t("HAS_HAD_INFRACTIONS_LAST_5_YEARS")} :
          {applicant?.infractions}
        </Item>
        <Item>
          {t("COUNT")} :
          {applicant?.infractions_count}
        </Item>
        <Item>
          {t("details")} :
          {applicant?.infractions_details}
        </Item>
        <Item>
          {t("HAS_HAD_MOVING_VIOLATIONS_LAST_3_YEARS")} :
          {applicant?.moving_violations}
        </Item>
        <Item>
          {t("COUNT")} :
          {applicant?.moving_violations_count}
        </Item>
        <Item>
          {t("details")} :
          {applicant?.moving_violations_details}
        </Item>
        <Item>
          {t("has_had_positive_drug_test")} :
          {applicant?.positive_drug_test}
        </Item>
        <Item>
          {t("details")} :
          {applicant?.positive_drug_test_details}
        </Item>
      </List>
    </View>
  );
};

export default SafetyExperience;
