// import fs from "fs";
import JobApi from "./api/job";

const Sitemap = () => { };

export const getServerSideProps = async ({ res }) => {

  const baseUrl = process.env.FRONTEND_BASE_URL;
  const jobApi = new JobApi()
  const jobs = await jobApi.sitemap()

  const staticPagesPath = [
    'about',
    'blog-eldt',
    'blog-tips',
    'blog',
    'contact',
    'faq',
    'find-jobs',
    'find-schools',
    'forgot-password',
    'login',
    'otr-general-freight-drivers',
    'owner-operators',
    'pricing',
    'privacy-policy',
    'reset-password',
    'signup',
    'terms-and-policies',
    'terms-of-service',
    'third-party-resources',
    'verify-email-token',
  ].map((staticPagePath) => (`${baseUrl}${staticPagePath}`))


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPagesPath.map((url) => (`
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod> 
              <changefreq>weekly</changefreq> 
              <priority>1.0</priority>
            </url>
          `))
      .join("")}
      ${jobs.map(({ id, slug, last_updated_at }) => (`
            <url>
              <loc>${baseUrl}jobs/${id}/${slug}</loc>
              <lastmod>${last_updated_at}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>1.0</priority>
            </url>
          `))
      .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
