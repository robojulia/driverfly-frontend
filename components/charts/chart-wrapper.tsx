import React from "react";
import { Col,ColProps } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
interface IChartWrapper extends ColProps {
  children: JSX.Element;
  title: string;
  titleClassName?:string
}
export const ChartWrapper: React.FC<IChartWrapper> = ({
  children,
  title,
  md ="4",
  sm,
  lg,
  className ="justify-content-center text-center",
  titleClassName =""
}: IChartWrapper) => {
  const { t } = useTranslation();
  return (
    <Col md={md} sm={sm} lg={lg} className={`px-5 justify-content-around  mb-5 ${className}`} >
      <Col className={`p-0  h-4 ${titleClassName}`} style={{display:'flex', justifyContent:'left'}}>
        <h3 className="font-weight-bold">{t(title)}</h3>
      </Col>
      <Col className="p-0 m-0 justify-content-start">{children}</Col>
    </Col>
  );
};
