import { useFormik } from 'formik';
import Papa from 'papaparse';
import { useState } from 'react';
import { Col, Dropdown, InputGroup, ProgressBar, Row, Table } from 'react-bootstrap';
import { Check, CheckCircle, ExclamationTriangle, XCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { SchemaDescription, SchemaObjectDescription } from 'yup/lib/schema';
import Switch from '../../../components/controls/switch';
import OverlyPopover from '../../../components/popover/overly-popover';
import { JobEquipmentType } from '../../../enums/jobs/job-equipment-type.enum';
import { DriverEndorsement } from '../../../enums/users/driver-endorsement.enum';
import { DriverLicenseType } from '../../../enums/users/driver-license-type.enum';
import { EducationLevel } from '../../../enums/users/education-level.enum';
import { VehicleTransmissionType } from '../../../enums/vehicles/vehicle-transmission-type.enum';
import { isJwtExpired, useAuth } from '../../../hooks/use-auth';
import { TranslateInterface, useTranslation } from '../../../hooks/use-translation';
import { EmployeeExperienceEntity } from '../../../models/employee/employee-experience.entity';
import { EmployeeEntity } from '../../../models/employee/employee.entity';
import EmployeeApi from '../../../pages/api/employee';
import * as _style from '../../../public/components/styles/ImportApplicantsModule.module.css';
import { matchEnum } from '../../../utils/enums.utils';
import { FormikInterface } from '../../../utils/formik';

function unique<T>(value: T, index: number, self: T[]) {
  return Boolean(value) && self.indexOf(value) == index;
}

const ImportEmployees = () => {
  const style: any = _style;

  const { t } = useTranslation();
  let { user, refreshToken, logoutAndRedirect } = useAuth();

  const schema = EmployeeEntity.yupSchemaForImportEmployees();

  const schemaDescribe = schema.describe();

  const [warnings, setWarnings] = useState({});
  const [csvErrors, setCsvErrors] = useState([]);

  const api = new EmployeeApi();
  /**
   * @type {EmployeeEntity[]}
   */
  const initialValues = [];
  const form = useFormik({
    initialValues: {
      items: initialValues,
    },
    validationSchema: yup.object({
      items: (
        yup.array(schema).min(1, t('PLEASE_UPLOAD_A_FILE_WITH_AT_LEAST_ONE_ROW')) as any
      ).unique(
        t('{name}_must_be_unique_in_list', { name: 'EMAIL' }, { translateProps: true }),
        'email',
        (v) => v.email
      ),
    }),
    validate: async (values) => {
      const errors = {};

      let lastProgress = 0;
      for (let i = 0; i < values.items.length; i++) {
        const employee = values.items[i];

        if (employee.phone?.length > 3 && !employee.phone.startsWith('+1')) {
          employee.phone = '+1 ' + employee.phone;
        }

        if (
          employee.emergency_contact_number?.length > 3 &&
          !employee.emergency_contact_number.startsWith('+1')
        ) {
          employee.emergency_contact_number = '+1 ' + employee.emergency_contact_number;
        }

        // if (employee.email) {
        //     const rowError: { email?: string; phone?: string } = {};
        //     const matches = await api.list({ email: employee.email });

        //     if (matches.some((v) => v.company?.id != null))
        //         rowError.email = t(
        //             "{name}_ALREADY_EXISTS",
        //             { name: "EMAIL" },
        //             { translateProps: true }
        //         );
        //     else if (matches.some((v) => v.company == null))
        //         rowError.email = t(
        //             "{name}_ALREADY_EXISTS",
        //             { name: "EMAIL" },
        //             { translateProps: true }
        //         );
        //     // else if (matches.some(v => v.company == null)) rowError.email = t("{name}_ALREADY_EXISTS_NO_MERGE", { name: "EMAIL" }, { translateProps: true });

        //     if (employee.phone) {

        //         if (matches.some((v) => v.company?.id != null))
        //             rowError.phone = t(
        //                 "{name}_ALREADY_EXISTS",
        //                 { name: "PHONE" },
        //                 { translateProps: true }
        //             );
        //         else if (matches.some((v) => v.company == null))
        //             rowError.phone = t(
        //                 "{name}_ALREADY_EXISTS",
        //                 { name: "PHONE" },
        //                 { translateProps: true }
        //             );
        //         // else if (matches.some(v => v.company == null)) rowError.phone = t("{name}_ALREADY_EXISTS_NO_MERGE", { name: "PHONE" }, { translateProps: true });
        //     }
        //     if (rowError) {
        //         errors[i] = rowError;
        //     }
        // }

        let progress = Math.floor(((i + 1) * 100) / values.items.length);

        if (progress != lastProgress) {
          setProgress(progress);
          lastProgress = progress;
        }
      }

      setProgress(100);
      setWarnings(errors);
    },
    onSubmit: async (values) => {
      let lastProgress = 0;

      for (let i = 0; i < values.items.length; i++) {
        let dto = values.items[i];

        if (!!dto.birthdate) {
          const utcBirthdate = new Date(dto.birthdate);
          dto.birthdate = new Date(
            utcBirthdate.getUTCFullYear(),
            utcBirthdate.getUTCMonth(),
            utcBirthdate.getUTCDate() + 2
          ).toISOString();
        }
        if (!!dto.hire_date) {
          const utcDateHired = new Date(dto.hire_date);
          dto.hire_date = new Date(
            utcDateHired.getUTCFullYear(),
            utcDateHired.getUTCMonth(),
            utcDateHired.getUTCDate() + 2
          ).toISOString();
        }
        if (!!dto.license_expiry) {
          const utcLicenseExpiry = new Date(dto.license_expiry);
          dto.license_expiry = new Date(
            utcLicenseExpiry.getUTCFullYear(),
            utcLicenseExpiry.getUTCMonth(),
            utcLicenseExpiry.getUTCDate() + 2
          ).toISOString();
        }

        try {
          if (isJwtExpired(user.jwt)) {
            if (user.jwtRefresh) {
              // console.log("isJwtExpired(user.jwtRefresh)", isJwtExpired(user.jwtRefresh));
              if (isJwtExpired(user.jwtRefresh)) {
                // console.log("loginGuard:: jwt refresh expired", router.asPath)
                return !(await logoutAndRedirect());
              }
              user = await refreshToken();
            }
          }

          await api.create(dto);
        } catch (e) {
          console.log('error saving applicant', i, e.response);
          form.setFieldError(`items.${i}.id`, t('UNABLE_TO_SAVE'));
          if (e?.response?.data?.job) {
            toast.error(
              t(e?.response?.data?.job?.message, {
                jobId: e?.response?.data?.job?.id,
              })
            );
          } else if (e?.response?.data?.user) {
            toast.error(
              t(e?.response?.data?.user?.message, {
                managerId: e?.response?.data?.user?.id,
              })
            );
          } else if (e?.response?.data?.user) {
            toast.error(
              t(e?.response?.data?.user?.message, {
                email: e?.response?.data?.user?.email,
              })
            );
          } else toast.error(t('unable_to_save_information'));

          return;
        }

        let progress = Math.floor(((i + 1) * 100) / values.items.length);

        if (progress != lastProgress) {
          setProgress(progress);
          lastProgress = progress;
        }
      }

      toast.success(t('successfully_saved_information'));

      setTimeout(onClearClick, 2000);
    },
  });

  const [progress, setProgress] = useState(0);

  const [fileName, setFileName] = useState('');

  /**
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const {
      target: {
        files: [file],
        value,
      },
    } = e;
    setFileName(value);
    setCsvErrors([]);

    if (file) {
      await Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: validateFileContent,
      });
    }
  }

  function validateFileContent(results): void {
    let {
      data,
      errors,
      meta: { fields },
    } = results;
    console.log('results', { data, errors, fields });

    const contents = data
      ?.map((row, i) => {
        const entity = new EmployeeEntity();
        if (!Object.values(row)?.some(Boolean)) {
          errors = errors.filter((v) => v.row != i);
          return false;
        }

        Object.entries(row)
          ?.map(([key, value]: [string, any]) => {
            const fieldSchema = schemaDescribe.fields[key];
            if (!fieldSchema) return;

            switch (fieldSchema?.type) {
              case 'boolean':
                entity[key] =
                  value.trim().toLowerCase().startsWith('y') || value.toLowerCase().startsWith('t');
                break;
              case 'array':
                entity[key] = value
                  .split(',')
                  ?.map((v) => v.trim())
                  .filter((v) => !!v);
                break;
              case 'number':
                entity[key] = value != '' ? Number(value) : null;
                break;
              case 'date':
                entity[key] = value != '' ? value : null;
                break;
              default:
                entity[key] = value.trim();
            }

            switch (key) {
              // case "license_restrictions":
              // entity.license_restrictions = entity.license_restrictions
              //     .map((v, i, self) => {
              //         if (!Object.values(LicenseRestrictions).includes(v)) {
              //             entity.license_restrictions_other =
              //                 v + ", " + (entity.license_restrictions_other || "");
              //             return LicenseRestrictions.OTHER;
              //         }
              //         return matchEnum(
              //             v,
              //             LicenseRestrictions,
              //             "LicenseRestrictions",
              //             t
              //         );
              //     })
              //     ?.filter((v, i, self) => Boolean(v) && self.indexOf(v) == i);
              // break;
              case 'transmission_type':
                entity.transmission_type = entity.transmission_type
                  ?.filter(unique)
                  ?.map((v) => matchEnum(v, VehicleTransmissionType, 'VehicleTransmissionType', t))
                  ?.filter(unique);
                break;
              case 'endorsements':
                entity.endorsements = entity.endorsements
                  ?.filter(unique)
                  ?.map((v) => {
                    // if (!Object.values(DriverEndorsement).includes(v)) {
                    //     entity.endorsements_other =
                    //         v + ", " + (entity.endorsements_other || "");
                    //     return DriverEndorsement.OTHER;
                    // }
                    return matchEnum(v, DriverEndorsement, 'DriverEndorsement', t);
                  })
                  ?.filter(unique);
                break;
              case 'highest_degree':
                entity.highest_degree = matchEnum(
                  entity.highest_degree,
                  EducationLevel,
                  'EducationLevel',
                  t
                );
                break;
              case 'license_type':
                entity.license_type = !entity.license_type
                  ? DriverLicenseType.NO_CDL
                  : matchEnum(entity.license_type, DriverLicenseType, 'DriverLicenseType', t);
                break;
              case 'equipment_experience':
                entity.equipment_experience = entity.equipment_experience
                  ?.filter(unique)
                  ?.map((v) => {
                    const equipmentExperienceObject = new EmployeeExperienceEntity();
                    if (
                      !Object.values(JobEquipmentType).includes(v.toString() as JobEquipmentType)
                    ) {
                      equipmentExperienceObject.type_other =
                        v + ', ' + (equipmentExperienceObject.type_other || '');
                      equipmentExperienceObject.type = JobEquipmentType.OTHER;
                    } else {
                      equipmentExperienceObject.type = matchEnum(
                        v.toString(),
                        JobEquipmentType,
                        'JobEquipmentType',
                        t
                      );
                    }
                    return equipmentExperienceObject;
                  })
                  ?.filter(unique);
                break;
            }
          })
          ?.filter(Boolean);
        return entity;
      })
      ?.filter(Boolean);
    if (errors?.length) setCsvErrors(errors);
    form?.setValues({ items: contents }, true);
  }

  const headers = Object.keys(schemaDescribe.fields).filter((v) => {
    switch (v) {
      case 'equipment_owned':
      case 'employers':
      case 'documents':
      case 'street':
      case 'jobs':
        return false;
      default:
        return true;
    }
  }); //Object.keys(new ApplicantEntity());

  const onClearClick = (e) => {
    form.resetForm();
    setFileName('');
    setProgress(0);
    setCsvErrors([]);
  };

  const [onlyErrors, setOnlyErrors] = useState(false);

  /**
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onOnlyErrorsChange = (e) => {
    setOnlyErrors(e.target.checked);
  };

  const canUpload = !fileName && !form.isValidating && !form.isSubmitting;
  const canImport =
    form.isValid && !form.isValidating && !form.isSubmitting && form.values.items.length > 0;
  const canClear =
    (form.values.items.length > 0 || fileName) && !form.isValidating && !form.isSubmitting;
  return (
    <>
      <Row>
        <Col sm="6" className="my-3">
          <InputGroup>
            <div className="input-group-prepend">
              <a
                download
                href="../../../../EmployeeTemplate.xlsx"
                type="button"
                // onClick={onDownloadClick}
                className="btn btn-md btn-primary pl-3"
              >
                {t('DOWNLOAD_TEMPLATE')}
              </a>
            </div>
            <input
              onChange={onFileChange}
              disabled={!canUpload}
              className="form-control"
              type="file"
              accept=".csv"
              value={fileName}
              id="formFile"
            />
            {!!fileName && (
              <div className="input-group-append">
                <button
                  type="button"
                  disabled={!canClear}
                  onClick={onClearClick}
                  className="btn btn-md btn-danger"
                >
                  {t('CLEAR')}
                </button>
              </div>
            )}
          </InputGroup>
        </Col>
        <Col sm="6" className="my-3">
          <div style={{ float: 'right' }}>
            <button
              type="button"
              disabled={!canImport}
              onClick={form.submitForm}
              className={`btn btn-md btn-primary`}
            >
              {t('IMPORT')}
            </button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{ float: 'left' }}>
            {!form.isValid && (
              <div className="text-danger small">
                {t('ONE_OR_MORE_ERRORS_WERE_FOUND_ON_INPUT_FILE')}
              </div>
            )}
          </div>
          <br />
          {Boolean(csvErrors.length) && (
            <div className="text-warning" style={{ float: 'left' }}>
              {csvErrors.map((error, i) => (
                <div key={i} className="text-bold small">
                  {error.message} at row {error.row + 1}
                </div>
              ))}
            </div>
          )}
          <div className="text-nowrap" style={{ float: 'right' }}>
            <OverlyPopover skipTranslate={false} str={'ONLY_DISPLAY_ERRORS_EXPLANATION'}>
              <Switch
                label={'ONLY_DISPLAY_ERRORS'}
                readOnly={!canClear}
                value={onlyErrors}
                onChange={onOnlyErrorsChange}
              />
            </OverlyPopover>
          </div>
        </Col>
      </Row>
      {progress > 0 && progress < 100 && (
        <Row>
          <Col>
            <ProgressBar
              variant="primary"
              min={0}
              max={100}
              now={progress}
              label={`${progress}%`}
              striped
              animated
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col className={`p-0 ${style.table_wrapper_overflowX}`}>
          <Table striped bordered hover className={style.table_overflowX}>
            <thead>
              <tr>
                <th className={style.frozen_col}>
                  <CheckCircle />
                </th>
                <th className={style.frozen_col}>#</th>
                {headers.map((k) => {
                  const text = `${k}${
                    (schemaDescribe.fields[k] as SchemaDescription).tests.some(
                      (v) => v.name == 'required'
                    )
                      ? '*'
                      : ''
                  }`;

                  switch (k) {
                    // case "license_restrictions":
                    //     return (
                    //         <th>
                    //             <Dropdown>
                    //                 <Dropdown.Toggle variant="light">{text}</Dropdown.Toggle>
                    //                 <Dropdown.Menu>
                    //                     {Object.values(LicenseRestrictions).map(v => {
                    //                         return (<Dropdown.ItemText>{v}</Dropdown.ItemText>);
                    //                     })}
                    //                 </Dropdown.Menu>
                    //             </Dropdown>
                    //         </th>
                    //     );
                    case 'transmission_type':
                      return (
                        <th>
                          <Dropdown>
                            <Dropdown.Toggle variant="light">{text}</Dropdown.Toggle>
                            <Dropdown.Menu>
                              {Object.values(VehicleTransmissionType).map((v) => {
                                return <Dropdown.ItemText>{v}</Dropdown.ItemText>;
                              })}
                            </Dropdown.Menu>
                          </Dropdown>
                        </th>
                      );
                    case 'endorsements':
                      return (
                        <th>
                          <Dropdown>
                            <Dropdown.Toggle variant="light">{text}</Dropdown.Toggle>
                            <Dropdown.Menu>
                              {Object.values(DriverEndorsement).map((v) => {
                                return <Dropdown.ItemText>{v}</Dropdown.ItemText>;
                              })}
                            </Dropdown.Menu>
                          </Dropdown>
                        </th>
                      );
                    case 'highest_degree':
                      return (
                        <th>
                          <Dropdown>
                            <Dropdown.Toggle variant="light">{text}</Dropdown.Toggle>
                            <Dropdown.Menu>
                              {Object.values(EducationLevel).map((v) => {
                                return <Dropdown.ItemText>{v}</Dropdown.ItemText>;
                              })}
                            </Dropdown.Menu>
                          </Dropdown>
                        </th>
                      );
                    case 'license_type':
                      return (
                        <th>
                          <Dropdown>
                            <Dropdown.Toggle variant="light">{text}</Dropdown.Toggle>
                            <Dropdown.Menu>
                              {Object.values(DriverLicenseType).map((v) => {
                                return <Dropdown.ItemText>{v}</Dropdown.ItemText>;
                              })}
                            </Dropdown.Menu>
                          </Dropdown>
                        </th>
                      );
                    case 'equipment_experience':
                      return (
                        <th>
                          <Dropdown>
                            <Dropdown.Toggle variant="light">{text}</Dropdown.Toggle>
                            <Dropdown.Menu>
                              {Object.values(JobEquipmentType)
                                ?.filter((v) => v != JobEquipmentType.OTHER)
                                ?.map((v) => {
                                  return <Dropdown.ItemText>{v}</Dropdown.ItemText>;
                                })}
                            </Dropdown.Menu>
                          </Dropdown>
                        </th>
                      );
                    default:
                      return <th>{text}</th>;
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {typeof form.errors.items == 'string' && (
                <tr>
                  <td colSpan={headers.length + 2}>
                    <span className="text-danger small">{form.errors.items}</span>
                  </td>
                </tr>
              )}
              {form.values.items.map((v, i) => {
                const meta = form.getFieldMeta(`items.${i}`);

                const findIcon = () => {
                  if (meta.error) return <XCircle color="red" />;

                  if (warnings[i]) return <ExclamationTriangle color="orange" />;

                  return <Check color="green" />;
                };

                if (onlyErrors && !meta.error) return null;

                return (
                  <tr className={onlyErrors && !meta.error ? `d-none` : ''}>
                    <td className={style.frozen_col}>{findIcon()}</td>
                    <td className={style.frozen_col}>{i + 1}</td>
                    {headers.map((h) => (
                      <td>{guessControl(form, schema, warnings[i], h, i, t)}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

function guessControl(
  form: FormikInterface,
  schema,
  warnings: Record<string, string>,
  header: string,
  index: number,
  t: TranslateInterface
) {
  const desc: SchemaObjectDescription = schema.fields[header];
  const name = `items.${index}.${header}`;
  const meta = form.getFieldMeta(name);

  let value = meta.value;
  if (desc.type == 'boolean') {
    value = value ? t('YES') : t('NO');
  }

  if (value) {
    switch (header) {
      // case "license_restrictions":
      //     value = value
      //         .map(v => {
      //             const key = `LicenseRestrictions.${v}`;
      //             const text = t(key);
      //             if (key == text) return v;

      //             return text;
      //         });
      //     break;
      case 'transmission_type':
        value = value.map((v) => {
          const key = `VehicleTransmissionType.${v}`;
          const text = t(key);
          if (key == text) return v;

          return text;
        });
        break;
      case 'endorsements':
        value = value.map((v) => {
          const key = `DriverEndorsement.${v}`;
          const text = t(key);
          if (key == text) return v;

          return text;
        });
        break;
      case 'highest_degree':
        {
          const key = `EducationLevel.${value}`;
          const text = t(key);
          if (key != text) value = text;
        }
        break;
      case 'license_type':
        {
          const key = `DriverLicenseType.${value}`;
          const text = t(key);
          if (key != text) value = text;
        }
        break;
      case 'equipment_experience':
        value = value.map((v) => {
          const key = `JobEquipmentType.${v.type}`;
          const text = t(key);
          if (key == text) return v;

          return text;
        });
        break;
    }
  }

  if (Array.isArray(value)) {
    return (
      <>
        <ul itemType="circle">
          {value.map((v, i) => {
            const error = meta.error ? meta.error[i] : null;

            if (error) {
              return (
                <li>
                  {v}
                  <br />
                  <span className="text-danger small">{error}</span>
                </li>
              );
            }

            return <li>{v}</li>;
          })}
        </ul>
      </>
    );
  }

  if (meta.error) {
    const errorString = JSON.stringify(meta.error);
    return (
      <>
        <span>{value}</span>
        <br />
        <span className="text-danger small">{errorString}</span>
      </>
    );
  }

  if (warnings && warnings[header]) {
    return (
      <>
        <span>{value}</span>
        <br />
        <span className="text-warning small">{warnings[header]}</span>
      </>
    );
  }
  return value;
}
export default ImportEmployees;
