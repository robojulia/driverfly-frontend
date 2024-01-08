import React from "react";
import { Col,ColProps } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
interface IChartWrapper extends ColProps {
  children: JSX.Element;
  title: string;
  subHeading?:string;
  titleClassName?:string
}
export const ChartWrapper: React.FC<IChartWrapper> = ({
  children,
  title,
  subHeading,
  md ="4",
  sm,
  lg,
  className ="justify-content-center text-center",
  titleClassName =""
}: IChartWrapper) => {
  const { t } = useTranslation();
  return (
    <Col md={md} sm={sm} lg={lg} className={`px-3 d-flex flex-column justify-content-end  mb-5 text-Poppins  ${className}`} >
      <Col className={`  m-0 d-flex flex-column align-items-start ${titleClassName}`} >
        <h3 className="font-weight-bold">{t(title)}</h3>
        <p className="fs-6 font-weight-light text-secondary" style={{opacity:'0.7'}}>{subHeading}</p>
      </Col>
      <Col className="p-0 m-0 ">{children}</Col>
    </Col>
  );
};

export const ChartInerWrapper: React.FC<IChartWrapper> = ({
  children,
  title,
  subHeading,
  md ="4",
  sm,
  lg,
  className ="justify-content-center text-center",
  titleClassName =""
}: IChartWrapper) => {
  const { t } = useTranslation();
  return (
    <div  className={`px-3 d-flex flex-column justify-content-between  mb-5 text-Poppins  ${className}`} >
      <div className={`m-0 d-flex flex-column align-items-start ${titleClassName}`} >
        <h3 className="font-weight-bold mt-4 mb-0">{t(title)}</h3>
        <p className="fs-6 text-secondary" style={{opacity:'0.7'}}>{subHeading}</p>
      </div>
      {children}
    </div>
  );
};
