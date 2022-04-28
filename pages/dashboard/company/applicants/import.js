import ChildPageLayout from "../../../../components/layouts/ChildPageLayout";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Container, Col, ProgressBar, Row, Table } from "react-bootstrap";
import { parseCSV } from "../../../../utils/file";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";

import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { useTranslation } from '../../../../hooks/useTranslation'


export default function Import() {

    const { t } = useTranslation();

    const schema = ApplicantEntity.yupSchema();

    /**
     * @type {ApplicantEntity[]}
     */
    const initialValues = [];
    const form = useFormik({
        initialValues: initialValues,
        validationSchema: yup.array(
            schema
        )
    });

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    const onFileChange = async (e) => {
        const { target: { files: [ file ] } } = e;

        if (file) {
            let contents = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => resolve(reader.result);
                // reader.onprogress = (ev) => ev.
                reader.onerror = error => reject(error);
            });
            contents = parseCSV(contents);
            if (contents.length <= 1) {
                toast.error("FILE_HAS_NO_RECORDS");
                return;
            }

            headers = contents[0];

            contents = contents.map(row => {
                const entity = new ApplicantEntity();

                row.forEach((col, i) => {
                    const header = headers[i];

                    if (entity.hasOwnProperty(header))
                    {
                        entity[header] = col;
                    }
                });

                return entity;
            });

            form.setValues(contents);
        }
    }

    const headers = Object.keys(schema.describe().fields);//Object.keys(new ApplicantEntity());


    return (<>
        <ChildPageLayout title="IMPORT_APPLICANTS">
            <Row>
                <Col>
                    <label htmlFor="formFile" className="form-label">Default file input example</label>
                    <input onChange={onFileChange} className="form-control" type="file" accept=".csv" id="formFile" />
                    <ProgressBar variant="primary" min="0" max="100" now="60" label="25%" striped animated  />
                </Col>
                <Col>
                    <button type="button" className="btn-sm btn-primary">{t("IMPORT")}</button>
                    <button type="button" className="btn-sm btn-danger">{t("CLEAR")}</button>
                    <input type="checkbox" role="switch" className="form-switch"></input>
                </Col>
            </Row>
            <Row>
                <Col className="force-overflow p-0">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                {headers.map(k => (<th>{k}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {form
                                .values
                                .map((v, i) => (
                            <tr>
                                <td>{i + 1}</td>
                                {headers.map(h => (<td>{v[h]}</td>))}
                            </tr>))}

                        </tbody>
                    </Table>
                </Col>
            </Row>
        </ChildPageLayout>
    </>);
}


Import.getLayout = function getLayout(page) {
    return (
      <FullLayout>
        {page}
      </FullLayout>
    )
  }
  