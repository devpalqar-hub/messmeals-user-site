import styles from "./Privacy.module.css";
import SEO from "../../components/shared/SEO/SEO";

export default function Privacy() {
  return (
    <div className={styles.pageWrapper}>
      <SEO 
        title="Privacy Policy | MessMeals"
        description="Read the MessMeals Privacy Policy to learn how we collect, use, and protect your personal information."
        url="/privacy"
      />
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: October 31, 2025</p>
        </div>
      </section>

      <main className={styles.contentContainer}>
        <h2 className={styles.sectionTitle}>1. Introduction</h2>
        <p className={styles.paragraph}>
          Welcome to Mess Meals (“we,” “us,” or “our”). This Privacy Policy describes how we collect, use, and disclose your information when you use our meal management platform (“the Site”). By using Mess Meals, you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
        <p className={styles.paragraph}>We collect various types of personal and usage information:</p>
        
        <strong className={styles.paragraph}>A. Information You Provide:</strong>
        <ul className={styles.list}>
          <li className={styles.listItem}>Account Signup: Name, email, phone, mess/hostel details, and password.</li>
          <li className={styles.listItem}>Ordering: Delivery addresses, meal preferences, payment details (processed securely by third-party gateways).</li>
          <li className={styles.listItem}>Communications: If you contact us, we collect your info and the content of your communication.</li>
        </ul>
        
        <strong className={styles.paragraph}>B. Data Collected Automatically:</strong>
        <ul className={styles.list}>
          <li className={styles.listItem}>Technical Data: Device info, IP address, browser type, and access times for security and functionality only.</li>
        </ul>
        
        <strong className={styles.paragraph}>C. Data from Third Parties:</strong>
        <ul className={styles.list}>
          <li className={styles.listItem}>Payment confirmations from payment processors.</li>
          <li className={styles.listItem}>Delivery status updates from logistics partners (if integrated).</li>
        </ul>

        <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>To process orders, manage subscriptions, and fulfill services.</li>
          <li className={styles.listItem}>To send you order updates, invoices, and service notifications.</li>
          <li className={styles.listItem}>For customer support and to answer your queries.</li>
          <li className={styles.listItem}>To maintain platform security, prevent fraud, and fulfill our legal obligations.</li>
        </ul>

        <h2 className={styles.sectionTitle}>4. How We Share Your Information</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>With payment providers, for secure transaction handling.</li>
          <li className={styles.listItem}>With delivery staff or partners, only for fulfilling your orders.</li>
          <li className={styles.listItem}>If required by law or to protect our rights and users’ safety.</li>
          <li className={styles.listItem}>In case of business reorganization, your data may be transferred as part of the transaction.</li>
        </ul>

        <h2 className={styles.sectionTitle}>5. Cookies and Tracking</h2>
        <p className={styles.paragraph}>
          Mess Meals only uses strictly necessary cookies for core features such as login sessions and order processing. No analytics or marketing cookies are used.
        </p>

        <h2 className={styles.sectionTitle}>6. Data Security</h2>
        <p className={styles.paragraph}>
          We use reasonable steps to protect your information. No system is 100% secure, but we work to ensure your data’s safety.
        </p>

        <h2 className={styles.sectionTitle}>7. Data Retention</h2>
        <p className={styles.paragraph}>
          Your data is kept only as long as needed for services or legal requirements. When not needed, it is securely deleted or anonymized.
        </p>

        <h2 className={styles.sectionTitle}>8. Your Rights</h2>
        <p className={styles.paragraph}>Depending on your locations and legal rights, you may:</p>
        <ul className={styles.list}>
          <li className={styles.listItem}>Access, update, or delete your account information.</li>
          <li className={styles.listItem}>Request restriction or objection to certain processing.</li>
          <li className={styles.listItem}>Request a copy or transfer of your data.</li>
          <li className={styles.listItem}>Withdraw your consent at any time.</li>
        </ul>
        <p className={styles.paragraph}>
          To use these rights, contact us below. We may need to verify your identity for your protection.
        </p>

        <h2 className={styles.sectionTitle}>9. International Data</h2>
        <p className={styles.paragraph}>
          Your data may be stored on servers in India. By using Mess Meals, you consent to such transfers. Users in the EU/UK: We use appropriate safeguards for cross-border data transfers.
        </p>

        <h2 className={styles.sectionTitle}>10. Children’s Privacy</h2>
        <p className={styles.paragraph}>
          Mess Meals is not intended for users under age 13. We do not knowingly collect data from children. Contact us if you believe a child’s data was provided, and we will promptly remove it.
        </p>

        <h2 className={styles.sectionTitle}>11. Links to Other Websites</h2>
        <p className={styles.paragraph}>
          We are not responsible for privacy practices on external sites you visit via Mess Meals (e.g., payment gateways). Please review their policies separately.
        </p>

        <h2 className={styles.sectionTitle}>12. Changes to This Policy</h2>
        <p className={styles.paragraph}>
          We may update this Privacy Policy. Changes will be posted here with a new “Last Updated” date. Continued use of Mess Meals indicates your acceptance of the updated policy.
        </p>

        <h2 className={styles.sectionTitle}>13. Contact Us</h2>
        <p className={styles.paragraph}>For any privacy questions or to exercise your rights, contact us:</p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Email: <a href="mailto:info@messmeals.com" className={styles.link}>info@messmeals.com</a>
          </li>
          <li className={styles.listItem}>
            Website: <a href="https://messmeals.com" target="_blank" rel="noopener noreferrer" className={styles.link}>messmeals.com</a>
          </li>
        </ul>
      </main>
    </div>
  );
}
