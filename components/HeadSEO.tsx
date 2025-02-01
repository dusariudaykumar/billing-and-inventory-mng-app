import Head from 'next/head';

interface HeadSEOProps {
  siteAuthor?: string;
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  siteCanonicalUrl?: string;
  siteLogo?: string;
  siteLocale?: string;
  siteType?: string;
  siteTitle?: string;
  children?: React.ReactNode;
}

export default function HeadSEO({
  siteAuthor = process.env.NEXT_PUBLIC_SITE_AUTHOR,
  siteName = process.env.NEXT_PUBLIC_SITE_NAME,
  siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL,
  siteCanonicalUrl = process.env.NEXT_PUBLIC_SITE_URL,
  siteLogo = process.env.NEXT_PUBLIC_SITE_LOGO,
  siteLocale = process.env.NEXT_PUBLIC_SITE_LOCALE,
  siteType = process.env.NEXT_PUBLIC_SITE_TYPE,
  siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE,
  children,
}: HeadSEOProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': siteType,
    url: siteCanonicalUrl,
    name: siteName,
    description: siteDescription,
    logo: siteLogo,
  };

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name='author' content={siteAuthor} />
      <meta name='description' content={siteDescription} />
      <link rel='canonical' href={siteCanonicalUrl} />

      {/* OpenGraph */}
      <meta property='og:locale' content={siteLocale} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:type' content={siteType} />
      <meta property='og:title' content={siteTitle} />
      <meta property='og:description' content={siteDescription} />
      <meta property='og:url' content={siteUrl} />
      {siteLogo && <meta property='og:image' content={siteLogo} />}

      {/* JSON-LD */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {children}
    </Head>
  );
}
