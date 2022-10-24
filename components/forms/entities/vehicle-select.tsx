import React from "react";
import { VehicleType } from "../../../enums/vehicles/vehicle-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { VehicleEntity } from "../../../models/company/vehicle.entity";
import VehicleApi from "../../../pages/api/vehicle";
import { buildAddress } from "../../../utils/common";
import { BaseSelectProps } from "../base-select";
import { EntitySelect } from "../entity-select";

export interface VehicleSelectProps extends BaseSelectProps {
    options?: VehicleEntity[]
}

export function VehicleSelect(props: VehicleSelectProps) {
    const { t } = useTranslation();

    async function fetchData() {
        const api = new VehicleApi();

        return await api.list();
    }

    return (<EntitySelect
        {...props}
        createLabel={veh => {
            const { type, type_other, make, model, transmission_type, year } = veh;
            let label = type === VehicleType.OTHER ? type_other : t("VehicleType." + type);

            if (make) label += ` / ${make}`;

            if (model) label += ` / ${model}`;

            if (transmission_type) label += ` / ${t(transmission_type)}`;

            if (year) label += ` / ${year}`;
            return label; //`${()} / ${veh.make} / ${veh.model} / ${t(veh.transmission_type)} / ${veh.year}`
        }}
        fetchData={fetchData}
        />
        )
}
