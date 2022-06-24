
const jobBenefits = [
    {
        key: "SIGN_ON_BONUS",
        label: "Sign-on bonus"
    },
    {
        key: "GUARANTEED_BASE_SALARY",
        label: "Guaranteed base salary"
    },
    {
        key: "MEDICAL",
        label: "Medical"
    },
    {
        key: "VISION",
        label: "Vision"
    },
    {
        key: "DENTAL",
        label: "Dental"
    },
    {
        key: "RETIREMENT_401K",
        label: "401k (retirement)"
    },
    {
        key: "SAFETY_BONUS",
        label: "Safety bonus"
    },
    {
        key: "EXTRA_PAY_MISC",
        label: "Extra pay for (tarping, overnight, detention, accessorials, extra stops, etc)"
    },
    {
        key: "FUEL_CARD",
        label: "Fuel cards / discount programs"
    },
    {
        key: "GUARANTEED_BASE_PAY",
        label: "Guaranteed baseline pay"
    },
    {
        key: "NEW_EQUIPMENT",
        label: "New equipment"
    },
    {
        key: "PAID_TRAINING",
        label: "Pay for training"
    },
    {
        key: "TOLL_ROAD_PASS",
        label: "Toll road passes"
    },
    {
        key: "EXCLUDE_NY_FL",
        label: "No traveling to New York or Florida"
    },
    {
        key: "NO_FORCED_DISPATCH",
        label: "No forced dispatch"
    },
    {
        key: "COMPANION_DRIVERS",
        label: "Companion drivers allowed"
    },
    {
        key: "ONBOARD_DEVICES",
        label: "Onboard devices/subscriptions (ex. Netflix, Rand McNally, etc.)"
    },
    {
        key: "PETS_ALLOWED",
        label: "Pets allowed"
    },
];

const jobGeography = [
    {
        key: "OTR",
        label: "OTR"
    },
    {
        key: "REGIONAL",
        label: "Regional"
    },
    {
        key: "LOCAL",
        label: "Local"
    },
];

const jobType = [
    {
        key: "W2",
        label: "Salaried"
    },
    {
        key: "CONTRACT",
        label: "Contractor"
    },
    {
        key: "OWNER_OPERATOR",
        label: "Owner operator"
    },
    {
        key: "PART_TIME",
        label: "Part time"
    },
    {
        key: "SEASONAL",
        label: "Seasonal"
    },
    {
        key: "ONE_TIME_GIG",
        label: "One time gig"
    },
];

const jobTeamDriver = [
    {
        key: "HAS_TEAM_DRIVER",
        label: "Has team drivers"
    },
    {
        key: "OPEN_TEAM_DRIVER",
        label: "Open to team drivers"
    },
    {
        key: "NO_TEAM_DRIVER",
        label: "Not open to team drivers"
    },
];

const jobPayMethod = [
    {
        key: "RATE_PER_MILE",
        label: "Rate per mile"
    },
    {
        key: "PERCENT_PER_MOVE",
        label: "Percent per move"
    },
    {
        key: "HOURLY",
        label: "Hourly"
    },
    {
        key: "SET_WEEKLY",
        label: "Set weekly"
    },
    {
        key: "SALARY",
        label: "Salary"
    },
    {
        key: "PERCENT_WEIGHT",
        label: "Percent per weight"
    },
];

const counts = [
    {
        value: 0,
        label: "None"
    },
    {
        value: 1,
        label: 1
    },
    {
        value: 2,
        label: 2
    },
    {
        value: 3,
        label: 3
    },
    {
        value: 4,
        label: 4
    },
    {
        value: 5,
        label: 5
    },
];

const years = [
    {
        value: 0,
        label: "Ever"
    },
    {
        value: 1,
        label: 1
    },
    {
        value: 2,
        label: 2
    },
    {
        value: 3,
        label: 3
    },
    {
        value: 4,
        label: 4
    },
    {
        value: 5,
        label: 5
    },
];

const year2Only = [
    {
        value: 2,
        label: 2
    },
];

const year3Only = [
    {
        value: 3,
        label: 3
    },
];

const year5Only = [
    {
        value: 5,
        label: 5
    },
];

export {
    counts,
    years,
    year2Only,
    year3Only,
    year5Only,
    jobBenefits,
    jobGeography,
    jobType,
    jobTeamDriver,
    jobPayMethod
}