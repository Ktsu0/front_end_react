import styles from "./footer.module.scss";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} - Desenvolvido por Gabriel Wagner | Contato:
      gabrielwag971@gmail.com
    </footer>
  );
};

export default Footer;
