import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import { useAuth } from '../../../../hooks/use-auth';

import { useTranslation } from "../../../../hooks/use-translation";

import { CompanyEntity } from "../../../../models/company/company.entity";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { CompanyForm } from "../../../../components/forms/company/company-form";
import BaseClickToCopyInput from "../../../../components/forms/base-click-to-copy-input";

export default function Settings() {
	const { t } = useTranslation();

	const { user, updateUser } = useAuth();

	function onSaveComplete(c: CompanyEntity) {
		updateUser({
			...user,
			company: {
				...user.company,
				name: c.name,
				website: c.website,
				about: c.about,
				photo: c.photo
			}
		})

	}

	return (
		<PageLayout
			title="COMPANY"
		>
			<BaseClickToCopyInput
				label="JOTFORM_URL"
				className="my-2"
				value={`${process.env.FRONTEND_BASE_URL ?? ""}form/digitalhiringapp/${user?.company?.id}`}
				tooltipText={t('CLICK_TO_COPY')}
			/>
			<CompanyForm
				entity={user?.company}
				onSaveComplete={onSaveComplete}
			/>
		</PageLayout>
	)
};

Settings.getLayout = function getLayout(page) {
	return (
		<FullLayout>
			{page}
		</FullLayout>
	)
}
