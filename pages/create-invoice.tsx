import CreateInvoice from '@/components/sales/create-invoice';
import Layout from 'components/layout';
import Seo from 'components/seo';

export default function Page() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <CreateInvoice />
    </Layout>
  );
}
