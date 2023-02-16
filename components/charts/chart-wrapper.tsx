import React from "react";
import { Col,ColProps } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
interface IChartWrapper extends ColProps {
  children: JSX.Element;
  title: string;
  subTitle?: string;
  titleClassName?:string
}
export const ChartWrapper: React.FC<IChartWrapper> = ({
  children,
  title,
  subTitle,
  md ="4",
  sm,
  lg,
  className ="justify-content-center text-center",
  titleClassName =""
}: IChartWrapper) => {
  const { t } = useTranslation();
  return (
    <Col md={md} sm={sm} lg={lg} className={`p-0 justify-content-center mb-5 ${className}`}>
      <Col className={`p-0 m-0 h-10 ${titleClassName}`}>
        <h3 className="font-weight-bold">{t(title)}</h3>
        {subTitle && <p>{t(subTitle)}</p>}
      </Col>
      <Col className="p-0  justify-content-center">{children}</Col>
    </Col>
  );
};
