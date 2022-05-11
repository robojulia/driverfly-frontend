export enum mvr_requirement {
    ACCIDENT_OKAY = "Accident Okay",
    CLEAN_MVR_ONLY = "Clean MVR Only",
    MOVING_VIOLATION_OKAY = "Moving Violation Okay",
    RECKLESS_Driving_OKAY = "Reckless Driving Okay",
    SPEEDING_TICKET_OKAY = "Speeding Ticket Okay",
    NA = "N/A"
}

export enum special_endorsements_required {
    TWIC = "TWIC",
    H = "(H) Hazardous Materials(HAZMAT)",
    N = "(N) Tank Vehicle(Tanker)",
    X = "(X) Tanker / HAZMAT Combo",
    T = "(T) Double / Triples",
    P = "(P) Passenger Transport",
    S = "(S) School Bus / Passenger Transport Combo",
    NA = "N/A"
}

export enum special_accommodations {
    OPEN_TO_CANDIDATES_WITH_PAST_FELONIES = "Open to candidates with past felonies",
    OPEN_TO_CANDIDATES_WITH_PAST_MISDEMEANORS = "Open to candidates with past misdemeanors",
    OPEN_TO_CANDIDATES_WITH_PAST_DUI = "Open to candidates with past DUI's"
}

export enum pay_structure {
    RATE_PER_MILE = "Rate per mile",
    PERCENT_PER_MOVE = "Percent per move",
    HOURLY = 'Hourly',
    SET_WEEKLY = "Set Weekly",
    SALARIED = "Salaried",
    PERCENT_WEIGHT = "Percent weight"
}

export enum schedule {
    MULTIPLE_WEEKS_ON_THE_ROAD = "Multiple weeks on the road",
    MOST_WEEKENDS_OFF = "Most weekends off",
    WEEKENDS_OFF = "weekends off",
    OTHER = "Other"
}

export enum equipment_type {
    TRACTOR_TRAILER = "Tractor trailer",
    FLATBED = "Flatbed",
    AUTO_HAULING = "Auto hauling",
    BOXTRUCK = "Boxtruck",
    BUS = "Bus",
    CONCRETE_MIXER = "Concrete Mixer",
    COURIER_VAN = "Courier van",
    DOUBLES_TRAILER = "Doubles Trailer",
    DRY_VAN = "Dry van",
    DUMP_TRUCK = "Dump truck",
    HEAVY_HAUL = "Heavy haul",
    HEAVY_TOWING = "Heavy towing",
    HOTSHOT = "Hotshot",
    INTERMODAL = "Intermodal",
    LOGGING = "Logging",
    REEFER = "Reefer",
    SERVICE_TRUCKS = "Service trucks",
    TRACTOR_ONLY = "Tractor only"
}

export enum accepting_drivers_from {
    ANYWHERE_IN_THE_US = "Anywhere in the US",
    ALABAMA = "Alabama",
    ALASKA = "Alaska",
    ARIZONA = "Arizona",
    ARKANSAS = "Arkansas",
    CALIFORNIA = "California",
    COLORADO = "Colorado",
    CONNECTICUT = "Connecticut",
    DELAWARE = "Delaware",
    FLORIDA = "Florida",
    GEORGIA = "Georgia",
    HAWAII = "Hawaii",
    IDAHO = "Idaho",
    ILLINOIS = "Illinois",
    INDIANA = "Indiana",
    IOWA = "Iowa",
    KANSAS = "Kansas",
    KENTUCKY = "Kentucky",
    LOUISIANA = "Louisiana",
    MAINE = "Maine",
    MARYLAND = "Maryland",
    MASSACHUSETTS = "Massachusetts",
    MICHIGAN = "Michigan",
    MINNESOTA = "Minnesota",
    MISSISSIPPI = "Mississippi",
    MISSOURI = "Missouri",
    MONTANA = "Montana",
    NEBRASKA = "Nebraska",
    NEVADA = "Nevada",
    NEW_HAMPSHIRE = "New Hampshire",
    NEW_JERSEY = "New Jersey",
    NEW_MEXICO = "New Mexico",
    NEW_YORK = "New York",
    NORTH_CAROLINA = "North Carolina",
    NORTH_DAKOTA = "North Dakota",
    OHIO = "Ohio",
    OKLAHOMA = "Oklahoma",
    OREGON = "Oregon",
    PENNSYLVANIA = "Pennsylvania",
    RHODE_ISLAND = "Rhode Island",
    SOUTH_CAROLINA = "South Carolina",
    SOUTH_DAKOTA = "South Dakota",
    TENNESSEE = "Tennessee",
    TEXAS = "Texas",
    UTAH = "Utah",
    VERMONT = "Vermont",
    VIRGINIA = "Virginia",
    WASHINGTON = "Washington",
    WEST_VIRGINIA = "West Virginia",
    WISCONSIN = "Wisconsin",
    WYOMING = "Wyoming",
    ALBERTA = "Alberta",
    BRITISH_COLUMBIA = "British Columbia",
    MANITOBA = "Manitoba",
    NEW_BRUNSWICK = "New Brunswick,",
    NEWFOUNDLAND_AND_LABRADOR = "Newfoundland and Labrador",
    NOVA_SCOTIA = "Nova Scotia",
    ONTARIO = "Ontario",
    PRINCE_EDWARD_ISLAND = "Prince Edward Island",
    QUEBEC = "Quebec",
    SASKATCHEWAN = "Saskatchewan",
    NORTHWEST_TERRITORIES = "Northwest Territories",
    NUNAVUT = "Nunavut",
    YUKON = "Yukon"
}

export enum delivery_type {
    TOUCH = "Touch",
    NO_TOUCH = "No Touch",
    DROP_AND_HOOK = "Drop-and-hook",
    DEDICATED_LANES = "Dedicated Lanes"
}

export enum employment_type {
    REGULAR_WAGE = "w2",
    SELF_EMPOLIYED = "1099"
}

export enum job_type {
    PART_TIME = "Part-time",
    FULL_TIME = "Full-time",
    EITHER_FULL_TIME_OR_PART_TIME = "Either Full-time or Part-time"
}

export enum areas_covered {
    LOCAL = "Local",
    REGIONAL = "Regional",
    OTR = "OTR",
    CROSS_BORDER = "Cross Border"
}

export enum salary_type {
    HOURLY = "Hourly",
    DAILY = "Daily",
    WEEKLY = "Weekly",
    MONTHLY = "Monthly",
    YEARLY = "Yearly"
}

export enum apply_type {
    INTERNAL = "Internal",
    WITH_EMAIL = "By Email",
    EXTERNAL = "External URL"
}


