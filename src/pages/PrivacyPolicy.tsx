import { Layout } from '@/components/layout/Layout';

export default function PrivacyPolicy() {
    return (
        <Layout>
            <section className="pt-32 pb-12 hero-gradient">
                <div className="container-custom">
                    <h1 className="heading-1 text-primary-foreground">Privacy Policy</h1>
                    <p className="text-primary-foreground/80 mt-4">Last Updated: January 15, 2025</p>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom max-w-4xl prose dark:prose-invert">
                    <p className="lead">
                        <strong>NextGlide Solutions Private Limited</strong> ("us", "we", or "our") operates the NextGlide website (the "Service").
                        This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                    </p>

                    <h3>1. Information Collection and Use</h3>
                    <p>
                        We collect several different types of information for various purposes to provide and improve our Service to you.
                    </p>
                    <ul>
                        <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, Cookies and Usage Data.</li>
                        <li><strong>Usage Data:</strong> We may also collect information how the Service is accessed and used.</li>
                    </ul>

                    <h3>2. Use of Data</h3>
                    <p>NextGlide Solutions Private Limited uses the collected data for various purposes:</p>
                    <ul>
                        <li>To provide and maintain the Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                        <li>To provide customer care and support</li>
                        <li>To provide analysis or valuable information so that we can improve the Service</li>
                        <li>To monitor the usage of the Service</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>

                    <h3>3. Transfer of Data</h3>
                    <p>
                        Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
                    </p>
                    <p>
                        If you are located outside India and choose to provide information to us, please note that we transfer the data, including Personal Data, to India and process it there.
                    </p>

                    <h3>4. Security of Data</h3>
                    <p>
                        The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us:</p>
                    <ul>
                        <li>By email: info@nextglide.com</li>
                        <li>By phone: +91 7671972625</li>
                        <li>By visiting our US office: 8951 Cypress Waters Blvd Suite 160, Coppell, TX 75019</li>
                        <li>By visiting our Registered Office: 101 Tridha Building, Road-5, PJR Enclave, Gangaram, Chandanagar, Tirumalagiri, Hyderabad- 500050, Telangana, India.</li>
                    </ul>
                </div>
            </section>
        </Layout>
    );
}
