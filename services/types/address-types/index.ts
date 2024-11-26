export interface Address {
    id: number;
    customer_id: number;
    region: {
        region_code: string;
        region: string;
        region_id: number;
    };
    region_id: number;
    country_id: string;
    street: string[];
    company: string;
    telephone: string;
    postcode: string;
    city: string;
    firstname: string;
    lastname: string;
    default_shipping: boolean;
    default_billing: boolean;
}

export interface CustomAttribute {
    attribute_code: string;
    value: string;
}

export interface ExtensionAttributes {
    is_subscribed: boolean;
}

export interface CustomerResponse {
    id: number;
    group_id: number;
    default_billing: string;
    default_shipping: string;
    created_at: string;
    updated_at: string;
    created_in: string;
    email: string;
    firstname: string;
    lastname: string;
    gender: number;
    store_id: number;
    website_id: number;
    addresses: Address[];
    disable_auto_group_change: number;
    extension_attributes: ExtensionAttributes;
    custom_attributes: CustomAttribute[];
}