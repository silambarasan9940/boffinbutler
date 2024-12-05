import React from "react";

interface Status {
  label: string;
  value: boolean;
}

interface ShippingPlacementDetailsProps {
  status: {
    approval_status: boolean;
    invoice_status: boolean;
    shipment_status: boolean;
    delivery_status: boolean;
  };
}

const ShippingPlacementDetails: React.FC<ShippingPlacementDetailsProps> = ({
  status,
}) => {
  const statusList: Status[] = [
    { label: "Approval", value: status.approval_status },
    { label: "Invoice", value: status.invoice_status },
    { label: "Shipment", value: status.shipment_status },
    { label: "Delivery", value: status.delivery_status },
  ];

  return (
    <div className="relative flex items-center justify-center">
      {/* Container for indicators */}
      <div className="flex items-center justify-center">

        {statusList.map((item, index) => (
            
          <div key={index} className="relative flex items-center">
            {/* Label directly above the indicator */}
            <span
              className={`absolute -top-6 text-sm font-medium left-5 transform -translate-x-1/2 ${
                item.value ? "text-green-500" : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
            {/* Status Indicator */}
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                item.value ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              {item.value ? "✓" : ""}
            </div>
            {/* Connecting Line */}
            {index < statusList.length - 1 && (
              <div
                className={`h-1 w-20 ${
                  item.value ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingPlacementDetails;
