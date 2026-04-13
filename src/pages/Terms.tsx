import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Terms = () => (
  <div className="flex min-h-screen flex-col">
    <SEO title="Terms of Service" description="Terms of Service for DroneHire Malaysia drone pilot directory." />
    <Navbar />
    <main className="flex-1 py-12">
      <div className="container max-w-3xl prose prose-sm dark:prose-invert">
        <h1 className="font-heading text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: April 11, 2026</p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By accessing and using DroneHire ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">2. Description of Service</h2>
        <p className="text-muted-foreground">
          DroneHire is a directory platform connecting drone service providers ("Pilots") with potential clients in Malaysia. The Platform allows Pilots to list their services, certifications, and contact information, and allows clients to search and connect with Pilots directly.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">3. Pilot Listings</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>Pilots are solely responsible for the accuracy of their profile information, including certifications, qualifications, and equipment listed.</li>
          <li>Pilots claiming CAAM certification must hold a valid Remote Operator Certificate issued by the Civil Aviation Authority of Malaysia (CAAM) and must provide their certification number.</li>
          <li>DroneHire does not independently verify pilot certifications. Clients are advised to request and verify certification documents directly with pilots before engaging their services.</li>
          <li>Pilots must not provide false, misleading, or outdated information on their profiles.</li>
        </ul>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">4. User Responsibilities</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>Users must comply with all applicable Malaysian laws and regulations, including those governing unmanned aircraft systems (UAS) operations.</li>
          <li>Clients are responsible for conducting their own due diligence when hiring drone pilots.</li>
          <li>Users must not use the Platform for any unlawful or prohibited purpose.</li>
        </ul>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">5. Disclaimer of Warranties</h2>
        <p className="text-muted-foreground">
          The Platform is provided "as is" without warranties of any kind. DroneHire does not guarantee the quality, safety, or legality of services offered by listed pilots. DroneHire is not a party to any agreement between pilots and clients and bears no liability for any disputes, damages, or losses arising from such engagements.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">6. Limitation of Liability</h2>
        <p className="text-muted-foreground">
          DroneHire shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the Platform, or from any services arranged through the Platform.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">7. Privacy & Data</h2>
        <p className="text-muted-foreground">
          Pilot profile information (name, location, contact details, certifications, and equipment) is publicly displayed on the Platform. By submitting your information, you consent to its public display. Profile data is stored locally in your browser and is not transmitted to external servers.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">8. Intellectual Property</h2>
        <p className="text-muted-foreground">
          All content, trademarks, and materials on the Platform are the property of DroneHire or its licensors. Users retain ownership of their submitted profile content but grant DroneHire a non-exclusive license to display it on the Platform.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">9. Modifications</h2>
        <p className="text-muted-foreground">
          DroneHire reserves the right to modify these Terms of Service at any time. Continued use of the Platform after changes constitutes acceptance of the updated terms.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">10. Governing Law</h2>
        <p className="text-muted-foreground">
          These Terms of Service are governed by the laws of Malaysia. Any disputes arising from the use of the Platform shall be subject to the exclusive jurisdiction of Malaysian courts.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground mt-6">11. Contact</h2>
        <p className="text-muted-foreground">
          For questions regarding these Terms of Service, please contact us through the Platform's support channels.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
