import { useContext } from "react";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import JobContext from "../../context/job-context";
import { useTranslation } from "../../hooks/use-translation";
import AreasCovered from "../filters/areas-covered";
import Category from "../filters/category";
import PostedDate from "../filters/date-posted";
import EmploymentType from "../filters/employment-type";
import Equipment from "../filters/equipment";
import Range from "../filters/location/range";
import MinimumYearsExperience from "../filters/minimum-years-experience";
import MvrRequirement from "../filters/mvr-requirements";
import PayStructure from "../filters/pay-structure";
import Schedule from "../filters/schedule";
import Search from "../filters/search";
import SearchByCompany from "../filters/search-by-company";
import SpecialEndorsementsRequired from "../filters/special-endorsements-required";
import TypeOfDelivery from "../filters/type-of-delivery";
import TransmissionType from "../filters/vehicle-transmission-type";

export default function FilterResults() {
	const { t } = useTranslation();
	const { state, method } = useContext(JobContext);

	const { handleReset } = method;

	return (
		<>
			<div className="filter_container">
				<div className="d-flex">
					<h5 className="font-weight-normal mt-2">{t("FILTER_RESULT")}</h5>
					<button
						type="button"
						onClick={handleReset}
						className="theme-secondary-btn ml-4"
					>
						{t("reset_all")}
					</button>
				</div>
				<form>
					<Search state={state} method={method} />
					{/* < SearchByCompany state={state} method={method} /> */}
					<div className="bs-example">
						<div className="tab-content">
							<div className="accordion bg-transparent" id="accordionExample">
								<Category open={true} state={state} method={method} />
								<PostedDate open={true} state={state} method={method} />
								<Range open={true} state={state} method={method} />
								<AreasCovered open={true} state={state} method={method} />
								<PayStructure state={state} method={method} />
								<TypeOfDelivery state={state} method={method} />
								<EmploymentType state={state} method={method} />
								<Equipment state={state} method={method} />
								<TransmissionType state={state} method={method} />
								<Schedule state={state} method={method} />
								<SpecialEndorsementsRequired state={state} method={method} />
								<MvrRequirement state={state} method={method} />
								<MinimumYearsExperience state={state} method={method} />
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
