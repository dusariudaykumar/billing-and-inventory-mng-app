import Layout from 'components/layout';
import Seo from 'components/seo';

import SalesTable from '@/components/sales/sales-table';

export default function Page() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <SalesTable />
    </Layout>
  );
}
