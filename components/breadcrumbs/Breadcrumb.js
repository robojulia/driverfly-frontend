import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CaretRightFill} from "react-bootstrap-icons";

const convertBreadcrumb = string => {
  return string
    .toLowerCase();
};

const Breadcrumb = () => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
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
        
      <ol>
        <li>
        <Link href="/">
                <a>Home</a>
        </Link>
        < CaretRightFill  className='mx-2 align-text-bottom'/>
        </li>
        {breadcrumbs.map((breadcrumb, i) => {
          return (
            <li key={breadcrumb.href}>
              <Link href={breadcrumb.href}>
                <a className='current_page'>
                  {convertBreadcrumb(breadcrumb.breadcrumb)}
                </a>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;