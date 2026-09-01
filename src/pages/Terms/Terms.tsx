import styles from "./Terms.module.css";
import SEO from "../../components/shared/SEO/SEO";

export default function Terms() {
  return (
    <main className={styles.container}>
      <SEO 
        title="Terms of Service | MessMeals"
        description="Read the MessMeals Terms of Service to understand the rules, responsibilities, and conditions for using our platform."
        url="/terms"
      />
      <h1 className={styles.title}>Terms and Conditions</h1>
      <p className={styles.lastUpdated}>Last Updated: October 31, 2025</p>

      <h2 className={styles.sectionTitle}>1. Account Registration and Use</h2>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Account Creation:</strong> To use Mess Meals, you must provide accurate information during registration (name, email/phone, password). You agree to keep your login credentials secure and updated.
      </p>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Eligibility:</strong> By registering, you confirm you are at least 18 years old and eligible to agree to these terms.
      </p>

      <h2 className={styles.sectionTitle}>2. Mess Meals Services</h2>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Service Overview:</strong> Mess Meals offers tools for managing meal plans, customer subscriptions, orders, delivery tracking, analytics, and payment management for mess owners and customers.
      </p>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Delivery Personnel:</strong> Delivery management is provided as part of the app. Mess Meals is not responsible for delays or incompletion by third-party or independent delivery services.
      </p>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Feature Changes:</strong> Features are subject to updates and improvements; some features may be added or discontinued over time.
      </p>

      <h2 className={styles.sectionTitle}>3. Orders, Payments, and Refunds</h2>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Pricing:</strong> Subscription and order pricing is listed in the app and may change. All fees are disclosed during checkout.
      </p>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Payments:</strong> Payments are processed using secure gateways. You agree to pay all applicable charges for chosen plans or orders.
      </p>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Refunds:</strong> Refunds follow the cancellation policy specified within the app. No refund is provided for completed meals or services already rendered.
      </p>

      <h2 className={styles.sectionTitle}>4. User Responsibilities</h2>
      <p className={styles.paragraph}>By using Mess Meals, you agree to:</p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Provide accurate mess location and customer information</li>
        <li className={styles.listItem}>Keep contact and payment details up to date</li>
        <li className={styles.listItem}>Promptly handle any customer or delivery queries</li>
        <li className={styles.listItem}>Not misuse, copy, or resell Mess Meals services or data</li>
        <li className={styles.listItem}>Respect other users and avoid fraudulent behavior</li>
      </ul>

      <h2 className={styles.sectionTitle}>5. Intellectual Property</h2>
      <p className={styles.paragraph}>
        All Mess Meals branding, features, and original content are the property of Mess Meals and its licensors. Unauthorized use or duplication is prohibited.
      </p>

      <h2 className={styles.sectionTitle}>6. Service Availability and Disclaimer</h2>
      <p className={styles.paragraph}>
        Mess Meals is provided “as is.” We make no guarantees about uninterrupted service or error-free performance. Feature availability may depend on network or third-party providers.
      </p>

      <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
      <p className={styles.paragraph}>
        Mess Meals is not responsible for indirect damages or losses. For physical or data damages caused by technical errors attributable to Mess Meals, our maximum liability is limited to the value of affected orders within the app, as permitted by law.
      </p>

      <h2 className={styles.sectionTitle}>8. Indemnification</h2>
      <p className={styles.paragraph}>
        You agree to indemnify and hold harmless Mess Meals, its affiliates, and agents from any claims or issues arising from your breach of these terms or misuse of our services.
      </p>

      <h2 className={styles.sectionTitle}>9. Governing Law</h2>
      <p className={styles.paragraph}>
        These terms are governed by the laws of Kerala, India. If a provision is found unenforceable, the remaining terms will remain in effect.
      </p>

      <h2 className={styles.sectionTitle}>10. Changes to Terms</h2>
      <p className={styles.paragraph}>
        We may update these terms at any time. Significant changes will be announced in advance within the app. Continuing to use Mess Meals means acceptance of the updated terms.
      </p>

      <h2 className={styles.sectionTitle}>11. Contact Us</h2>
      <p className={styles.paragraph}>If you have questions about these Terms, contact us at:</p>
      <p className={styles.paragraph}>
        <strong className={styles.paragraph}>Email:</strong> <a href="mailto:info@messmeals.com" className={styles.link}>info@messmeals.com</a>
      </p>
    </main>
  );
}
