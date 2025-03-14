import Layout from '@/components/layout';
import EditInvoice from '@/components/sales/edit-invoice';
import Seo from '@/components/seo';

export default function EditInvoicePage() {
  return (
    <Layout>
      <Seo templateTitle='Edit Invoice' />
      <EditInvoice />
    </Layout>
  );
}
