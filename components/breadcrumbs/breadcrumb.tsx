import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CaretRightFill } from "react-bootstrap-icons";
import { useTranslation } from '../../hooks/use-translation';

const convertBreadcrumb = (str: string) => {
  return str
    .replaceAll("-", "_")
    .toUpperCase();
};

const Breadcrumb = () => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (router) {
      const linkPath = router.pathname.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return { breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/') };
      });

      setBreadcrumbs(pathArray);
    }

  }, [router]);

  if (!breadcrumbs) {
    return null;
  }
 

  return (
    <nav aria-label="breadcrumbs">

      <ol className='breadcrumb_sec'>
        <li>
          <Link href="/">
            <a>{t("HOME")}</a>
          </Link>
        </li>
       
        {breadcrumbs.map((breadcrumb, i) => {
          var str = convertBreadcrumb(breadcrumb.breadcrumb);
          return (
            <li key={breadcrumb.href}>
              < CaretRightFill className='mx-2 align-text-bottom' />
              {
                i == breadcrumbs.length - 1
                ?
                    t(str)
                :
                <Link href={breadcrumb.href}>
                  <a className='current_page'>
                    {t(str)}
                  </a>
                </Link>
              }
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;