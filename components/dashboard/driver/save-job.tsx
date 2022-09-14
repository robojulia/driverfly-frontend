import React, { useState } from 'react'
import { BookmarkCheckFill, BookmarkPlus } from "react-bootstrap-icons"
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from '../../../hooks/useTranslation';
import SavedJobApi from '../../../pages/api/saved-job';
import { toast } from 'react-toastify';
import { JobEntity } from '../../../models/job/job.entity';
import { useEffectAsync } from '../../../utils/react';

export interface SaveJobProps {
    job?: JobEntity;
    wrapperClassName?: string;
    spanClassName?: string;
}

export default function SaveJob({ job, wrapperClassName, spanClassName }: SaveJobProps) {

    const { getUser } = useAuth();
    const user = getUser()
    if (!user) {
        return <></>
    }

    const { t } = useTranslation();
    const savedJobApi = new SavedJobApi();

    const [isSaved, setIsSaved] = useState(false)
    const setSaved = () => { setIsSaved(true) }
    const setUnsaved = () => { setIsSaved(false) }
    const [isLoading, setIsLoading] = useState(true)

    useEffectAsync(async () => {
        await savedJobApi.getByJobId(job.id)
            .then(data => true)
            .catch((error) => (error?.response?.status === 404) && false)
            .then(saved => saved ? setSaved() : setUnsaved())
            .then(() => setIsLoading(false))
    }, [])

    const showMessage = (status, action) => {
        if (!!status) {
            toast(t('Forms.SUCCESS_{action}_{name}', { action, name: 'JOB' }, { translateProps: true }))
        } else {
            toast(t('Forms.FAIL_{action}_{name}', { action, name: 'JOB' }, { translateProps: true }))
        }
        return status
    }

    const markSaved = async () => {
        await savedJobApi.saveJob(job.id)
            .then(data => true)
            .catch((error) => ((error?.response?.status === 404) ? false : true))
            .then(saved => showMessage(saved, 'SAVED'))
            .then(saved => saved ? setSaved() : setUnsaved())
    }

    const markUnsaved = async () => {
        await savedJobApi.remove(job.id)
            .then(data => true)
            .catch((error) => ((error?.response?.status === 404) && false))
            .then(unsaved => showMessage(unsaved, 'UNSAVED'))
            .then(unsaved => unsaved ? setUnsaved() : setSaved())
    }

    const handleClick = async () => {
        setIsLoading(true);
        (!!isSaved) ? await markUnsaved() : await markSaved();
        setIsLoading(false);
    }

    return (
        <div className={wrapperClassName || "ort-btn mt-3 "}>
            <button
                disabled={isLoading}
                onClick={handleClick}
                className={spanClassName || "btn theme-primary2-btn"}>
                {
                    isSaved ?
                        <><BookmarkCheckFill /> {t('SAVED')}</>
                        : <><BookmarkPlus /> {t('SAVE_JOB')}</>
                }
            </button>
        </div>
    )
}