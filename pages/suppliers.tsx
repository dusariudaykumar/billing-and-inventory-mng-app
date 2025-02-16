import SupplierTable from '@/components/supplier/supplier-table';
import Layout from 'components/layout';
import Seo from 'components/seo';

export default function Page() {
  return (
    <Layout>
      <Seo />
      <SupplierTable />
    </Layout>
  );
}
