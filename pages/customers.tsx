import CustomerTable from '@/components/customer/customer-table';
import Layout from 'components/layout';
import Seo from 'components/seo';

export default function Page() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <CustomerTable />
    </Layout>
  );
}
