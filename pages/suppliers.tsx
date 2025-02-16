import Layout from 'components/layout';
import Seo from 'components/seo';

import SupplierTable from '@/components/supplier/supplier-table';

export default function Page() {
  return (
    <Layout>
      <Seo />
      <SupplierTable />
    </Layout>
  );
}
