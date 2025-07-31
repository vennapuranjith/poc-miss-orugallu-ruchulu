import styles from "./NavbarOfOrugallu.module.css";
import { useAuth } from "./AuthContext";

function GuestBanner() {
  const { user } = useAuth();
  if (user) return null;
  return (
    <div className={styles.guestBanner}>
      <span className={styles.marquee}>
        ✨📢 Sign up today to track your orders, receive tasty deals, and enjoy home-style Orugallu flavors! 🫶🎁
      </span>
    </div>
  );
}

export default GuestBanner;