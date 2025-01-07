import React, { useState } from 'react';
import { FiSliders } from 'react-icons/fi';
import ProductFilter from './ProductFilter';
import { AiOutlineClose } from 'react-icons/ai';

interface AggregationItem {
  key: string;
  doc_count: number;
  name: string;
}

interface Aggregations {
  category_id: AggregationItem[];
  material: AggregationItem[];
  purity: AggregationItem[];
  quantity_val: AggregationItem[];
  product_brand: AggregationItem[];
}

interface FilterModalProps {
  aggregations: Aggregations | null;
  onFilterChange: (filters: FilterValues) => void;
  

}
interface FilterValues {
  brands: string[];
  materials: string[];
  purity: string[];
  priceRange: number[];
  category_id: string[];
  quantity_val:string[];
}


const FilterModal: React.FC<FilterModalProps> = ({ aggregations, onFilterChange}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button 
        className="p-2 bg-gray-300 text-black rounded-full" 
        onClick={toggleModal}
      >
        <FiSliders /> 
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 md:hidden" style={{background:'#00000033'}}>
          <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 md:hidden overflow-y-auto">
            <div className="mx-3">
              {aggregations ? (
                <>
              <ProductFilter aggregations={aggregations} onFilterChange={onFilterChange} />
              </>
                
              ) : (
                <p>Loading filters...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterModal;
