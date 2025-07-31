import styles from './FooterOfOrugallu.module.css';

function FooterOfOrugallu() {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} Miss Orugallu Ruchulu. All rights reserved.
    </footer>
  );
}

export default FooterOfOrugallu;
