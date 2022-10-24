import React from "react";
import { LocationEntity } from "../../../models/company/location.entity";
import LocationApi from "../../../pages/api/location";
import { buildAddress } from "../../../utils/common";
import { BaseSelectProps } from "../base-select";
import { EntitySelect } from "../entity-select";

export interface LocationSelectProps extends BaseSelectProps {
    options?: LocationEntity[]
}

export function LocationSelect(props: LocationSelectProps) {

    async function fetchData() {
        const api = new LocationApi();

        return await api.list();
    }

    return (<EntitySelect
        {...props}
        createLabel={buildAddress}
        fetchData={fetchData}
        />
        )
}
