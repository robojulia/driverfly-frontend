import fs from "fs";
import JobApi from "./api/job";

const Sitemap = (props) => {

    console.log('props', props);
}

export const getServerSideProps = async ({ res }) => {

    try {

        const baseUrl = process.env.FRONTEND_BASE_URL;
        const jobApi = new JobApi()
        const jobs = await jobApi.sitemap()

        const staticPages = fs
            .readdirSync(process.cwd() + "/pages")
            .filter((staticPage) => {
                return ![
                    "_app.js",
                    "_document.js",
                    "_error.js",
                    "_middleware.ts",
                    "api",
                    "sitemap.xml.js",
                ].includes(staticPage);
            })
            .map((staticPagePath) => {
                return `${baseUrl}/${staticPagePath.replace('.js', '')}`;
            });


        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages.map((url) => (`
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
              <loc>${baseUrl}/jobs/${id}/${slug}</loc>
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
            props: {
                data: process.cwd()
            },
        }
    } catch (error) {
        console.error(error.message);
        return {
            props: { error },
        }
    }
}

export default Sitemap;
