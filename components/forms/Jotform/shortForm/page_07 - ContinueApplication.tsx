import React from 'react'
import styles from "../../../../styles/Jotform.module.css"
import { useTranslation } from '../../../../hooks/useTranslation';
import { useFormik } from 'formik';
import{Button,Col,Row} from "react-bootstrap"

export interface SeventhPageProps{
  onNextClick: (any) => void;
}

export function SeventhPage(props: SeventhPageProps){
  const {t} = useTranslation();
  const form = useFormik({
    initialValues:{
      options: null
    },
    onSubmit: (values) =>{
      props.onNextClick(values);
    }
  })
  return(
    <>
      <form
        onSubmit={form.handleSubmit}>
        <Row>
        <h4 className={styles.carrierName__smaller}>Thanks for your submission to Nautilus Trucking.</h4>
        </Row>
        <Row>
          <h6 className={`${styles.paragraph} ${styles.margin__top}`}>
          Please note that Nautilus Trucking requires that you have your Class A CDL to be employed here.
          </h6>
        </Row>
        <Row className="mt-3">  
          <Col>
            <Button className="float-middle"
              type="submit">
              {t("CONTINUE APPLICATION")}    
            </Button>
          </Col>
        </Row>
      </form>
    </>
  )
}