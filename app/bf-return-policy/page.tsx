import React from "react";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import "@/src/assests/css/list.css";
import Link from "next/link";

const ReturnPolicyPage = () => {
  return (
    <>
      <Breadcrumbs />
      <div className="w-11/12 mx-auto">
        <h2 className="text-3xl font-semibold text-center py-4">
        RETURN, REPLACEMENT & CANCELLATION POLICY
        </h2>
        <p>
        All cases for refund or replacement will be processed in accordance with the below terms and conditions. Both Buyer and Seller shall agree to these terms. However, in the event of false, frivolous or baseless complaints regarding the delivery or quality of the products, the Buyer will not be eligible for refund or replacement.
        </p>
        <p>Buyers are requested to ensure that the correct catalogue number and quantity is ordered. In case you have any doubts, please feel free to email us at <Link href="mailto:info@boffinbutler.com" className="text-blue-600 underline">info@boffinbutler.com</Link>.</p>
        
        <ul className="list-decimal pl-8">
          <li>If the Buyer places the order and then cancels the order within 24 hours of placing the order or before the material is shipped, whichever is earlier, then a fee of 2.5% of the total amount will be deducted before refunding the amount</li>
          <li>If the Buyer places the order and if the product is out of stock or if the Seller does not ship the material within the stipulated time then the entire amount will be refunded.</li>
          <li>If the Buyer places the order and wants to return it without asserting any reason, then the Seller should be willing to accept the material. If the Seller is willing to accept the material back then an internet handling fee of 3% of the invoice amount will be deducted from the total amount they have paid before refunding the amount. Also, the Buyer has to bear the shipping charge for returning the ordered items. The amount will only be refunded once the Seller confirms that the product has been received in a proper state.</li>
          <li>If the Seller sends the wrong product then the same should be informed within 72 hours of receiving the material. The Seller will then send the replacement. If you wish to cancel the order then the entire amount will be refunded.</li>
          <li>If the Seller sends an incomplete order then the same should be informed within 72 hours of receiving the material. The Seller will then send the remainder of the product. In case the Seller is unable to send, you will get a partial refund.</li>
          <li>If the Seller sends damaged/defective/expired product or if the product is not meeting specifications, then the same should be informed within 72 hours of receiving the product along with the images. For cold storage products, it should be reported within 48 hours of delivery. The Seller will then offer a replacement. If the Seller does not have a replacement and should you wish to cancel the order then the entire amount will be refunded.</li>
          <li>In the event the return of a Product is duly accepted by the Seller, the value of such Product, as originally paid by the Buyer during acceptance of the Product, will be refunded to the payment instrument of the Buyer from which payment was made or to any prepaid payment instrument account of the Buyer. Boffin Butler shall have the sole discretion to determine the mode of reversal.</li>
          <li>In case the Buyer purchases any products offline from the Seller, then this return policy is not applicable, and further, Boffin Butler is not responsible or liable for any claim/damages, etc. The Buyer will have to negotiate directly with the Seller for any claims/disputes.</li>

        </ul>

        <div className="text-xl font-semibold py-3">What is covered in the return policy?</div>
        <ul className="list-decimal pl-8">
            <li>Items not received</li>
            <li>Items that are physically damaged/defective</li>
            <li>Wrong item delivered</li>
            <li>Wrong quantity</li>
            <li>Missing parts/accessories</li>
            <li>Expired Product</li>
        </ul>
        <div className="text-xl font-semibold py-3">By when can items be returned?</div>
        <p>In case the Buyer receives the product in “Damaged”, “Defective” or any condition as mentioned above, then they can conveniently place a return request within 72 hours after receiving the order.</p>
        <div className="text-xl font-semibold py-3">What is the return process?</div>
        <p>To return a product, you can email us at support@boffinbutler.com. Please provide us with the following details while placing the return request.</p>
        <ul className="list-decimal pl-8">
            <li>Order ID</li>
            <li>Reason for returning the item</li>
            <li>Images clearly showing a damage / missing product in the order</li>
            <li>Any other proof that will help us in making a decision regarding your request Post receiving your request, the Boffin Butler Team will confirm the return request and will inform you about the return process. It is advised that the items to be returned are adequately packaged. The final decision of the request will lie with Boffin Butler and cannot be contested.</li>

        </ul>
        <p>
          Please ensure that the product is in unused and in original condition, with the seal unbroken and includes everything from the package, e.g., price tags, labels, original packing, invoice and other items
        </p>
        <p>Once your return request is accepted by Boffin Butler, the entire refund amount (except the Internet handling fees as mentioned above in certain cases) will be reversed back to you within 7-10 working days after the returned product is received by the Seller.</p>
        <div className="text-xl font-semibold py-3">Can you replace the product?</div>
        <p>Product can be replaced if a wrong/damaged/defective/expired product has been delivered. Following terms shall be applicable.</p>
        <ul className="list-decimal pl-8">
          <li>
          Replacements will depend on the availability of the item with the Seller.
          </li>
          <li>
          Replacement process will begin after the returned product is received by the Seller.
          </li>
          <li>
          In case the replacement item is out of stock, your order amount shall be refunded
          </li>
        </ul>
        <div className="text-xl font-semibold py-3">Can I cancel the order?</div>
        <p>You can cancel the order within a maximum of 24 hours after the order is placed as long as the material is not shipped by the seller. To cancel the order, you will need to email us at support@boffinbutler.com stating the order ID. After your request, it will take us a maximum of 1-2 business days to cancel the order. The same will be notified to you by email. We will deduct a fee of 2.5% of the total order value before refunding the amount. Please note the refund process will take 7-10 working days.</p>
        
      </div>
    </>
  );
};

export default ReturnPolicyPage;
