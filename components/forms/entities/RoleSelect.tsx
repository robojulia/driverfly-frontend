import React from "react";
import { RoleEntity } from "../../../models/roles/role.enttiy";
import RoleApi from "../../../pages/api/role";
import { BaseSelectProps } from "../BaseSelect";
import { EntitySelect } from "../EntitySelect";

export interface RoleSelectProps extends BaseSelectProps {
    options?: RoleEntity[]
}

export function RoleSelect(props: RoleSelectProps) {

    async function fetchData() {
        const api = new RoleApi();

        return await api.list();
    }

    return (<EntitySelect
        {...props}
        labelKey="name"
        fetchData={fetchData}
        />
        )
}
