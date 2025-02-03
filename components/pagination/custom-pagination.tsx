import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, IconButton, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';
import { useTranslation } from '../../hooks/use-translation';
import { PagingMeta } from '../../types/pagination.type';
import OverlyPopover from '../popover/overly-popover';

interface CustomPaginationProps {
    recordsPerPageOptions: number[];
    onPageChange: (page: number, perPage: number) => void;
    pagingMeta: PagingMeta;
    setPagingMeta?: React.Dispatch<React.SetStateAction<PagingMeta>>;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ recordsPerPageOptions, onPageChange, pagingMeta, setPagingMeta }) => {
    const totalPages = Math.ceil(pagingMeta?.totalItems / pagingMeta?.itemsPerPage);

    const { t } = useTranslation();

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPagingMeta((prevPagingMeta: PagingMeta) => ({
            ...prevPagingMeta,
            currentPage: value,
        }));
        onPageChange(value, pagingMeta?.itemsPerPage);
    };

    const handleNextFivePages = () => {
        const newPage = Math.min(pagingMeta?.currentPage + 5, totalPages);
        setPagingMeta((prevPagingMeta: PagingMeta) => ({
            ...prevPagingMeta,
            currentPage: newPage,
        }));
        onPageChange(newPage, pagingMeta?.itemsPerPage);
    };

    const handlePrevFivePages = () => {
        const newPage = Math.max(pagingMeta?.currentPage - 5, 1);
        setPagingMeta((prevPagingMeta: PagingMeta) => ({
            ...prevPagingMeta,
            currentPage: newPage,
        }));
        onPageChange(newPage, pagingMeta?.itemsPerPage);
    };

    const handleRecordsPerPageChange = (event: SelectChangeEvent<number>) => {
        const newPerPage = event.target.value as number;
        setPagingMeta((prevPagingMeta: PagingMeta) => ({
            ...prevPagingMeta,
            currentPage: 1,
            itemsPerPage: newPerPage,
        }));
    };

    return (
        <Box display="flex" alignItems="center" style={{ display: 'flex', justifyContent: 'right' }}>
            <Typography style={{ fontSize: "0.875rem" }}>{`${(pagingMeta?.currentPage - 1) * (pagingMeta?.itemsPerPage) + (pagingMeta?.totalItems === 0 || pagingMeta?.totalItems == undefined ? 0 : 1)}-${Math.min(pagingMeta?.currentPage * pagingMeta?.itemsPerPage, pagingMeta?.totalItems) || 0} of ${pagingMeta?.totalItems || 0} ${t('RECORDS')}`}</Typography>
            <OverlyPopover str={t("{type}_PAGES_{pageNumber}", { type: "Previous", pageNumber: 5 })}>
                <IconButton onClick={handlePrevFivePages} disabled={pagingMeta?.currentPage <= 5}>
                    <ArrowBack />
                </IconButton>
            </OverlyPopover>

            <Pagination
                count={totalPages}
                page={pagingMeta?.currentPage}
                onChange={handlePageChange}
                siblingCount={1}
                boundaryCount={1}
                sx={{
                    "& .Mui-selected": { backgroundColor: "#1b4454 !important", color: "white" },
                    "& .MuiPagination-ul": { backgroundColor: "#FAFBFF !important" },
                }}
            />
            <OverlyPopover str={t("{type}_PAGES_{pageNumber}", { type: "Next", pageNumber: 5 })}>
                <IconButton onClick={handleNextFivePages} disabled={pagingMeta?.currentPage > totalPages - 5}>
                    <ArrowForward />
                </IconButton>
            </OverlyPopover>
            <Select
                value={pagingMeta?.itemsPerPage}
                onChange={handleRecordsPerPageChange}
                style={{ fontSize: "0.875rem" }}
            >
                {recordsPerPageOptions?.map((option) => (
                    <MenuItem key={option} value={option} style={{ fontSize: "0.875rem" }}>
                        {option} / {t('PAGE')}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default CustomPagination;
