import { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ItemsOfOrugallu.css';

const ItemCard = lazy(() => import('../orugallu-components/ItemCard'));
const CategoryFilter = lazy(() => import('../orugallu-components/CategoryFilter'));
const GuestBanner = lazy(() => import('../orugallu-components/GuestBanner'));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ItemsOfOrugallu() {
  const [items, setItems] = useState([]);
  const query = useQuery();
  const initialCategory = query.get("q")?.toLowerCase() || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter(
        item => item.category.toLowerCase() === selectedCategory
      );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <GuestBanner />
      </Suspense>
      <div className="items-wrapper">
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </Suspense>
        <div className="items-grid">
          <Suspense fallback={<div>Loading items...</div>}>
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                imageUrl={item.imageUrl}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default ItemsOfOrugallu;