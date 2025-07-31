import styles from './CategoryFilter.module.css';

const categories = [
  "all", "curries", "pickles", "millets", "sweets", "starters", "biryani", "rice", "drinks","fruits"
];

function CategoryFilter({ selected, onSelect }) {
  return (
    <div className={styles.filterBar}>
      {categories.map((cat) => (
        <button
          key={cat}
          className={selected === cat ? styles.active : styles.button}
          onClick={() => onSelect(cat)}
        >
          {formatCategory(cat)}
        </button>
      ))}
    </div>
  );
}

function formatCategory(cat) {
  const emojis = {
    all: "🥗",
    curries: "🍛",
    pickles: "🥒",
    millets: "🌾",
    sweets: "🍰",
    drinks: "🥤",
    starters: "🍢",
    biryani: "🍚",
    rice: "🍽️",
    fruits: "🍎"
  };
  return `${emojis[cat] || "📦"} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
}

export default CategoryFilter;
