import React from 'react'
import Form from 'react-bootstrap/Form'
import styles from "../../../../styles/Jotform.module.css"
import{Button,Col,Row} from "react-bootstrap"
import BaseInput from '../../BaseInput'
import BaseSelect from '../../BaseSelect'
import { useFormik } from 'formik'
import { useTranslation } from '../../../../hooks/useTranslation'
import FileInput from '../../FileInput'

// export interface PhotoUploadprops{
//     onNextClick: (any) => void;
//     onBackClick: () => void;
// }

// export function PhotoUpload(props: PhotoUploadprops){
//     const { t } = useTranslation();
//     const form = useFormik({
//         initialValues:{
//             photo: null
//         },
//         onSubmit:(values) =>{
//             props.onNextClick(values);
//         },
//         onReset: (values) =>{
//             props.onBackClick();
//         }
//     })

//     return(
//         <>
//             <Form
//                 onSubmit={ form.handleSubmit }
//                 onReset={ form.handleReset }>
//                 <Row>
//                     <h3 className='mb-4'>Drivers License Photo</h3>
//                 </Row>
//                 <Row>
//                     <p className={styles.paragraph__left}>Click on the "Choose File" button to upload your Driving License Photo:</p>
//                     <input type="file" id="actual-btn"/>
//                 </Row>

//                 <Row className="mt-4">
//                     <Col>
//                         <Button className="float-right"
//                         type="reset">
//                             {t("BACK")}
//                         </Button>
//                     </Col>

//                     <Col>
//                         <Button className='float-left'
//                         type="submit">
//                             {t("NEXT")}
//                         </Button>
//                     </Col>
//                 </Row>
//             </Form>
//         </>
//     )
// }
export interface PhotoUploadprops{
    onNextClick: (any) => void;
    onBackClick: () => void;
}

export function PhotoUpload(props: PhotoUploadprops){
    const { t } = useTranslation();
    const form = useFormik({
        initialValues:{
            photo: null
        },
        onSubmit:(values) =>{
            props.onNextClick(values);
        },
        onReset: (values) =>{
            props.onBackClick();
        }
    })

    return(
        <>
            <Form
                onSubmit={ form.handleSubmit }
                onReset={ form.handleReset }>
                <Row>
                    <h3>Drivers License Photo</h3>
                </Row>
                <Row className={ styles.align__text_left }>
                    <FileInput
                        className='col-5'
                        label={`photo`}
                        name={ `photo` }
                        accept="image/*"
                        documentType={ "PHOTO" }
                        formik={ form }
                    />
                </Row>

                <Row className="mt-4">
                    <Col>
                        <Button className="float-right"
                        type="reset">
                            {t("BACK")}
                        </Button>
                    </Col>

                    <Col>
                        <Button className='float-left'
                        type="submit">
                            {t("NEXT")}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}