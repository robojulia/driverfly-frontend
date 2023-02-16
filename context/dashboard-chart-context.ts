import { createContext } from "react";
import { ApplicantEntity } from "../models/applicant";

type DashboardChartContext ={
    state:{
        data:ApplicantEntity[]
    },
    method:{
        setData: (e?: any) => void,
    }
}

const DashboardChartContext = createContext<DashboardChartContext>({
    state:{
        data:[]
    },
     method:{
         setData: (e?: any) => {},
    }});

export default DashboardChartContext;