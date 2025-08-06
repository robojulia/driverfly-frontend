import { useFormik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { Button, Row } from "react-bootstrap";
import { CloudArrowDown, Eye, Plus, Send, Trash } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import ShowEnumFromString from "../../../../../components/enum-filters/show-enum-from-string";
import BaseSelect from "../../../../../components/forms/base-select";
import FileInput from "../../../../../components/forms/file-input";
import ShowFormattedDate from "../../../../../components/jobs/show-formatted-date";
import EntityForm from "../../../../../components/layouts/page/entity-form";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { TabbedLayout } from "../../../../../components/layouts/page/tabbed-layout";
import { LoaderIcon } from "../../../../../components/loading/loader-icon";
import OverlyPopover from "../../../../../components/popover/overly-popover";
import ViewDataTable, {
  getDataTableColumnKey,
} from "../../../../../components/view-details/view-data-table";
import ViewModal from "../../../../../components/view-details/view-modal";
import ViewPdf from "../../../../../components/view-details/view-pdf";
import { EmployeeStatus } from "../../../../../enums/applicants/employee-status.enum";
import { CompanyDocumentType } from "../../../../../enums/compliance/company-document-type.enum";
import { useAuth } from "../../../../../hooks/use-auth";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import { StoredFileDto } from "../../../../../models/compiance/stored-file.dto";
import { DocumentEntity } from "../../../../../models/documents/document.entity";
import { EmployeeEntity } from "../../../../../models/employee/employee.entity";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { handleViewDocument } from "../../../../../utils/documents/button-actions";
import { useEffectAsync } from "../../../../../utils/react";
import ApplicantApi from "../../../../api/applicant";
import ComplianceApi from "../../../../api/compliance";
import EmployeeApi from "../../../../api/employee";

export default function StoredFiles() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const complianceApi = new ComplianceApi();
  const applicantApi = new ApplicantApi();
  const employeeApi = new EmployeeApi();
  const [deleteBtnDisableStatus, setDeleteBtnDisableStatus] =
    useState<boolean>(false);

  // showFileUploadModel
  const [showFileUploadModel, setShowFileUploadModel] =
    useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<any>({
    value: false,
    fileId: null,
  });
  const [documentId, setDocumentId] = useState<number>(null);

  const openFileUploadModel = (): void => setShowFileUploadModel(true);
  const closeFileUploadModel = (): void => setShowFileUploadModel(false);

  const resetDocumentId = (): void => setDocumentId(null);
  // const confirmationModalToggle = (id) => setConfirmationModal({value : !confirmationModal.value, fileId : id ? id : null});

  console.log("confirmationModal values : => ", confirmationModal);

  const columnSettingKey = getDataTableColumnKey(
    "company",
    user,
    "stored-files"
  );

  const [files, setFiles] = useState<DocumentEntity[]>([]);
  const [applicants, setApplicants] = useState<ApplicantEntity[]>([]);
  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [isFetchingFiles, setIsFetchingFiles] = useState<boolean>(false);
  const [isFetchingApplicants, setIsFetchingApplicants] =
    useState<boolean>(false);
  const [isFetchingEmployees, setIsFetchingEmployees] =
    useState<boolean>(false);

  const [pdf, setPdf] = useState({});

  useEffectAsync(
    async () => {
      setIsFetchingFiles(true);
      const v = await complianceApi.filesList();
      setFiles(v);
      setIsFetchingFiles(false);

      setIsFetchingApplicants(true);
      const a = await applicantApi.list({ is_paginated: false });
      setApplicants((a as ApplicantEntity[])?.filter(({ email }) => !!email));
      setIsFetchingApplicants(false);

      setIsFetchingEmployees(true);
      const e = (await employeeApi.list()) as EmployeeEntity[];
      setEmployees(
        e?.filter(
          ({ email, status }) => !!email && status == EmployeeStatus.ACTIVE
        )
      );
      setIsFetchingEmployees(false);
    },
    [user],
    () => {
      console.log("unloading page...");
    }
  );

  const handleDeleteFile = async (fileId) => {
    await complianceApi.removeFile(fileId);
    setFiles(files?.filter((itm) => itm.id !== fileId));
    setConfirmationModal({ value: !confirmationModal.value, fileId: null });
    toast.success(t("FILE_DELETED_SUCCESS_MESSAGE"));
    setDeleteBtnDisableStatus(false);
  };
  const form = useFormik({
    initialValues: new StoredFileDto(),
    validationSchema: StoredFileDto.yupSchema(),
    validateOnBlur: false,
    validateOnMount: false,
    isInitialValid: true,
    onSubmit: async (data, { resetForm }) => {
      try {
        await complianceApi.createFile(data).then((entity: DocumentEntity) => {
          if (entity) {
            files.push(entity);
            files.sort((a, b) => a.id - b.id);
            resetForm();
            closeFileUploadModel();
            toast.success(t("FILE_UPLOAD_SUCCESS_MESSAGE"));
          }
        });
      } catch (error) {
        globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
      }
    },
  });

  const sendEmail = async (
    entities: ApplicantEntity[] | EmployeeEntity[]
  ): Promise<void> => {
    try {
      if (documentId)
        await complianceApi
          .sendComplianceFile({ documentId, entities })
          .then((res) => {
            toast.success(t("DOCUMENT_SENT_SUCCESS_MESSAGE"));
            resetDocumentId();
          });
    } catch (error) {
      toast.error(t("DOCUMENT_SENT_FAILED_MESSAGE"));
    }
  };

  function ApplicantListing() {
    const [selectedRows, setSelectedRows] = useState<ApplicantEntity[]>();
    const handleSelectedRowsChange = (arg: any) => {
      setSelectedRows(
        arg?.selectedRows?.map(({ email, first_name, last_name }) => ({
          email,
          first_name,
          last_name,
        }))
      );
    };

    if (isFetchingApplicants) return <LoaderIcon isLoading />;

    return (
      <>
        <ViewDataTable<ApplicantEntity>
          subHeader={
            <div className="float-left pr-2">
              {Boolean(selectedRows?.length) && (
                <Button
                  className=" w-100"
                  onClick={() => sendEmail(selectedRows)}
                >
                  {t(
                    "selected_row_{count}",
                    { count: selectedRows?.length },
                    { translateProps: true }
                  )}
                </Button>
              )}
            </div>
          }
          enableSelectableRows={true}
          selectableRowChangeHandler={handleSelectedRowsChange}
          columnSettingKey={columnSettingKey}
          columns={[
            {
              id: "id",
              name: "ID",
              selector: (applicant) => applicant.id,
              hidable: false,
            },
            {
              name: "first_name",
              selector: (applicant) => applicant.first_name,
              hidable: false,
            },
            {
              name: "last_name",
              selector: (applicant) => applicant.last_name,
              hidable: false,
            },
            {
              name: "email",
              selector: (applicant) => applicant.email,
              hidable: false,
            },
            {
              cell: (applicant) =>
                !Boolean(selectedRows?.length) && (
                  <>
                    <Button
                      type="button"
                      onClick={() =>
                        sendEmail([
                          {
                            email: applicant.email,
                            first_name: applicant.first_name,
                            last_name: applicant.last_name,
                          },
                        ])
                      }
                      className="theme-secondary-btn mr-2 px-4 py-1"
                    >
                      <Send />
                    </Button>
                  </>
                ),
            },
          ]}
          items={applicants}
        />
      </>
    );
  }

  function EmployeeListing() {
    const [selectedRows, setSelectedRows] = useState<EmployeeEntity[]>();
    const handleSelectedRowsChange = (arg: any) => {
      setSelectedRows(
        arg?.selectedRows?.map(({ email, first_name, last_name }) => ({
          email,
          first_name,
          last_name,
        }))
      );
    };

    if (isFetchingEmployees) return <LoaderIcon isLoading />;

    return (
      <>
        <ViewDataTable<EmployeeEntity>
          subHeader={
            <div className="float-left pr-2">
              {Boolean(selectedRows?.length) && (
                <Button
                  className=" w-100"
                  onClick={() => sendEmail(selectedRows)}
                >
                  {t(
                    "selected_row_{count}",
                    { count: selectedRows?.length },
                    { translateProps: true }
                  )}
                </Button>
              )}
            </div>
          }
          enableSelectableRows={true}
          selectableRowChangeHandler={handleSelectedRowsChange}
          columnSettingKey={columnSettingKey}
          columns={[
            {
              id: "id",
              name: "ID",
              selector: (employee) => employee.id,
              hidable: false,
            },
            {
              name: "first_name",
              selector: (employee) => employee.first_name,
              hidable: false,
            },
            {
              name: "last_name",
              selector: (employee) => employee.last_name,
              hidable: false,
            },
            {
              name: "email",
              selector: (employee) => employee.email,
              hidable: false,
            },
            {
              cell: (employee) =>
                !Boolean(selectedRows?.length) && (
                  <>
                    <Button
                      type="button"
                      onClick={() =>
                        sendEmail([
                          {
                            email: employee.email,
                            first_name: employee.first_name,
                            last_name: employee.last_name,
                          },
                        ])
                      }
                      className="theme-secondary-btn mr-2 px-4 py-1"
                    >
                      <Send />
                    </Button>
                  </>
                ),
            },
          ]}
          items={employees}
        />
      </>
    );
  }

  return (
    <PageLayout
      title="STORED_FILES"
      desciption="STORED_FILES_DESC"
      actions={
        <Button variant="primary" onClick={openFileUploadModel}>
          <Plus /> {t("UPLOAD_NEW_FILE")}
        </Button>
      }
    >
      {isFetchingFiles ? (
        <LoaderIcon isLoading />
      ) : (
        <ViewDataTable<DocumentEntity>
          columnSettingKey={columnSettingKey}
          columns={[
            {
              id: "id",
              name: "ID",
              maxWidth: "20%",
              minWidth: "20%",
              selector: (file) => file.id,
              hidable: false,
            },
            {
              id: "file_name",
              name: "file_name",
              maxWidth: "25%",
              minWidth: "25%",
              cell: (file) => <OverlyPopover str={file.name} slice_at={50} />,
              hidable: false,
            },
            {
              id: "type",
              name: "type",
              maxWidth: "20%",
              minWidth: "20%",
              cell: (file, rowIndex, column) => (
                <ShowEnumFromString
                  popover
                  labelPrefix="CompanyDocumentType"
                  value={file.type}
                  enumArray={CompanyDocumentType}
                />
              ),
              selector: (file) => file.type,
            },
            {
              id: "upload_date",
              name: "upload_date",
              maxWidth: "20%",
              minWidth: "20%",
              selector: (file) => file.created_at,
              cell: (file) => <ShowFormattedDate date={file.created_at} />,
            },
            {
              maxWidth: "15%",
              minWidth: "15%",
              style: {
                "justify-content": "flex-end",
                "padding-right": "0px",
              },
              cell: (file) => (
                <>
                  <button
                    type="button"
                    className="theme-primary-btn mr-2 px-4 py-2"
                    onClick={() => setDocumentId(file.id)}
                  >
                    <Send />
                  </button>
                  {file?.name?.includes(".doc") ? (
                    <Link href={file.path} legacyBehavior>
                      <button className="btn-success mr-0 px-4 py-2">
                        <CloudArrowDown />
                      </button>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="theme-secondary-btn mr-0 px-4 py-2"
                      onClick={() =>
                        handleViewDocument(
                          file.id,
                          setPdf,
                          `${t("CompanyDocumentType." + file?.type)} (${
                            file.name
                          })`
                        )
                      }
                    >
                      <Eye />
                    </button>
                  )}
                  <div className="p-2 ">
                    <button
                      className="btn btn-danger py-1 px-3 "
                      type="button"
                      onClick={() =>
                        setConfirmationModal({
                          value: !confirmationModal.value,
                          fileId: file.id,
                        })
                      }
                    >
                      <Trash />
                    </button>
                  </div>
                </>
              ),
            },
          ]}
          items={files}
        />
      )}
      <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />

      {/* Model for Upload file */}

      <ViewModal
        show={showFileUploadModel}
        onCloseClick={closeFileUploadModel}
        closeText="CANCEL"
        title="UPLOAD_NEW_FILE"
      >
        <EntityForm
          formik={form}
          className="mx-3"
          submitLabel="UPLOAD"
          actionButtonDown
        >
          <Row>
            <BaseSelect
              className="col-12 my-3"
              label="FILE_TYPE"
              name="type"
              required
              displayPlaceholder
              labelPrefix="CompanyDocumentType"
              enumType={CompanyDocumentType}
              formik={form}
            />
            <FileInput
              className="col-12 my-3"
              label={`UPLOAD_FILE`}
              name={`file`}
              required
              allowedTypesFriendlyName="PDF, DOC, DOCX"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              documentType={"PDF"}
              allowedSizeInByte={5242880}
              formik={form}
            />
          </Row>
        </EntityForm>
      </ViewModal>
      {/* Modal for deleting document */}
      <ViewModal
        title="CONFIRMATION"
        show={confirmationModal.value}
        onCloseClick={() =>
          setConfirmationModal({
            value: !confirmationModal?.value,
            fileId: null,
          })
        }
        size="lg"
        centered={true}
        className="confirmation-modal"
      >
        <div className="d-flex flex-column align-items-center justify-content-center w-100">
          <h4 className="mb-4 text-center">{t("ARE_YOU_SURE_YOU_WANT_TO_DELETE_FILE")}</h4>
          <div className="d-flex gap-3 justify-content-center">
            <button
              type="button"
              onClick={() => {
                handleDeleteFile(confirmationModal?.fileId),
                  setDeleteBtnDisableStatus(true);
              }}
              disabled={deleteBtnDisableStatus}
              className="btn btn-danger px-4 py-2"
              style={{ minWidth: '100px' }}
            >
              {t("yes")}
            </button>
            <button
              type="button"
              onClick={() =>
                setConfirmationModal({
                  value: !confirmationModal?.value,
                  fileId: null,
                })
              }
              className="theme-primary-btn btn-block btn-theme px-4 py-2"
              style={{ minWidth: '100px' }}
            >
              {t("no")}
            </button>
          </div>
        </div>
      </ViewModal>

      {/* Model for send email */}
      <ViewModal
        show={!!documentId}
        onCloseClick={resetDocumentId}
        closeText="CANCEL"
        title="DISPATCH_FILES_TO"
      >
        <TabbedLayout
          items={{
            APPLICANTS: <ApplicantListing />,
            EMPLOYEES: <EmployeeListing />,
          }}
          className="mt-0"
        ></TabbedLayout>
      </ViewModal>
    </PageLayout>
  );
}

StoredFiles.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
