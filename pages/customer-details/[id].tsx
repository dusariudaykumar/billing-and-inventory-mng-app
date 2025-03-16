import CustomerDeatils from '@/components/customer/customer-details';
import Layout from '@/components/layout';
import Seo from '@/components/seo';

export default function EditInvoicePage() {
  return (
    <Layout>
      <Seo templateTitle='Edit Invoice' />
      <CustomerDeatils />
    </Layout>
  );
}
