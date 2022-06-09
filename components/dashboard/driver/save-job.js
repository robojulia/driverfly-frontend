import React, { useEffect, useState } from 'react'
import { BookmarkCheckFill, BookmarkPlus } from "react-bootstrap-icons"
import useAuth from '../../../hooks/useAuth';
import { useTranslation } from '../../../hooks/useTranslation';
import SavedJobApi from '../../../pages/api/saved-job';
import { toast } from 'react-toastify';

export default function SaveJob({ job, wrapperClassName, spanClassName }) {

    const { authCheck } = useAuth();
    const user = authCheck()
    if (!user) {
        return <></>
    }

    const { t } = useTranslation();
    const savedJobApi = new SavedJobApi();

    const [isSaved, setIsSaved] = useState(false)
    const setSaved = () => { setIsSaved(true) }
    const setUnsaved = () => { setIsSaved(false) }

    useEffect(async () => {
        await savedJobApi.getByJobId(job.id)
            .then((data) => (data.status === 200))
            .catch((error) => (error?.response?.status === 404) && false)
            .then(saved => saved ? setSaved() : setUnsaved())
    }, [])

    const showMessage = (status, action) => {
        if (status) {
            toast(t('Forms.SUCCESS_{action}_{name}', { action, name: 'JOB' }, { translateProps: true }))
        } else {
            toast(t('Forms.FAIL_{action}_{name}', { action, name: 'JOB' }, { translateProps: true }))
        }
        return status
    }

    const markSaved = async () => {
        await savedJobApi.saveJob(job.id)
            .then((data) => (data.status === 201))
            .catch((error) => ((error?.response?.status === 404) ? false : true))
            .then(saved => showMessage(saved, 'SAVED'))
            .then(saved => saved ? setSaved() : setUnsaved())
    }

    const markUnsaved = async () => {
        await savedJobApi.remove(job.id)
            .then((data) => (data.status === 200))
            .catch((error) => ((error?.response?.status === 404) && false))
            .then(unsaved => showMessage(unsaved, 'UNSAVED'))
            .then(unsaved => unsaved ? setUnsaved() : setSaved())
    }

    return (
        <div className={wrapperClassName || "ort-btn mt-lg-4 mt-0 "}>
            <span
                onClick={() => (isSaved) ? markUnsaved() : markSaved()}
                role="button"
                className={spanClassName || "btn btn btn-danger px-5"}>
                {
                    isSaved ?
                        <><BookmarkCheckFill /> {t('SAVED')}</>
                        : <><BookmarkPlus /> {t('SAVE_JOB')}</>
                }
            </span>
        </div>
    )
}