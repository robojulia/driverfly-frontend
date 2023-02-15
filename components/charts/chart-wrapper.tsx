import React from "react";
import { Col } from "react-bootstrap";
interface IChartWrapper {
  children: JSX.Element;
  title: String;
  subTitle?: String;
}
export const ChartWrapper: React.FC<IChartWrapper> = ({
  children,
  title,
  subTitle,
}: IChartWrapper) => {
  return (
    <Col md="4" className="p-0 justify-content-center">
      <Col className="justify-content-center text-center p-0 m-0 h-10">
        <h3 className="font-weight-bold">{title}</h3>
        {subTitle && <p>{subTitle}</p>}
      </Col>
      <Col className="p-0 justify-content-center">{children}</Col>
    </Col>
  );
};
