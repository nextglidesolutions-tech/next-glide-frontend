import { Layout } from '@/components/layout/Layout';

export default function TermsOfService() {
    return (
        <Layout>
            <section className="pt-32 pb-12 hero-gradient">
                <div className="container-custom">
                    <h1 className="heading-1 text-primary-foreground">Terms of Service</h1>
                    <p className="text-primary-foreground/80 mt-4">Last Updated: January 15, 2025</p>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom max-w-4xl prose dark:prose-invert">
                    <p className="lead">
                        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the website operated by <strong>NextGlide Solutions Private Limited</strong> ("us", "we", or "our").
                    </p>
                    <p>
                        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                    </p>

                    <h3>1. Communications</h3>
                    <p>
                        By creating an Account on our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.
                    </p>

                    <h3>2. Content</h3>
                    <p>
                        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                    </p>

                    <h3>3. Intellectual Property</h3>
                    <p>
                        The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of NextGlide Solutions Private Limited and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.
                    </p>

                    <h3>4. Links To Other Web Sites</h3>
                    <p>
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by NextGlide Solutions Private Limited. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
                    </p>

                    <h3>5. Termination</h3>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h3>6. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of Telangana, India, without regard to its conflict of law provisions.
                    </p>

                    <h3>7. Changes</h3>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                    </p>

                    <h3>8. Contact Us</h3>
                    <p>If you have any questions about these Terms, please contact us:</p>
                    <ul>
                        <li>By email: info@nextglide.com</li>
                        <li>By phone: +91 7671972625</li>
                        <li>By visiting our Registered Office: 101 Tridha Building, Road-5, PJR Enclave, Gangaram, Chandanagar, Tirumalagiri, Hyderabad- 500050, Telangana, India.</li>
                    </ul>
                </div>
            </section>
        </Layout>
    );
}
