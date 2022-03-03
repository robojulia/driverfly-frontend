import React from 'react';
import Breadcrumbs from 'nextjs-breadcrumbs';
export default function Breadcrumb() {
    return (
        <>

            <ul className="d-flex">
                <li><Breadcrumbs useDefaultStyle rootLabel="Home" /> </li>
            </ul>

        </>
    )
}