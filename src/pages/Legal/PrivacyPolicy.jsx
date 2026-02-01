import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-500 mb-8">CampusTales | Last updated: January 30, 2026</p>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p>
                                CampusTales (“Platform”, “we”, “us”, “our”) is a college-centric digital platform operated by an individual in India. The Platform enables students, clubs, and colleges to create posts, manage events, issue participation certificates, and communicate within college-scoped or public contexts.
                            </p>
                            <p>
                                By using CampusTales, you agree to the collection and use of information in accordance with this Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.1 Personal Information</h3>
                            <p>We may collect the following information when you register or use the Platform:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>College name and academic details (such as branch, degree, year, semester)</li>
                                <li>Role-based identifiers (e.g., scholar number, roll number, enrollment number, faculty identifier) as provided by you</li>
                            </ul>
                            <p className="mt-4 italic"><strong>Important:</strong> CampusTales does not currently verify the authenticity of academic identifiers submitted by users.</p>

                            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">2.2 Event & Participation Data</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Event registrations and responses (including text, dropdowns, and file uploads)</li>
                                <li>Attendance and participation status</li>
                                <li>Certificates issued for events</li>
                            </ul>

                            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">2.3 Content Data</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Posts, announcements, and event descriptions</li>
                                <li>Uploaded images, documents, and certificates</li>
                            </ul>
                            <p className="mt-4">All uploaded files are currently stored in publicly accessible cloud storage URLs.</p>

                            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">2.4 System & Log Data</h3>
                            <p>For security, auditing, and operational purposes, we collect:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>IP address</li>
                                <li>Device and browser information (user agent)</li>
                                <li>Login activity</li>
                                <li>Administrative and moderation actions through audit logs</li>
                            </ul>
                        </section>

                        <section className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                            <h2 className="text-xl font-semibold text-amber-900 mb-4">3. Public Storage Disclosure (Critical)</h2>
                            <p className="text-amber-800">
                                CampusTales currently uses public-read cloud storage for hosting:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-amber-800">
                                <li>Certificates</li>
                                <li>Event files</li>
                                <li>Uploaded images and documents</li>
                            </ul>
                            <p className="mt-4 text-amber-800 font-medium">
                                These files are accessible via direct URLs. While URLs are generated using unique identifiers, we do not guarantee confidentiality of public URLs.
                            </p>
                            <p className="mt-4 text-amber-800">
                                By uploading content to the Platform, you explicitly consent to this storage mechanism.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Visibility & Access Control</h2>
                            <p>Content on CampusTales may have different visibility levels:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Club-only</strong> – visible to members of a specific club</li>
                                <li><strong>College-only</strong> – visible to members of a specific college</li>
                                <li><strong>Public/Global</strong> – visible across the Platform</li>
                            </ul>
                            <p className="mt-4">
                                Visibility for events may be changed by authorized users until the event is completed. Other content visibility may be restricted by system rules.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Certificates</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Certificates are generated and stored digitally</li>
                                <li>Certificates can be verified through the Platform</li>
                                <li>Certificates can be downloaded and shared by users</li>
                                <li>Certificates cannot be revoked, altered, or reissued once generated</li>
                            </ul>
                            <p className="mt-4">
                                CampusTales is not responsible for misuse or external representation of issued certificates.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
                            <p>We use third-party services for infrastructure and functionality, including:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Authentication (e.g., Google OAuth)</li>
                                <li>Email delivery</li>
                                <li>Cloud storage and hosting</li>
                                <li>Application hosting platforms</li>
                            </ul>
                            <p className="mt-4">
                                These services process data only as required to provide their functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                            <p>We retain user data as long as:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Your account remains active, or</li>
                                <li>The data is required for platform functionality, auditing, or legal compliance</li>
                            </ul>
                            <p className="mt-4">
                                You may request account deletion; however, some data (such as audit logs and issued certificates) may be retained for integrity and security reasons.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. User Responsibilities</h2>
                            <p>You are responsible for:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Accuracy of the information you provide</li>
                                <li>Ensuring uploaded content does not violate laws or institutional policies</li>
                                <li>Understanding the public nature of uploaded files</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Children’s Privacy</h2>
                            <p>
                                CampusTales does not actively restrict usage by age. Users below the age of majority are expected to use the Platform with appropriate consent as required by applicable law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
                            <p>
                                This Privacy Policy may be updated as the Platform evolves. Continued use of CampusTales constitutes acceptance of the revised policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact</h2>
                            <p>For privacy-related queries, contact:</p>
                            <p className="font-medium text-blue-600">📧 <a href="mailto:support@campustales.com">support@campustales.com</a></p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
