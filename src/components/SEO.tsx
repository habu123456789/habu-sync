import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://sevasadan.lovable.app';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SEO = ({ title, description, path, type = 'website', jsonLd }: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
