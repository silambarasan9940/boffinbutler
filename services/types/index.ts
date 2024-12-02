export interface Product {
    id: number;
    sku: string;
    name: string;
    attribute_set_id: number;
    price: number;
    status: number;
    visibility: number;
    type_id: string;
    created_at: string;
    updated_at: string;
    weight: number;
    extension_attributes: ExtensionAttributes;
    product_links: ProductLink[];
    options: any[];
    media_gallery_entries: MediaGalleryEntry[];
    tier_prices: any[];
    custom_attributes: CustomAttribute[];
    discount_percentage: number;
  }
  
  export interface ExtensionAttributes {
    website_ids: number[];
    category_links: CategoryLink[];
    custom_final_price: string;
    original_final_price: string;
    special_final_price: string;
    discount_percent: string;
    gst_final_price: string;
    seller_id: number;
    seller_data: SellerData[];
    assigned_seller_data: any[];
    custom_stock_item: any;
  }
  
  interface CategoryLink {
    position: number;
    category_id: string;
  }
  
  interface SellerData {
    entity_id: string;
    mageproduct_id: string;
    adminassign: string;
    seller_id: string;
    store_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    seller_pending_notification: string;
    admin_pending_notification: string;
    is_approved: string;
    shop_title: string | null;
  }
  
  interface ProductLink {
    
  }
  
  interface MediaGalleryEntry {
    id: number;
    media_type: string;
    label: string | null;
    position: number;
    disabled: boolean;
    types: string[];
    file: string;
  }
  
  export interface CustomAttribute {
    attribute_code: string;
    value: string | number | string[];
  }
  

  