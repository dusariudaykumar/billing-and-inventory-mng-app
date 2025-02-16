import Layout from 'components/layout';
import Seo from 'components/seo';

import CustomerTable from '@/components/customer/customer-table';

export default function Page() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <CustomerTable />
    </Layout>
  );
}
