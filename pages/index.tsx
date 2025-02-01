import Layout from 'components/layout';
import Seo from 'components/seo';

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <main>
        <section className='bg-white'>
          <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
            <h1 className='mt-4'>Work under progress</h1>
          </div>
        </section>
      </main>
    </Layout>
  );
}
