import InvoiceTemplate from '@/components/sales/view-invoice/invoice-template';
import Layout from 'components/layout';
import Seo from 'components/seo';

export default function Page() {
  return (
    <Layout>
      <Seo />
      <InvoiceTemplate />
      {/* <InvoiceTemplate /> */}
    </Layout>
  );
}
