import { useState } from 'react';
import { BookmarkCheckFill, BookmarkPlus } from "react-bootstrap-icons";
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/use-auth';
import { useTranslation } from '../../../hooks/use-translation';
import SavedJobApi from '../../../pages/api/saved-job';
import { JobDetailProps } from '../../../types/job/job-detail-props.type';
import { useEffectAsync } from '../../../utils/react';

export interface SaveJobProps extends JobDetailProps {

    wrapperClassName?: string;
    spanClassName?: string;
}

export default function SaveJob({ job, wrapperClassName, spanClassName }: SaveJobProps) {

    const { getUser } = useAuth();
    const { t } = useTranslation();
    const user = getUser();
    
    const [isSaved, setIsSaved] = useState<boolean>(false)
    const setSaved = () => setIsSaved(true)
    const setUnsaved = () => setIsSaved(false)

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const startLoading = () => setIsLoading(true)
    const stopLoading = () => setIsLoading(false)

    const savedJobApi = new SavedJobApi();

    useEffectAsync(async (): Promise<void> => {
        if (!user) return;
        
        await savedJobApi.getByJobId(job.id)
            .then(data => !!data)
            .catch(error => (!!!(error?.response?.status == 404)))
            .then(saved => saved ? setSaved() : setUnsaved())
            .then(() => stopLoading())
    }, [user, job.id])

    if (!user) {
        return <></>
    }

    const showMessage = (status: boolean, action: string): boolean => {
        toast(t(
            !!status ? 'Forms.SUCCESS_{action}_{name}' : 'Forms.FAIL_{action}_{name}',
            { action, name: 'JOB' },
            { translateProps: true }
        ))
        return status
    }

    const markSaved = async (): Promise<void> => {
        await savedJobApi.saveJob(job.id)
            .then(data => !!data)
            .catch((error) => (!!!(error?.response?.status == 404)))
            .then(saved => showMessage(saved, 'SAVED'))
            .then(saved => saved ? setSaved() : setUnsaved())
    }

    const markUnsaved = async (): Promise<void> => {
        await savedJobApi.remove(job.id)
            .then(data => true)
            .catch((error) => ((error?.response?.status == 404) && false))
            .then(unsaved => showMessage(unsaved, 'UNSAVED'))
            .then(unsaved => unsaved ? setUnsaved() : setSaved())
    }

    const handleClick = async (): Promise<void> => {
        startLoading();
        (!!isSaved) ? await markUnsaved() : await markSaved();
        stopLoading();
    }

    const Loader = ({ children }) => (!!isLoading ? <span className="spinner-grow spinner-grow-sm"></span> : children)

    return (
        <div className={wrapperClassName || "ort-btn mt-3 "}>
            <button
                disabled={!!isLoading}
                onClick={handleClick}
                className={spanClassName || "btn theme-primary2-btn"}>

                &nbsp;
                {
                    isSaved ?
                        <><Loader ><BookmarkCheckFill /></Loader> {t('SAVED')}</>
                        : <><Loader ><BookmarkPlus /></Loader> {t('SAVE_JOB')}</>
                }
            </button>
        </div>
    )
}