import Dashboard from '@/components/dashboard';
import Layout from 'components/layout';
import Seo from 'components/seo';

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <Dashboard />
    </Layout>
  );
}
