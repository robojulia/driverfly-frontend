import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { useAuth } from '../../../../../hooks/useAuth';
import { useRouter } from "next/router"
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "../../../../../hooks/useTranslation";

import { EyeFill, PenFill, TrashFill} from 'react-bootstrap-icons';


import VehicleApi from "../../../../api/vehicle";
import { VehicleType } from "../../../../../enums/vehicles/vehicle-type.enum";
import { VehicleTrailerType } from "../../../../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleAccessory } from "../../../../../enums/vehicles/vehicle-accessory.enum";
import { VehicleEntity } from "../../../../../models/company/vehicle.entity";
import PageLayout from "../../../../../components/layouts/PageLayout";
import { ButtonGroup, Button, Col, Row, Table } from "react-bootstrap";
import ViewDataTable from "../../../../../components/viewDetails/viewDataTable";
import { useEffectAsync } from "../../../../../utils/react";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import OverlyPopover from "../../../../../components/popover/overly-popover";
import Link from "next/link";

export default function VehicleList() {

  const router = useRouter();
  const { t } = useTranslation();

  const { user, hasPermission } = useAuth();
  console.log('user', user);

  const [ vehicles, setVehicles ] = useState<VehicleEntity[]>([]);

  useEffectAsync(async () => {
    const api = new VehicleApi();

    try {
      const v = await api.list({ withPhoto: true });

      setVehicles(v);
    } catch (e) {
      globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: t("UNABLE_TO_LOAD_{name}", { name: "VEHICLES" }, { translateProps: true }) });
    }
  }, [ user ]);

   const onAddClick = (e: React.MouseEvent) => {
    e.preventDefault();

    router.push(`${router.asPath}/create`);
  }

  const onEditClick = (id: number) => {
    router.push(`${router.asPath}/${id}/edit`);
  }

  const onViewClick = (id: number) => {
    router.push(`${router.asPath}/${id}`);
  }

  const onDeleteClick = async (id: number) => {
     try {
       const api = new VehicleApi();

        await api.remove(id);

        setVehicles(vehicles.filter(v => v.id != id));
     }
     catch (e) {
       globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_DELETE" });
     }
  }

  const canCreate = hasPermission("CanCreateVehicle");


  function getVehicleAccessories(v: VehicleEntity) {
    return v.accessories?.map((a, i) => (
        a === VehicleAccessory.OTHER && v.accessory_other ?
        v.accessory_other : t(`VehicleAccessory.${a}`)
        )
    ).join(',');
  }

  function getVehicleType(v: VehicleEntity) {
    return v.type === VehicleType.OTHER ? v.type_other : t(`VehicleType.${v.type}`);

  }

  return (
    <PageLayout
      title="VEHICLES"
      actions={(<ButtonGroup>
        {canCreate && 
          <Button onClick={onAddClick}>
            + {t("CREATE")}
          </Button>
        }
      </ButtonGroup>)}
    >
      <ViewDataTable<VehicleEntity>
        columns={[
          {
            name: "PHOTO",
            cell: (v) => v.photo && <img className="img-thumbnail" style={{maxWidth: "100px"}} src={v.photo.path} />
          },
          {
            name: "TYPE",
            selector: getVehicleType,
            cell: v => (<Link href={`${router.asPath}/${v.id}`}><a>{getVehicleType(v)}</a></Link>),
            hidable: false,
          },
          {
            name: "TRAILER",
            selector: v =>  v.trailer_type === VehicleTrailerType.OTHER ? v.trailer_type_other : (v.trailer_type && t(`VehicleTrailerType.${v.trailer_type}`) || "")
          },
          {
            name: "TRANSMISSION",
            selector: v => v.transmission_type ? t(`VehicleTransmissionType.` + v.transmission_type) : null
          },
          {
            name: "MAKE",
            selector: v => v.make,
          },
          {
            name: "MODEL",
            selector: v => v.model,
          },
          {
            name: "YEAR",
            selector: v => v.year,
          },
          {
            name: "GOVERNED_SPEED",
            selector: v => v.is_governed ? t("YES") : t("NO"),
            hide: 1,
          },
          {
            name: "MAX_SPEED",
            selector: v => v.is_governed ? v.max_speed : null,
            hide: 1,
          },
          {
            name: "ACCESSORIES",
            selector: getVehicleAccessories,
            cell: v => (<OverlyPopover
              str={getVehicleAccessories(v)}
              skipTranslate
              slice_at={5}
                />),
          }
        ]}
        actions={v => ([
          {
            onClick: e => onViewClick(v.id),
            icon: EyeFill,
            label: "VIEW",
            hide: !hasPermission("CanViewVehicle")
          },
          {
            onClick: e => onEditClick(v.id),
            icon: PenFill,
            label: "EDIT",
            hide: !hasPermission("CanEditVehicle")
          },
          {
            onClick: e => onDeleteClick(v.id),
            icon: TrashFill,
            label: "DELETE",
            hide: !hasPermission("CanDeleteVehicle")
          },
        ])}
        items={vehicles}
        />
    </PageLayout>
  )
};

VehicleList.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
