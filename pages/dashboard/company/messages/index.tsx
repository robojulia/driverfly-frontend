
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import React from "react";

import PageLayout from "../../../../components/layouts/page/page-layout";

import ApplicantApi from "../../../api/applicant";

import { ChattableType } from "../../../../enums/conversation/chattable-type.enum";
import { CancelTokenSource } from "axios";
import { Messenger } from "../../../../components/messenger/messenger";

export default function MessageList() {

    const getOptions = async (query: string, cancellationToken: CancelTokenSource) => {
        const api = new ApplicantApi();

        const applicants = await api.search({
            last_name: query,
            first_name: query,
            // email: query,
            phone: query
        }, {
            cancelToken: cancellationToken.token
        });

        return applicants.map(v => ({
            text: `${v.first_name} ${v.last_name}`,
            value: {
                chattable_type: v.user ? ChattableType.USER : ChattableType.APPLICANT,
                chattable_id: v.user?.id || v.id,
                chattable_name: v.user?.name || `${v.first_name} ${v.last_name}`
            }
        }));
    };

    return (
        <PageLayout
            title="MESSAGES"
        >
            <Messenger
                getOptions={getOptions}
            />
        </PageLayout>
    )

};

MessageList.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
