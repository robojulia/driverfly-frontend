import { useRouter } from "next/router";
import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { ArrowCounterclockwise, EyeFill, PenFill, TrashFill } from 'react-bootstrap-icons';
import { toast } from "react-toastify";

import FullLayout from "../../../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../../../components/layouts/page/page-layout";

import ViewDataTable, { getDataTableColumnKey } from "../../../../../../components/view-details/view-data-table";

import { useAuth } from "../../../../../../hooks/use-auth";
import { useTranslation } from "../../../../../../hooks/use-translation";
import { useEffectAsync } from "../../../../../../utils/react";

import { ReferralSourceEntity } from "../../../../../../models/referral-source/referral-source.entity";

import { TabbedLayout } from "../../../../../../components/layouts/page/tabbed-layout";
import { Status } from "../../../../../../enums/status.enum";
import { globalAjaxExceptionHandler } from "../../../../../../utils/ajax";
import { ReferralSourceApi } from "../../../../../api/referral-source";


export default function ReferralList({ host }: { host: string }) {
	const router = useRouter();

	const { t } = useTranslation();

	const { user, isSuperAdmin, isCompanyAdmin, hasPermission } = useAuth();

	const [referralSources, setReferralSources] = useState<ReferralSourceEntity[]>([
		// {
		// 	id: 1,
		// 	name: "Kom",
		// 	code: "123456",
		// 	referrals: 5,
		// 	createdAt: new Date()
		// }
	]);

	const columnSettingKey = getDataTableColumnKey("admin", user, "referral-sources");

	useEffectAsync(async () => {
		// if (!isCompanyAdmin) {
		// 	router.push("/dashboard/company/");
		// 	return;
		// }
		const api = new ReferralSourceApi();

		try {
			const list = await api.list();

			setReferralSources(list);
		}
		catch (e) {
			globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: t("UNABLE_TO_LOAD_{name}", { name: "REFERRAL_SOURCES" }, { translateProps: true }) });
		}
	}, [user, isCompanyAdmin]);

	async function onAddClick(e: React.MouseEvent) {
		e.preventDefault();

		router.push(`${router.asPath}/create`);
	}

	async function onEditClick(id: number) {
		router.push(`${router.asPath}/${id}/edit`);
	}

	async function onViewClick(id: number) {
		router.push(`${router.asPath}/${id}`);
	}

	async function onDeleteClick(id: number) {
		try {
			const api = new ReferralSourceApi();

			const entity = await api.remove(id);

			setReferralSources(referralSources.map(v => {
				if (v.id == entity.id) return entity;

				return v;
			}));
		}
		catch (e) {
			globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_DELETE" });
		}
	}

	async function onRestoreClick(id: number) {
		try {
			const api = new ReferralSourceApi();

			const entity = await api.restore(id);

			setReferralSources(referralSources.map(v => {
				if (v.id == entity.id) return entity;

				return v;
			}));
		}
		catch (e) {
			globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_RESTORE" });
		}
	}

	function renderDataTable(status: Status) {
		return (
			<ViewDataTable<ReferralSourceEntity>
				columnSettingKey={columnSettingKey}
				customStyles={{
					headCells: {
						style: {
							background: "#5bb0b9",
							color: "white"
						},
					},
				}}
				columns={[
					{
						id: "id",
						name: "ID",
						selector: v => v.id,
						hidable: false,
					},
					{
						id: "name",
						name: "Name",
						selector: v => v.name,
						hidable: false,
					},
					{
						id: "code",
						name: "Referral Code",
						selector: v => v.code,
					},
					{
						id: "url",
						name: "URL",
						wrap: false,
						width: "500",
						selector: v => ReferralSourceEntity.getReferralUrl(host, v, user?.company?.slug),
						cell: v => ReferralSourceEntity.getReferralUrl(host, v, user?.company?.slug)
					},
					{
						id: "referrals",
						name: "Referrals",
						selector: v => v.referrals,
					},
					{
						id: "referralAmount",
						name: "Amount Per Referral",
						selector: v => v.referralAmount || 0,
						cell: v => `$${(v.referralAmount || 0).toFixed(2)}`,
					},
					{
						id: "monthlyTotal",
						name: "Monthly Total",
						selector: v => (v.referrals || 0) * (v.referralAmount || 0),
						cell: v => `$${((v.referrals || 0) * (v.referralAmount || 0)).toFixed(2)}`,
					},
					{
						id: "createdAt",
						name: "Created At",
						selector: v => (typeof v.createdAt == "string" ? new Date(v.createdAt) : v.createdAt).toLocaleString(),
					},
				]}
				actions={v => ([
					{
						onClick: e => onViewClick(v.id),
						icon: EyeFill,
						label: "VIEW",
					},
					{
						onClick: e => onEditClick(v.id),
						icon: PenFill,
						label: "EDIT",
					},
					{
						onClick: e => onDeleteClick(v.id),
						icon: TrashFill,
						label: "DELETE",
						hide: status == Status.DELETED
					},
					{
						onClick: e => onRestoreClick(v.id),
						icon: ArrowCounterclockwise,
						label: "RESTORE",
						hide: status == Status.ACTIVE
					},
				])}
				items={referralSources.filter(v => v.status == status)}
			/>
		);
	}

	return <PageLayout
		title="REFERRAL_SOURCES"
		actions={(<ButtonGroup>
			<Button onClick={onAddClick}>
				+ {t("CREATE")}
			</Button>
		</ButtonGroup>)}
	>
		<TabbedLayout items={{
			[`Status.${Status.ACTIVE}`]: renderDataTable(Status.ACTIVE),
			[`Status.${Status.DELETED}`]: renderDataTable(Status.DELETED),
		}} />
	</PageLayout>;
}

ReferralList.getLayout = function getLayout(page) {
	return (
		<FullLayout>
			{page}
		</FullLayout>
	)
}

export async function getServerSideProps(context) {
	const { req, query, res, asPath, pathname } = context;
	let host = null;
	if (req) {
		host = req.headers.host // will give you localhost:3000
	}

	return { props: { host } };
}
