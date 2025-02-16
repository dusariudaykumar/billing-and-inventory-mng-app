import Layout from 'components/layout';
import Seo from 'components/seo';

import InventoryTable from '@/components/inventory/inventory-table';

export default function Page() {
  return (
    <Layout>
      <Seo />
      <InventoryTable />
    </Layout>
  );
}
