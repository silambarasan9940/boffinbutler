export interface Order {
    base_currency_code: string;
    base_discount_amount: number;
    base_grand_total: number;
    base_discount_tax_compensation_amount: number;
    base_shipping_amount: number;
    base_shipping_discount_amount: number;
    base_shipping_discount_tax_compensation_amnt: number;
    base_shipping_incl_tax: number;
    base_shipping_tax_amount: number;
    base_subtotal: number;
    base_subtotal_incl_tax: number;
    base_tax_amount: number;
    base_total_due: number;
    base_to_global_rate: number;
    base_to_order_rate: number;
    billing_address_id: number;
    created_at: string;
    customer_email: string;
    customer_firstname: string;
    customer_gender: number;
    customer_group_id: number;
    customer_id: number;
    customer_is_guest: number;
    customer_lastname: string;
    customer_note_notify: number;
    discount_amount: number;
    email_sent: number;
    entity_id: number;
    global_currency_code: string;
    grand_total: number;
    discount_tax_compensation_amount: number;
    increment_id: string;
    is_virtual: number;
    order_currency_code: string;
    protect_code: string;
    quote_id: number;
    remote_ip: string;
    shipping_amount: number;
    shipping_description: string;
    shipping_discount_amount: number;
    shipping_discount_tax_compensation_amount: number;
    shipping_incl_tax: number;
    shipping_tax_amount: number;
    state: string;
    status: string;
    store_currency_code: string;
    store_id: number;
    store_name: string;
    store_to_base_rate: number;
    store_to_order_rate: number;
    subtotal: number;
    subtotal_incl_tax: number;
    tax_amount: number;
    total_due: number;
    total_item_count: number;
    total_qty_ordered: number;
    updated_at: string;
    weight: number;
    items: Item[];
    billing_address: Address;
    payment: Payment;
    status_histories: any[];
    extension_attributes: ExtensionAttributes;
}

export interface Item {
    amount_refunded: number;
    base_amount_refunded: number;
    base_discount_amount: number;
    base_discount_invoiced: number;
    base_discount_tax_compensation_amount: number;
    base_original_price: number;
    base_price: number;
    base_price_incl_tax: number;
    base_row_invoiced: number;
    base_row_total: number;
    base_row_total_incl_tax: number;
    base_tax_amount: number;
    base_tax_invoiced: number;
    created_at: string;
    discount_amount: number;
    discount_invoiced: number;
    discount_percent: number;
    free_shipping: number;
    discount_tax_compensation_amount: number;
    is_qty_decimal: number;
    is_virtual: number;
    item_id: number;
    name: string;
    no_discount: number;
    order_id: number;
    original_price: number;
    price: number;
    price_incl_tax: number;
    product_id: number;
    product_type: string;
    qty_canceled: number;
    qty_invoiced: number;
    qty_ordered: number;
    qty_refunded: number;
    qty_shipped: number;
    quote_item_id: number;
    row_invoiced: number;
    row_total: number;
    row_total_incl_tax: number;
    row_weight: number;
    sku: string;
    store_id: number;
    tax_amount: number;
    tax_invoiced: number;
    tax_percent: number;
    updated_at: string;
    weight: number;
    extension_attributes: {
        image: Image[];
    };
}

export interface Image {
    sku: string;
    status: number;
    product_links: any[];
    media_gallery_entries: MediaEntry[];
    tier_prices: any[];
}

export interface MediaEntry {
    id: number;
    media_type: string;
    label: string | null;
    position: number;
    disabled: boolean;
    types: string[];
    file: string;
}

export interface Address {
    address_type: string;
    city: string;
    country_id: string;
    customer_address_id: number;
    email: string;
    entity_id: number;
    firstname: string;
    lastname: string;
    parent_id: number;
    postcode: string;
    region: string;
    region_code: string;
    region_id: number;
    street: string[];
    telephone: string;
}

export interface Payment {
    account_status: string | null;
    additional_information: string[];
    amount_ordered: number;
    base_amount_ordered: number;
    base_shipping_amount: number;
    cc_exp_year: string;
    cc_last4: string | null;
    cc_ss_start_month: string;
    cc_ss_start_year: string;
    entity_id: number;
    method: string;
    parent_id: number;
    shipping_amount: number;
}

export interface ExtensionAttributes {
    shipping_assignments: ShippingAssignment[];
    payment_additional_info: PaymentAdditionalInfo[];
    applied_taxes: AppliedTax[];
    item_applied_taxes: ItemAppliedTax[];
    converting_from_quote: boolean;
}

export interface ShippingAssignment {
    shipping: {
        address: Address;
        method: string;
        total: ShippingTotal;
    };
    items: Item[];
}

export interface ShippingTotal {
    base_shipping_amount: number;
    base_shipping_discount_amount: number;
    base_shipping_discount_tax_compensation_amnt: number;
    base_shipping_incl_tax: number;
    base_shipping_tax_amount: number;
    shipping_amount: number;
    shipping_discount_amount: number;
    shipping_discount_tax_compensation_amount: number;
    shipping_incl_tax: number;
    shipping_tax_amount: number;
}

export interface PaymentAdditionalInfo {
    key: string;
    value: string;
}

interface AppliedTax {
    code: string;
    title: string;
    percent: number;
    amount: number;
    base_amount: number;
}

interface ItemAppliedTax {
    type: string;
    item_id: number;
    applied_taxes: AppliedTax[];
}
