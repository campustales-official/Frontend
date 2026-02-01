import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 sm:p-12">
                    <Link
                        to="/signup"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-8 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Signup
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
                    <p className="text-gray-500 mb-8">CampusTales | Last updated: January 30, 2026</p>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using CampusTales, you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Platform.
                            </p>
                        </section>

                        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h2 className="text-xl font-semibold text-blue-900 mb-4">2. Platform Nature & Scope</h2>
                            <p className="text-blue-800">
                                CampusTales is a college-centric digital utility platform provided on an “as-is” and “as-available” basis. The Platform is currently in a testing and pilot phase and may change without notice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Eligibility</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>There is no minimum age restriction enforced by the Platform</li>
                                <li>Users may participate as students, faculty, alumni, or external participants</li>
                                <li>Users whose colleges are not registered may participate in global/public events by self-declaring their college name</li>
                            </ul>
                            <p className="mt-4 italic">
                                CampusTales does not guarantee the accuracy or authenticity of user-provided academic or institutional information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Accounts & Security</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Users are responsible for maintaining account security</li>
                                <li>You must not impersonate others or provide false information</li>
                                <li>We reserve the right to suspend or terminate accounts at our discretion</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Content & Conduct</h2>
                            <p>You agree not to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Upload illegal, abusive, misleading, or infringing content</li>
                                <li>Misuse certificates or misrepresent participation</li>
                                <li>Attempt to bypass access controls or platform restrictions</li>
                            </ul>
                            <p className="mt-4">
                                All content remains the responsibility of the user who created it.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Content Ownership & License</h2>
                            <p>
                                You retain ownership of your content. By posting or uploading content, you grant CampusTales a non-exclusive, royalty-free license to store, display, and distribute such content as required to operate the Platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Administrative Control & Moderation</h2>
                            <p>CampusTales reserves the right to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Approve or reject colleges</li>
                                <li>Suspend or deactivate users, clubs, or content</li>
                                <li>Modify or remove content without prior notice</li>
                            </ul>
                            <p className="mt-4 font-medium">
                                Administrative decisions are final during the testing phase.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Certificates Disclaimer</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Certificates are issued based on platform records</li>
                                <li>Certificates are final once generated</li>
                                <li>CampusTales is not liable for institutional recognition, acceptance, or rejection of certificates</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. No Payments</h2>
                            <p>Currently:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>No paid events</li>
                                <li>No platform fees</li>
                                <li>No payment processing</li>
                            </ul>
                            <p className="mt-4">
                                Any future monetization will be governed by updated terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
                            <p>To the maximum extent permitted by law:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>CampusTales shall not be liable for data loss, misuse of public files, or service interruptions</li>
                                <li>We do not guarantee uninterrupted, error-free operation</li>
                                <li>Use of the Platform is at your own risk</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Termination</h2>
                            <p>
                                We may terminate or restrict access to the Platform at any time without notice, especially in cases of misuse or policy violations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of India.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contact</h2>
                            <p>For support or legal inquiries:</p>
                            <p className="font-medium text-blue-600">📧 support@campustales.com</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
