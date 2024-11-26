import React from 'react';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import "@/src/assests/css/list.css";
import Link from 'next/link';

const FaqPage = () => {
  return (
    <>
      <Breadcrumbs />
      <div className="w-11/12 mx-auto">
        <h2 className="text-3xl font-semibold text-center py-4">
          FREQUENTLY ASKED QUESTIONS (FAQs)
        </h2>

        <div className="text-xl font-semibold underline">
          1. What is BoffinButler all about?
        </div>
        <p>BoffinButler is a marketplace for entities dealing in scientific, medical, and diagnostic goods. It serves as an exchange platform helping buyers and sellers connect and buy/sell goods online.</p>

        <div className="text-xl font-semibold underline">
          2. Who can create an account on BoffinButler?
        </div>
        <p>Scientists/researchers, institute purchase departments, and private companies can register as buyers. Businesses dealing/trading in scientific, medical, and diagnostic goods can register as sellers. All necessary documents need to be provided by users wanting to register as buyers/sellers.</p>

        <div className="text-xl font-semibold underline">
          3. I am a professor/scientist/researcher working in an institute/company. Can I register and buy any of the goods online?
        </div>
        <p>Yes. You can buy any of the goods online provided they are in stock.</p>

        <div className="text-xl font-semibold underline">
          4. I am a supplier of scientific/medical/diagnostic goods. How can registering as a supplier on BoffinButler benefit me?
        </div>
        <p>There are 3 main benefits of registering as a supplier on BoffinButler:</p>
        <ol type="1" className="unordered-list-num list-decimal">
          <li>Promotion of your brand via digital marketing (opening of e-store, email marketing campaigns, digital advertisements).</li>
          <li>Liquidation of your inventory.</li>
          <li>Receive enquiries and orders from end-users directly in your mailbox.</li>
        </ol>

        <div className="text-xl font-semibold underline">
          5. Can I register for free?
        </div>
        <p>Yes. Anybody can register for free on the website. Their contact information is verified. If the contact information provided is wrong, then their account will be deactivated.</p>

        <div className="text-xl font-semibold underline">
          6. What are the fees for sellers?
        </div>
        <p>After the free trial period, sellers will be charged a commission on sales, as notified in the Seller Agreement. Please contact us at <Link href="mailto:info@boffinbutler.com" className="text-blue-600 underline">info@boffinbutler.com</Link> for further information.</p>
      </div>
    </>
  );
}

export default FaqPage;
