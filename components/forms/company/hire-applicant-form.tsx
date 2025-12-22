import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { HireApplicantDto } from "../../../models/applicant/hire-applicant.dto";
import { JobEntity } from "../../../models/job/job.entity";
import { SearchCompanyJobsDto } from "../../../models/job/search-company-jobs.dto";
import EmployeeApi from "../../../pages/api/employee";
import JobApi from "../../../pages/api/job";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { useEffectAsync } from "../../../utils/react";
import EntityForm from "../../layouts/page/entity-form";
import ViewModal from "../../view-details/view-modal";
import BaseSelect from "../base-select";
import { BaseFormProps } from "./base-form-props";
import { JobForm } from "./job-form";
import { ExpiryStatus } from "../../../enums/jobs/expiry-status.enum";

export interface HireApplicantFormProps
  extends BaseFormProps<ApplicantEntity> {}

export function HireApplicantForm(props: HireApplicantFormProps) {
  let { className, entity } = props;
  let { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [jobs, setJobs] = useState<JobEntity[]>([]);
  const [createJob, setCreateJob] = useState<boolean>(false);

  useEffectAsync(async () => {
    const api = new JobApi();
    const searchDto: SearchCompanyJobsDto = {
      expiry_status: ExpiryStatus.ACTIVE,
      companyId: user?.company?.id,
    };
    const jobs: JobEntity[] = (await api.list(searchDto)) as JobEntity[];

    setJobs(jobs);
  }, [user]);

  const routeToEmployees = () =>
    router.push("/dashboard/company/compliance/employee-directory");

  // Helper function to format applicant notes into HR notes
  const formatApplicantNotesForHR = () => {
    if (!entity?.notes || entity.notes.length === 0) {
      return "";
    }

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    // Sort notes by creation date (oldest first) and format them
    const sortedNotes = [...entity.notes].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateA - dateB;
    });

    const formattedNotes = sortedNotes.map((note) => {
      let noteHeader = `[${formatDate(note.created_at)}]`;

      if (note.user?.first_name) {
        noteHeader += ` ${note.user.first_name} ${note.user.last_name || ''}`.trim();
      }

      if (note.last_updated_at && note.last_updated_at !== note.created_at) {
        noteHeader += ` (Edited: ${formatDate(note.last_updated_at)})`;
      }

      return `${noteHeader}\n${note.text}`;
    }).join('\n\n---\n\n');

    return formattedNotes;
  };

  const hireApplicantForm = useFormik({
    initialValues: new HireApplicantDto(),
    validationSchema: HireApplicantDto.yupSchema(),
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const employeeApi = new EmployeeApi();

        // Hire the applicant (creates employee record)
        const newEmployee = await employeeApi.hire(values);

        // Copy applicant notes to employee notes
        if (entity?.notes && entity.notes.length > 0 && newEmployee?.id) {
          try {
            // Create employee notes from applicant notes (preserving original timestamps and content)
            for (const applicantNote of entity.notes) {
              await employeeApi.notes.create(newEmployee.id, {
                text: applicantNote.text
              });
            }
          } catch (noteError) {
            console.error('Error copying notes to employee:', noteError);
            // Don't fail the whole hire process if note copying fails
            toast.warning(t("Employee hired successfully, but some notes could not be copied"));
          }
        }

        resetForm();
        toast.success(t("STATUS_UPDATED_SUCCESSFULLY"));
        setTimeout(() => {
          routeToEmployees();
        }, 1000);
      } catch (e) {
        globalAjaxExceptionHandler(e, {
          formik: hireApplicantForm,
          t,
          toast,
        });
      }
    },
  });

  const onJobAdded = (job: JobEntity) => {
    setJobs([...jobs, job]);
    setCreateJob(false);
  };

  const jobOptions = useMemo(() => jobs, [jobs]);

  return (
    <>
      {Boolean(entity?.id) && !Boolean(entity?.is_hired) && (
        <Button
          type="button"
          className={`btn theme-primary-btn mr-2`}
          onClick={() =>
            hireApplicantForm.setValues({ applicantId: entity?.id })
          }
          style={{ borderRadius: '0.375rem' }}
        >
          {t("HIRE")}
        </Button>
      )}
      <ViewModal
        title={t("HIRE")}
        show={Boolean(hireApplicantForm.values?.applicantId)}
        onCloseClick={() => hireApplicantForm.resetForm()}
        size="lg"
      >
        <EntityForm
          onSubmit={hireApplicantForm.handleSubmit}
          formik={hireApplicantForm}
          canSubmit={hireApplicantForm.isValid}
          submitLabel="HIRE"
        >
          <Row className="py-3 px-5">
            <Col>
              <BaseSelect
                autoFocus
                name={`jobId`}
                readOnly={Boolean(entity?.is_hired)}
                required
                placeholder={t(
                  "SELECT_{name}",
                  { name: "JOB" },
                  { translateProps: true }
                )}
                options={jobOptions}
                labelKey="title"
                label="JOB"
                valueKey="id"
                formik={hireApplicantForm}
              />
              <button
                disabled={Boolean(entity?.is_hired)}
                type="button"
                onClick={() => setCreateJob(true)}
                className="my-2 btn btn-link"
              >
                {t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
              </button>
            </Col>
          </Row>
        </EntityForm>
      </ViewModal>
      <ViewModal
        title={t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
        show={createJob}
        onCloseClick={() => setCreateJob(false)}
        size="lg"
      >
        <JobForm onSaveComplete={onJobAdded} />
      </ViewModal>
    </>
  );
}
