import InventoryTable from '@/components/inventory/inventory-table';
import Layout from 'components/layout';
import Seo from 'components/seo';

export default function Page() {
  return (
    <Layout>
      <Seo />
      <InventoryTable />
    </Layout>
  );
}
