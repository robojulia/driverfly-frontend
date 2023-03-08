import { createContext } from "react";
import { ApplicantEntity } from "../models/applicant";

type DashboardChartContext ={
    state:{
        data:ApplicantEntity[]
    }
}

const DashboardChartContext = createContext<DashboardChartContext>({
    state:{
        data:[]
    },});

export default DashboardChartContext;