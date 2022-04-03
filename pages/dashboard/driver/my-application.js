import { useFormik } from "formik"
import * as yup from "yup"
import BaseInput from "../../../components/BaseInput"
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import useRedirect from '../../../hooks/useRedirect';
import useAuth from "../../../hooks/useAuth"
import style from '../../../public/dashboard/styles/css/Driver/my-account.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from "react"
import moment from "moment"
import CreatableSelect from 'react-select/creatable'

import stateList from "../../../utils/stateList"
import { Accordion } from "react-bootstrap"

import { preventNegative } from "../../../utils/input"

import { useTranslation } from "react-i18next"

import { driverDegree, cdlClass } from "../../../utils/driver"

import { EquipmentType } from "../../../enums/drivers/equipment-type";

import BaseApi from "../../api/_baseApi";

export default function MyApplication() {
  const { authDriver } = useRedirect();
  authDriver();

  const { t } = useTranslation();
  const { authCheck, setAuth } = useAuth();
  const user = authCheck();

  const api = new BaseApi();

  const equipmentTypes = Object
    .keys(EquipmentType)
    .map(v => {
      return {
        value: v,
        label: EquipmentType[v]
      };
    })


  yup.addMethod(yup.array, "unique", function (message, field, mapper = a => a) {
    return this.test(`unique`, message, function (list) {
      const set = new Set();
      //debugger;
      for (let i = 0; i < list.length; i++) {
        let value = mapper(list[i]);

        if (set.has(value)) {
          // debugger;
          this.createError({
            path: `${this.path}[${i}].${field}`,
            message: message
          });
          return false;
        }
        set.add(value);
      }
      return true;
    });
  });

  const acc_form = useFormik({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      contact_number: user.contact_number,
      cell_number: user.cell_number,
      email: user.email,
      street: '',
      city: '',
      state: '',
      zip_code: '',

      license_number: '',
      license_expiry: '',
      license_state: "",
      license_type: "",
      years_cdl_experience: null,
      equipment_experience: [],
      is_owner_operator: false,
      equipment_owned: [],

      // todo: transmission_type: [],
      // todo: endorsements: [],
      above_21: false,
      highest_degree: '',
      emergency_contact_name: "",
      emergency_contact_number: '',
      emergency_contact_relationship: '',

      // todo: can_work_in_us: true,
    },
    validationSchema: yup.object({
      first_name: yup.string().required(t("this_field_is_required")).nullable(),
      last_name: yup.string().required(t("this_field_is_required")).nullable(),
      contact_number: yup.string().nullable(),
      cell_number: yup.string().nullable(),
      email: yup.string().required(t("this_field_is_required")).nullable(),
      street: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),

      license_number: yup.string().nullable(),
      license_expiry: yup.string().nullable(),
      license_state: yup.string().nullable(),
      license_type: yup.string().nullable(),
      years_cdl_experience: yup.number().nullable().min(0, t("please_select_0_or_above")),
      equipment_experience: yup.array(
        yup.object().shape({
          type: yup.string().required(t("this_field_is_required")).nullable(),
          type_other: yup.string().nullable(),
          quantity: yup.number().min(1).required(t("this_field_is_required")).nullable(),
        })
      ).unique(t("types_must_not_repeat"), "type", t => `${t.type}_${t.type_other}`),

      equipment_experience: yup.array(
        yup.object().shape({
          type: yup.string().required(t("this_field_is_required")).nullable(),
          years: yup.string().required(t("this_field_is_required")).nullable(),
        })
      ).unique(t("types_must_not_repeat"), "type", t => t.type),

      highest_degree: yup.string().nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      const userDto = {
        first_name: values.first_name,
        last_name: values.last_name,
        name: `${values.first_name} ${values.last_name}`,
        contact_number: values.contact_number,
        cell_number: values.cell_number,
        // email: user.email,
      };
      const driverDto = {
        street: values.street,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
  
        license_number: values.license_number,
        license_expiry: values.license_expiry,
        license_state: values.license_state,
        license_type: values.license_type,
        years_cdl_experience: values.years_cdl_experience,
        equipment_experience: values.equipment_experience,
        is_owner_operator: values.is_owner_operator,
        equipment_owned: values.is_owner_operator ? values.equipment_owned.map(v => {
          if (!v.type.endsWith("_OTHER")) {
            v.type_other = null;
          }
          return v;
        }) : [],
  
        // todo: transmission_type: values.transmission_type,
        // todo: endorsements: values.endorsements,
        highest_degree: values.highest_degree,
        emergency_contact_name: values.emergency_contact_name,
        emergency_contact_number: values.emergency_contact_number,
        emergency_contact_relationship: values.emergency_contact_relationship,
  
        // todo: can_work_in_us: values.can_work_in_us,
  
      };
      try {
        const [ userResp, driverResp ] = await Promise.all([
          api.put(`user/${user.id}`, userDto),
          api.post("drivers", driverDto)
        ]);
        toast.success(t("successfully_saved_information"));

        setAuth({
          ...user,
          first_name: userDto.first_name,
          last_name: userDto.last_name,
          name: userDto.name,
          contact_number: userDto.contact_number,
          cell_number: userDto.cell_number,
        });
      } catch (error) {
        console.error("Unable to save information", error);
        toast.error(t("unable_to_save_information"));
      }
    }
  });

  const sec_form = useFormik({
    initialValues: {
      employers: [],
      can_pass_drug_test: true,
      has_past_dui: false,
      dui_years: [],
      criminal_history: null,
      accident_count: null,
      accident_details: null,
      safety_questions: {
        "LICENSE_REVOKED": {
          type: "LICENSE_REVOKED",
          response: false,
          details: null,
        },
        "VIOLATIONS_PSP": {
          type: "VIOLATIONS_PSP",
          response: false,
          details: null,
        },
        "TICKETS": {
          type: "TICKETS",
          response: false,
          details: null,
        },
        "POSITIVE_DRUG_TEST": {
          type: "POSITIVE_DRUG_TEST",
          response: false,
          details: null,
        }
      }
    },
    validationSchema: yup.object({
      employers: yup.array(
        yup.object().shape({
          name: yup.string().required(t("this_field_is_required")).nullable(),
          start_at: yup.date().nullable(),
          end_at: yup.date().nullable(),
          title: yup.string().nullable(),
          address: yup.string().nullable(),
          street: yup.string().nullable(),
          city: yup.string().nullable(),
          state: yup.string().nullable(),
          zip_code: yup.string().nullable(),
          phone: yup.string().nullable(),
          can_contact: yup.boolean().default(false),
          is_subject_to_fmcsrs: yup.boolean().default(false),
          is_subject_to_drug_tests: yup.boolean().nullable(false),
        })
      ),
      can_pass_drug_test: yup.boolean(),
      has_past_dui: yup.boolean(),
      dui_years: yup.array(
        yup.number()
      ).unique("Years cannot repeat"),
      criminal_history: yup.string().nullable(),
      accident_count: yup.number().min(0).nullable(),
      accident_details: yup.string().nullable(),
      safety_questions: yup.object().shape({
        LICENSE_REVOKED: yup.object().shape({
          response: yup.boolean(),
          details: yup.string().nullable()
        }),
        VIOLATIONS_PSP: yup.object().shape({
          response: yup.boolean(),
          details: yup.string().nullable()
        }),
        TICKETS: yup.object().shape({
          response: yup.boolean(),
          details: yup.string().nullable()
        }),
        POSITIVE_DRUG_TEST: yup.object().shape({
          response: yup.boolean(),
          details: yup.string().nullable()
        }),
      })
    }),
    onSubmit: async (values) => {
      // console.log(values);
      // return;
      const driverDto = {
        employers: values.employers,
        can_pass_drug_test: values.can_pass_drug_test,
        has_past_dui: values.has_past_dui,
        dui_years: values.has_past_dui && values.dui_years.length > 0 ? values.dui_years : null,
        criminal_history: values.criminal_history,
        accident_count: values.accident_count,
        accident_details: values.accident_count > 0 ? values.accident_details : null,
        safety_questions: Object.values(values.safety_questions).map(v => {
          if (!v.response) v.details = null;
          return v;
        })
      };
      try {
        const driverResp = await api.post("drivers", driverDto);
        toast.success(t("successfully_saved_information"));
      } catch (error) {
        console.error("Unable to save information", error);
        toast.error(t("unable_to_save_information"));
      }

    }
  });

  useEffect(async () => {
    const { data: driver } = await api.get(`drivers`);
    if (!driver) {
      return;
    }

    acc_form.setValues({
      ...acc_form.values,

      street: driver.street,
      city: driver.city,
      state: driver.state,
      zip_code: driver.zip_code,

      license_number: driver.license_number,
      license_expiry: driver.license_expiry ? moment(driver.license_expiry).format("YYYY-MM-DD") : driver.license_expiry,
      license_state: driver.license_state,
      license_type: driver.license_type,
      years_cdl_experience: driver.years_cdl_experience,
      is_owner_operator: driver.is_owner_operator || false,
      equipment_owned: driver.equipment_owned || [],
      equipment_experience: driver.equipment_experience,

      above_21: driver.birthdate ? moment(new Date()).diff(driver.birthdate, "years") >= 21 : false,
      highest_degree: driver.highest_degree,
      emergency_contact_name: driver.emergency_contact_name,
      emergency_contact_number: driver.emergency_contact_number,
      emergency_contact_relationship: driver.emergency_contact_relationship,
    });

    const safety_questions = {};
    driver.safety_questions.forEach(v => {
      safety_questions[v.type] = v;
    })

    sec_form.setValues({
      ...sec_form.values,

        employers: (driver.employers ? driver.employers.map(v => ({
          ...v,
          start_at: v.start_at ? moment(v.start_at).format("YYYY-MM-DD") : null,
          end_at: v.end_at ? moment(v.end_at).format("YYYY-MM-DD") : null,

        })): []),
        can_pass_drug_test: driver.can_pass_drug_test,
        has_past_dui: driver.has_past_dui || false,
        dui_years: driver.dui_years || [],
        criminal_history: driver.criminal_history,
        accident_count: driver.accident_count,
        accident_details: driver.accident_count > 0 ? driver.accident_details : null,
        safety_questions: {
          ...sec_form.values.safety_questions,
          ...safety_questions
        }
    });

  }, [])

  const [dui_year_current_value, set_dui_year_current_value] = useState("");

  const handleDUIYears = (e) => {
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        sec_form.setValues({
          ...sec_form.values,
          dui_years: [
            ...sec_form.values.dui_years,
            dui_year_current_value
          ]
        });
        set_dui_year_current_value("");
        e.preventDefault();
        return;
        case "Backspace":
        case "ArrowLeft":
        case "ArrowRight":
          return;
    }

    if (e.key < "0" || e.key > "9" || dui_year_current_value.length == 4) {
      e.preventDefault();
      return;
    }
  }

  const addEquipmentOwned = () => {
    acc_form.setValues({
      ...acc_form.values,
      equipment_owned: [
        ...acc_form.values.equipment_owned,
        {
          type: null, type_other: null, quantity: null
        }
      ],
    });
  };

  const removeEquipmentOwned = (id) => {
    acc_form.setValues({
      ...acc_form.values,
      equipment_owned: [
        ...acc_form.values.equipment_owned.filter((v, i) => i != id),
      ],
    });
  };

  const addEquipmentExperience = () => {
    acc_form.setValues({
      ...acc_form.values,
      equipment_experience: [
        ...acc_form.values.equipment_experience,
        {
          type: null, years: null
        }
      ],
    });
  };

  const removeEquipmentExperience = (id) => {
    acc_form.setValues({
      ...acc_form.values,
      equipment_experience: [
        ...acc_form.values.equipment_experience.filter((v, i) => i != id),
      ],
    });
  };

  const addPastEmployer = () => {
    sec_form.setValues({
      ...sec_form.values,
      employers: [
        ...sec_form.values.employers,
        {
          name: null,
          start_at: null,
          end_at: null,
          title: null,
          street: null,
          city: null,
          state: null,
          zip_code: null,
          phone: null,
          can_contact: false,
          is_subject_to_fmcsrs: false,
          is_subject_to_drug_tests: false,
        }
      ]
    })
  }

  const removePastEmployer = (id) => {
    sec_form.setValues({
      ...sec_form.values,
      employers: sec_form.values.employers.filter((v, i) => i != id)
    });
  }



  return (
    <>
      <ToastContainer />
      <div className={style.application_container}>

        <div>
          <div className='container-fluid p-0'>
            <form className="modal-body" onSubmit={acc_form.handleSubmit}>
              <h2>{t("my_application")}</h2>
              <div className="row">
                {/* <h3>{t("basic_details")}</h3> */}
                {/* Drivers Name */}
                <div className="col-md-4">
                  <BaseInput
                    className="col-12"
                    label={t("first_name")}
                    placeholder={t("first_name")}
                    name="first_name"
                    value={acc_form.values.first_name}
                    touched={acc_form.touched.first_name}
                    error={acc_form.errors.first_name}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <BaseInput
                    className="col-12"
                    label={t("last_name")}
                    placeholder={t("last_name")}
                    name="last_name"
                    value={acc_form.values.last_name}
                    touched={acc_form.touched.last_name}
                    error={acc_form.errors.last_name}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <BaseInput
                    className="col-12"
                    label={t("phone")}
                    placeholder={t("phone")}
                    name="contact_number"
                    value={acc_form.values.contact_number}
                    touched={acc_form.touched.contact_number}
                    error={acc_form.errors.contact_number}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <BaseInput
                    className="col-12"
                    label={t("phone_cell")}
                    placeholder={t("phone_cell")}
                    name="cell_number"
                    value={acc_form.values.cell_number}
                    touched={acc_form.touched.cell_number}
                    error={acc_form.errors.cell_number}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <BaseInput
                    className="col-12"
                    label={t("email")}
                    placeholder={t("email")}
                    name="email"
                    readOnly={true}
                    value={acc_form.values.email}
                  />
                  <BaseInput
                    className="col-12"
                    label={t("street")}
                    placeholder={t("street")}
                    name="street"
                    value={acc_form.values.street}
                    touched={acc_form.touched.street}
                    error={acc_form.errors.street}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <BaseInput
                    className="col-12"
                    label={t("city")}
                    placeholder={t("city")}
                    name="city"
                    value={acc_form.values.city}
                    touched={acc_form.touched.city}
                    error={acc_form.errors.city}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <div className="col-12">
                    <label>{t("state")}:</label>
                    <select class="application_select form-select" name="state"
                      value={acc_form.values.state}
                      onChange={acc_form.handleChange}
                    >
                      <option value="">{t("state")}</option>
                      {stateList.map((state, index) => {
                        return (
                          <option
                            key={index}
                            value={state.value}
                          >{state.label}</option>
                        )
                      })}
                    </select>
                    {acc_form.touched.state && acc_form.errors.state ? <span className="text-danger small">{acc_form.errors.state}</span> : null}
                  </div>
                  <BaseInput
                    className="col-12"
                    label={t("zip_code")}
                    placeholder={t("zip_code")}
                    name="zip_code"
                    value={acc_form.values.zip_code}
                    touched={acc_form.touched.zip_code}
                    error={acc_form.errors.zip_code}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                </div>
                <div className="col-md-4">
                  {/* Drivers License */}
                  <BaseInput
                    className="col-12"
                    label={t("driver_license_number")}
                    placeholder={t("driver_license_number")}
                    name="license_number"
                    value={acc_form.values.license_number}
                    touched={acc_form.touched.license_number}
                    error={acc_form.errors.license_number}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <BaseInput
                    className="col-12"
                    label={t("expiration_date")}
                    placeholder={t("expiration_date")}
                    name="license_expiry"
                    type="date"
                    value={acc_form.values.license_expiry}
                    touched={acc_form.touched.license_expiry}
                    error={acc_form.errors.license_expiry}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  {/* state issued */}
                  <div className="col-12">
                    <label>{t("state_issued")}:</label>
                    <select class="application_select form-select" name="license_state"
                      value={acc_form.values.license_state}
                      onChange={acc_form.handleChange}
                    >
                      <option value="">{t("state_issued")}</option>
                      {stateList.map((state, index) => {
                        return (
                          <option
                            key={index}
                            value={state.value}
                          >{state.label}</option>
                        )
                      })}
                    </select>
                    {acc_form.touched.license_state && acc_form.errors.license_state ? <span className="text-danger small">{acc_form.errors.license_state}</span> : null}
                  </div>
                  {/* CDL class types */}
                  <div className="col-12">
                    <span className={style.lable}>{t("cdl_class_type")}:</span>
                    <select class="application_select form-select" name="license_type"
                      value={acc_form.values.cdl_class}
                      onChange={acc_form.handleChange}
                    >
                      <option value="">{t("cdl_class_type")}</option>
                      {cdlClass.map((cdl, index) => {
                        return (
                          <option value={cdl.value} key={index}>{t(cdl.label)}</option>
                        )
                      })}
                    </select>
                    {acc_form.touched.license_type && acc_form.errors.license_type ? <span className="text-danger small">{acc_form.errors.license_type}</span> : null}
                  </div>
                  <BaseInput
                    className="col-12"
                    label={t("years_cdl_experience")}
                    placeholder={t("years_cdl_experience")}
                    name="years_cdl_experience"
                    type="number"
                    min={0}
                    value={acc_form.values.years_cdl_experience}
                    touched={acc_form.touched.years_cdl_experience}
                    error={acc_form.errors.years_cdl_experience}
                    onKeyDown={preventNegative}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  {/* is owner-operator */}
                  <div className="col mt-4">
                    <div class="form-check form-switch">
                      <label class="form-check-label" htmlFor="is_owner_operator">{t("is_owner_operator_question")}</label>
                      <input
                        checked={acc_form.values.is_owner_operator}
                        name="is_owner_operator"
                        onChange={acc_form.handleChange}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="is_owner_operator"
                        />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  {/* age limit */}
                  <div className="col-12 mt-4">
                    <div class="form-check form-switch">
                      <label class="form-check-label">{t("above_21")}</label>
                      <input class="form-check-input" readOnly type="checkbox" checked={acc_form.values.above_21} role="switch" />
                    </div>
                  </div>
                  {/* Highest degree */}
                  <div className=" col-12 mt-3 ">
                    <span className={style.lable}>{t("highest_degree")}:</span>
                    <select class="application_select form-select" name="highest_degree"
                      value={acc_form.values.highest_degree}
                      onChange={acc_form.handleChange}
                    >
                      <option value="">{t("highest_degree")}</option>
                      {driverDegree.map((degree, index) => {
                        return (<option value={degree.value} key={index}>{t(degree.label)}</option>
                        )
                      })}
                    </select>
                    {acc_form.touched.highest_degree && acc_form.errors.highest_degree ? <span className="text-danger small">{acc_form.errors.highest_degree}</span> : null}
                  </div>
                  <BaseInput
                    className="col-12"
                    label={t("emergency_contact")}
                    placeholder={t("name")}
                    name="emergency_contact_name"
                    value={acc_form.values.emergency_contact_name}
                    touched={acc_form.touched.emergency_contact_name}
                    error={acc_form.errors.emergency_contact_name}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <BaseInput
                    className="col-12"
                    label={t("phone")}
                    placeholder={t("phone")}
                    name="emergency_contact_number"
                    value={acc_form.values.emergency_contact_number}
                    touched={acc_form.touched.emergency_contact_number}
                    error={acc_form.errors.emergency_contact_number}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />
                  <BaseInput
                    className=" col-12"
                    label={t("relationship")}
                    placeholder={t("relationship")}
                    name="emergency_contact_relationship"
                    value={acc_form.values.emergency_contact_relationship}
                    touched={acc_form.touched.emergency_contact_relationship}
                    error={acc_form.errors.emergency_contact_relationship}
                    onChange={acc_form.handleChange}
                    handleBlur={acc_form.handleBlur}
                  />


                </div>
              </div>

                {(
                  acc_form.values.is_owner_operator &&
                  <div className='row'>
                    <div className="col-md-10 offset-md-1 mt-3">
                    <hr />
                    <h3>{t("equipment_owned")}</h3> <br />
                    <div>
                      {
                        acc_form.errors.equipment_owned &&
                        (typeof acc_form.errors.equipment_owned === "string") &&
                        <span className="text-danger small">{acc_form.errors.equipment_owned}</span>
                      }

                    </div>
                    {acc_form.values.equipment_owned.map((v, i) => {
                      const getOrNull = (field, type) => {
                        if (acc_form[field].equipment_owned && acc_form[field].equipment_owned[i]) {
                          return acc_form[field].equipment_owned[i][type];
                        }
                      };

                      return (
                        <div key={i} className='row'>
                          <div className="col-md-4">
                            <span className={style.lable}>{t("type")}:</span>
                            <select class="application_select form-select"
                                name={`equipment_owned.${i}.type`}
                                value={v.type}
                                onChange={acc_form.handleChange}
                              >
                              <option value="">{t("type")}</option>
                              {equipmentTypes.map((v, index) => {
                                return (
                                  <option value={v.value} key={index}>{t(v.label)}</option>
                                )
                              })}
                            </select>
                            {getOrNull("touched", "type") && getOrNull("errors", "type") ? <span className="text-danger small">{getOrNull("errors", "type")}</span> : null}
                          </div>
                          {(
                            v.type?.endsWith("_OTHER") &&
                            <BaseInput
                              className="col-md-5"
                              label={t("details")}
                              placeholder={t("details")}
                              value={v.type_other}
                              onChange={acc_form.handleChange}
                              handleBlur={acc_form.handleBlur}
                              touched={getOrNull("touched", "type_other")}
                              error={getOrNull("errors", "type_other")}
                              name={`equipment_owned.${i}.type_other`}
                              />)}
                          <BaseInput
                            className="col-md-2"
                            label={t("quantity")}
                            placeholder={t("quantity")}
                            value={v.quantity}
                            type="number"
                            min={0}
                            onChange={acc_form.handleChange}
                            handleBlur={acc_form.handleBlur}
                            touched={getOrNull("touched", "quantity")}
                            error={getOrNull("errors", "quantity")}
                            name={`equipment_owned.${i}.quantity`}
                          />
                          <div className="col-md-1">
                            <span className="btn btn-yellow mt-4" onClick={() => removeEquipmentOwned(i)}>x</span>
                          </div>
                        </div>
                      )
                    })}

                    <span className="btn btn-approved  mt-3" onClick={addEquipmentOwned}>+ {t("more")}</span>
                  </div>
                </div>

                )}

              <div className='row'>
                <div className="col-md-10 offset-md-1 mt-3">
                  <hr />
                  <h3>{t("equipment_experience")}</h3> <br />
                  <div>
                    {
                      acc_form.errors.equipment_experience &&
                      (typeof acc_form.errors.equipment_experience === "string") &&
                      <span className="text-danger small">{acc_form.errors.equipment_experience}</span>
                    }

                  </div>
                  {acc_form.values.equipment_experience.map((v, i) => {
                    const getOrNull = (field, type) => {
                      if (acc_form[field].equipment_experience && acc_form[field].equipment_experience[i]) {
                        return acc_form[field].equipment_experience[i][type];
                      }
                    };

                    return (
                      <div key={i}>
                        <div className='row'>
                          <div className="col-md-4">
                            <span className={style.lable}>{t("type")}:</span>
                            <select class="application_select form-select"
                                name={`equipment_experience.${i}.type`}
                                value={v.type}
                                onChange={acc_form.handleChange}
                              >
                              <option value="">{t("type")}</option>
                              {equipmentTypes.map((v, index) => {
                                return (
                                  <option value={v.value} key={index}>{t(v.label)}</option>
                                )
                              })}
                            </select>
                            {getOrNull("touched", "type") && getOrNull("errors", "type") ? <span className="text-danger small">{getOrNull("errors", "type")}</span> : null}
                          </div>
                          {/* <BaseInput
                            className="col-md-5"
                            label={t("type")}
                            placeholder={t("type")}
                            value={v.type}
                            onChange={acc_form.handleChange}
                            handleBlur={acc_form.handleBlur}
                            touched={getOrNull("touched", "type")}
                            error={getOrNull("errors", "type")}
                            name={`equipment_experience.${i}.type`}
                          /> */}
                          <BaseInput
                            className="col-md-5"
                            label={t("years_experience")}
                            placeholder={t("years_experience")}
                            value={v.years}
                            type="number"
                            min={0}
                            onChange={acc_form.handleChange}
                            handleBlur={acc_form.handleBlur}
                            touched={getOrNull("touched", "years")}
                            error={getOrNull("errors", "years")}
                            name={`equipment_experience.${i}.years`}
                          />
                          <div className="col-md-2 mt-4">
                            <span className="btn btn-yellow" onClick={() => removeEquipmentExperience(i)}>x</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <span className="btn btn-approved  mt-3" onClick={addEquipmentExperience}>+ {t("more")}</span>

                </div>
              </div>


              <div className="col-lg-12 col-12 mt-4 border-0 text-end">
                <button type="submit" className={`  ${style.update_btn}`} >
                  {t("update")}
                </button>
              </div>




            </form>
          </div>
          <hr />

          <div className='container-fluid'>
            <form onSubmit={sec_form.handleSubmit}>
              <div className="row">
                <div className="col-md-4 mt-lg-0 mt-3">
                  <h2>{t("past_employment")}</h2>
                  <Accordion defaultActiveKey="0">
                    {
                      sec_form.values.employers.map((v, i) => {
                        const getOrNull = (field, type) => {
                          if (sec_form[field].employers && sec_form[field].employers[i]) {
                            return sec_form[field].employers[i][type];
                          }
                        };
                          return (
                          <div key={i}>
                            <Accordion.Item eventKey={i}>
                              <Accordion.Header>
                                {v.name}

                                <span className="btn btn-yellow pl-4" onClick={() => removePastEmployer(i)}>x</span>
                              </Accordion.Header>
                              <Accordion.Body>
                                {/* Last employer4 */}
                                <BaseInput
                                  className="col-12"
                                  label={t("last_employer")}
                                  placeholder={t("name")}
                                  value={v.name}
                                  onChange={sec_form.handleChange}
                                  handleBlur={sec_form.handleBlur}
                                  touched={getOrNull("touched", "name")}
                                  error={getOrNull("errors", "name")}
                                  name={`employers.${i}.name`}
                                />
                                {/* Date employed */}
                                <div className="col-12 my-3">
                                  <label>{t("dates_employed")}:</label>
                                  <div className="d-flex align-items-center">
                                    <input
                                      value={v.start_at}
                                      onChange={sec_form.handleChange}
                                      onBlur={sec_form.handleBlur}
                                      name={`employers.${i}.start_at`}
                                      type="date"
                                      className="form-control"
                                      />
                                    <p className="mx-2">{t("to")}</p>
                                    <input
                                      value={v.end_at}
                                      onChange={sec_form.handleChange}
                                      onBlur={sec_form.handleBlur}
                                      name={`employers.${i}.end_at`}
                                      type="date"
                                      className="form-control"
                                      />
                                  </div>
                                </div>
                                {/* position title */}
                                <BaseInput
                                  className="col-12"
                                  label={t("title")}
                                  placeholder={t("title")}
                                  value={v.title}
                                  onChange={sec_form.handleChange}
                                  handleBlur={sec_form.handleBlur}
                                  touched={getOrNull("touched", "title")}
                                  error={getOrNull("errors", "title")}
                                  name={`employers.${i}.title`}
                                />
                                {/* company phone */}
                                <BaseInput
                                  className="col-12"
                                  label={t("phone")}
                                  placeholder={t("phone")}
                                  value={v.phone}
                                  onChange={sec_form.handleChange}
                                  handleBlur={sec_form.handleBlur}
                                  touched={getOrNull("touched", "phone")}
                                  error={getOrNull("errors", "phone")}
                                  name={`employers.${i}.phone`}
                                />
                                {/* company street */}
                                <BaseInput
                                  className="col-12"
                                  label={t("street")}
                                  placeholder={t("street")}
                                  value={v.street}
                                  onChange={sec_form.handleChange}
                                  handleBlur={sec_form.handleBlur}
                                  touched={getOrNull("touched", "street")}
                                  error={getOrNull("errors", "street")}
                                  name={`employers.${i}.street`}
                                />
                                {/* company city */}
                                <BaseInput
                                  className="col-12"
                                  label={t("city")}
                                  placeholder={t("city")}
                                  value={v.city}
                                  onChange={sec_form.handleChange}
                                  handleBlur={sec_form.handleBlur}
                                  touched={getOrNull("touched", "city")}
                                  error={getOrNull("errors", "city")}
                                  name={`employers.${i}.city`}
                                />
                                {/* company state */}
                                <div className="col-12 my-3">
                                  <label>{t("state")}:</label>
                                  <select
                                    class="application_select form-select"
                                    name={`employers.${i}.state`}
                                    onChange={sec_form.handleChange}
                                    value={v.state}
                                  >
                                    <option value="">{t("state")}</option>
                                    {stateList.map((state, index) => {
                                      return (
                                        <option
                                          key={index}
                                          value={state.value}
                                        >{state.label}</option>
                                      )
                                    })}
                                  </select>
                                </div>
                                {/* company zip */}
                                <BaseInput
                                  className="col-12"
                                  label={t("zip_code")}
                                  placeholder={t("zip_code")}
                                  value={v.zip_code}
                                  onChange={sec_form.handleChange}
                                  handleBlur={sec_form.handleBlur}
                                  touched={getOrNull("touched", "zip_code")}
                                  error={getOrNull("errors", "zip_code")}
                                  name={`employers.${i}.zip_code`}
                                />

                                {/* authorize */}
                                <div className="col mt-3">
                                  <div class="form-check form-switch">
                                    <label class="form-check-label" htmlFor={`past_employment_authorize${i}`}>{t("authorize_employers_to_contact_company_question")}</label>
                                    <input
                                      class="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      id={`past_employment_authorize${i}`}
                                      onChange={sec_form.handleChange}
                                      name={`employers.${i}.can_contact`}
                                      checked={v.can_contact} />
                                  </div>
                                </div>
                                {/* FMCSRs */}
                                <div className="col mt-3">
                                  <div class="form-check form-switch">
                                    <label class="form-check-label" htmlFor={`past_employment_fmcsrs${i}`}>{t("subject_to_fmcsrs_question")}</label>
                                    <input
                                      class="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      id={`past_employment_fmcsrs${i}`}
                                      onChange={sec_form.handleChange}
                                      name={`employers.${i}.is_subject_to_fmcsrs`}
                                      checked={v.is_subject_to_fmcsrs}
                                      />
                                  </div>
                                </div>
                                {/* is_subject_to_drug_tests */}
                                <div className="col mt-3">
                                  <div class="form-check form-switch">
                                    <label class="form-check-label" htmlFor={`past_employment_drug_tests${i}`}>{t("subject_to_drug_tests_question")}</label>
                                    <input
                                      class="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      id={`past_employment_drug_tests${i}`}
                                      onChange={sec_form.handleChange}
                                      name={`employers.${i}.is_subject_to_drug_tests`}
                                      checked={v.is_subject_to_drug_tests}
                                      />
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>

                          </div>
                        )
                      })
                    }
                  </Accordion>

                  {
                    sec_form.values.employers.length < 3 &&
                    <div className="col mt-3">
                      <span className="btn btn-yellow" onClick={addPastEmployer}>+{t("more_jobs", { number: 3 - sec_form.values.employers.length})}</span>
                    </div>

                  }

                </div>

                {/* Safety column */}
                <div className="col-md-4 mt-lg-0 mt-3">
                  <h2>{t("safety_background")}</h2>


                  {/* drug test */}
                  <div className="col mt-3">
                    <div class="form-check form-switch mb-34">
                      <label class="form-check-label" htmlFor="can_pass_drug_test">{t("can_pass_drug_test")}</label>
                      <input
                        checked={sec_form.values.can_pass_drug_test}
                        name="can_pass_drug_test"
                        onChange={sec_form.handleChange}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="can_pass_drug_test"
                        />
                    </div>
                  </div>
                  {/* DUI? */}
                  <div className="col mt-3">
                    <div class="form-check form-switch  mb-34">
                      <label class="form-check-label" htmlFor="has_past_duis">{t("has_past_duis")}:</label>
                      <input
                        checked={sec_form.values.has_past_dui}
                        onChange={sec_form.handleChange}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        name="has_past_dui"
                        id="has_past_duis"
                        />
                    </div>
                  </div>
                  {/* DUI Date */}
                  {(
                    sec_form.values.has_past_dui &&
                  <div className="col mt-3">
                    <label>{t("years_of_past_duis")}:</label>
                    <CreatableSelect

                      isMulti
                      components={{
                        DropdownIndicator: null,
                      }}
                      isClearable
                      menuIsOpen={false}
                      placeholder={t("years_of_past_duis")}
                      inputValue={dui_year_current_value}
                      onInputChange={(value) => set_dui_year_current_value(value)}
                      onKeyDown={handleDUIYears}
                      value={sec_form.values.dui_years.map(v => ({ label: v, value: v }))}

                    />
                  </div>)}
                  {/* criminal history */}
                  <BaseInput
                    className=" col-12"
                    label={t("criminal_history_last_3_years")}
                    placeholder={t("criminal_history_last_3_years")}
                    name="criminal_history"
                    value={sec_form.values.criminal_history}
                    touched={sec_form.touched.criminal_history}
                    error={sec_form.errors.criminal_history}
                    onChange={sec_form.handleChange}
                    handleBlur={sec_form.handleBlur}
                  />
                  {/* accidents */}
                  <BaseInput
                    className=" col-12"
                    label={t("accidents_last_5_years")}
                    placeholder={t("accidents_last_5_years")}
                    name="accident_count"
                    type="number"
                    min={0}
                    value={sec_form.values.accident_count}
                    touched={sec_form.touched.accident_count}
                    error={sec_form.errors.accident_count}
                    onChange={sec_form.handleChange}
                    handleBlur={sec_form.handleBlur}
                    onKeyDown={preventNegative}
                  />
                  {/* accident details */}
                  {sec_form.values.accident_count > 0 &&
                    <div className="col mt-3 mt-17">
                      <label htmlFor="accident_details" class="form-label m-0">{t("accident_details")}:</label>
                      <textarea
                        class="form-control "
                        name="accident_details"
                        id="accident_details"
                        rows="3"
                        onChange={sec_form.handleChange}
                        value={sec_form.values.accident_details}></textarea>
                    </div>
                  }

                  {/* col-2 */}


                </div>
                <div className="col-md-4 border-0 text-end">
                  <div className="col mt-85 ">
                    {/* license */}
                    <div className="col mt-3">
                      <div class="form-check form-switch">
                        <label class="form-check-label" htmlFor="has_had_license_revoked">{t("has_had_license_revoked")}</label>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="has_had_license_revoked"
                          checked={sec_form.values.safety_questions.LICENSE_REVOKED.response}
                          name="safety_questions.LICENSE_REVOKED.response"
                          onChange={sec_form.handleChange}
                        />
                      </div>
                    </div>
                    {/* revoked details */}
                    {
                      sec_form.values.safety_questions.LICENSE_REVOKED.response && (
                        <div className="col mt-3">
                          <label htmlFor="has_had_license_revoked_details" class="form-label">{t("details")}:</label>
                          <textarea
                            class="form-control"
                            id="has_had_license_revoked_details"
                            rows="3"
                            onChange={sec_form.handleChange}
                            value={sec_form.values.safety_questions.LICENSE_REVOKED.details}
                            name="safety_questions.LICENSE_REVOKED.details"
                            />
                        </div>
                      )
                    }
                    {/* violation */}
                    <div className="col mt-34 ">
                      <div class="form-check form-switch">
                        <label class="form-check-label" htmlFor="has_has_psp_violations">{t("has_has_psp_violations")}</label>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="has_has_psp_violations"
                          checked={sec_form.values.safety_questions.VIOLATIONS_PSP.response}
                          name="safety_questions.VIOLATIONS_PSP.response"
                          onChange={sec_form.handleChange}
                        />
                      </div>
                    </div>
                    {/* violation details */}
                    {
                      sec_form.values.safety_questions.VIOLATIONS_PSP.response && (
                        <div className="col mt-48">
                          <label htmlFor="has_has_psp_violations_details" class="form-label">{t("details")}:</label>
                          <textarea
                            class="form-control"
                            id="has_has_psp_violations_details"
                            rows="3"
                            onChange={sec_form.handleChange}
                            value={sec_form.values.safety_questions.VIOLATIONS_PSP.details}
                            name="safety_questions.VIOLATIONS_PSP.details"
                            />
                        </div>
                      )
                    }
                    {/* 5 years tickets */}
                    <div className="col mt-48">
                      <div class="form-check form-switch">
                        <label class="form-check-label" htmlFor="has_had_tickets_last_5_years">{t("has_had_tickets_last_5_years")}</label>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="has_had_tickets_last_5_years"
                          checked={sec_form.values.safety_questions.TICKETS.response}
                          name="safety_questions.TICKETS.response"
                          onChange={sec_form.handleChange}
                        />
                      </div>
                    </div>
                    {/* 5 years tickets details*/}
                    {
                      sec_form.values.safety_questions.TICKETS.response && (
                        <div className="col mt-48">
                          <label htmlFor="has_had_tickets_last_5_years_details" class="form-label">{t("details")}:</label>
                          <textarea
                            class="form-control"
                            id="has_had_tickets_last_5_years_details"
                            rows="3"
                            onChange={sec_form.handleChange}
                            value={sec_form.values.safety_questions.TICKETS.details}
                            name="safety_questions.TICKETS.details"
                            />
                        </div>
                      )
                    }

                    {/* drug test */}
                    <div className="col">
                      <div class="form-check form-switch  mt-55">
                        <label class="form-check-label" htmlFor="has_had_positive_drug_test">{t("has_had_positive_drug_test")}</label>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="has_had_positive_drug_test"
                          checked={sec_form.values.safety_questions.POSITIVE_DRUG_TEST.response}
                          name="safety_questions.POSITIVE_DRUG_TEST.response"
                          onChange={sec_form.handleChange}
                        />
                      </div>
                    </div>

                    {/* drug test details */}
                    {
                      sec_form.values.safety_questions.POSITIVE_DRUG_TEST.response && (
                        <div className="col mt-48">
                          <label htmlFor="has_had_positive_drug_test_details" class="form-label">{t("details")}:</label>
                          <textarea
                            class="form-control"
                            id="has_had_positive_drug_test_details"
                            rows="3"
                            onChange={sec_form.handleChange}
                            value={sec_form.values.safety_questions.POSITIVE_DRUG_TEST.details}
                            name="safety_questions.POSITIVE_DRUG_TEST.details"
                            />
                        </div>
                      )
                    }
                  </div>

                </div>
                <div className="col-md-12 border-0 text-end">
                  <div className="col">
                    <button
                      type="submit" className={`  ${style.update_btn}`} >

                      {t("update")}
                    </button>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
};


MyApplication.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
