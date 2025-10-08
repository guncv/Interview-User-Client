import React from 'react';
import styled from 'styled-components';

interface TermsOfServicePageProps {
    title: string;
    isActive: boolean;
}

const PageContainer = styled.div`
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 2rem 1rem;
`;

const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
`;

const Paper = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 3rem;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a1a1a;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const LastUpdated = styled.p`
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #2d2d2d;
`;

const Paragraph = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    color: #4a4a4a;
    margin-bottom: 1rem;
`;

const List = styled.div`
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.8;
    color: #4a4a4a;
`;

const TermsOfServicePage: React.FC<TermsOfServicePageProps> = () => {
    return (
        <PageContainer>
        <Container>
            <Paper>
            <Title>Terms of Service</Title>

            <LastUpdated>
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </LastUpdated>

            <SectionTitle>1. Acceptance of Terms</SectionTitle>
            <Paragraph>
                By accessing and using this interview simulation platform ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
            </Paragraph>

            <SectionTitle>2. Description of Service</SectionTitle>
            <Paragraph>
                Our Service provides an AI-powered interview simulation platform that allows users to:
            </Paragraph>
            <List>
                • Practice interview skills through simulated interviews<br />
                • Record and review interview sessions<br />
                • Receive AI-generated feedback and evaluations<br />
                • Upload and manage resume information<br />
                • Track interview performance over time
            </List>

            <SectionTitle>3. User Accounts</SectionTitle>
            <Paragraph>
                To use our Service, you must:
            </Paragraph>
            <List>
                • Create an account using a supported OAuth provider (Google, Facebook)<br />
                • Provide accurate and complete information<br />
                • Maintain the security of your account credentials<br />
                • Be at least 13 years of age<br />
                • Notify us immediately of any unauthorized use of your account
            </List>
            <Paragraph>
                You are responsible for all activities that occur under your account.
            </Paragraph>

            <SectionTitle>4. User Content and Conduct</SectionTitle>
            <Paragraph>
                You retain all rights to the content you submit to our Service, including interview recordings, resumes, and other materials. By submitting content, you grant us a license to use, store, and process this content solely to provide our Service.
            </Paragraph>
            <Paragraph>
                You agree not to:
            </Paragraph>
            <List>
                • Upload malicious content or viruses<br />
                • Violate any laws or regulations<br />
                • Infringe on intellectual property rights<br />
                • Attempt to gain unauthorized access to our systems<br />
                • Reverse engineer or attempt to extract source code<br />
                • Use the Service for any unlawful purpose<br />
                • Harass, abuse, or harm other users
            </List>

            <SectionTitle>5. AI-Generated Content</SectionTitle>
            <Paragraph>
                Our Service uses artificial intelligence to generate interview questions, feedback, and evaluations. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. The feedback and evaluations provided are for educational purposes only and should not be considered professional career advice.
            </Paragraph>

            <SectionTitle>6. Intellectual Property</SectionTitle>
            <Paragraph>
                The Service, including its original content, features, and functionality, is owned by us and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission.
            </Paragraph>

            <SectionTitle>7. Data Privacy</SectionTitle>
            <Paragraph>
                Your privacy is important to us. Our collection and use of personal information is described in our Privacy Policy. By using the Service, you consent to our collection and use of your information as outlined in the Privacy Policy.
            </Paragraph>

            <SectionTitle>8. Payment and Subscriptions</SectionTitle>
            <Paragraph>
                If applicable, certain features of our Service may require payment. You agree to provide accurate billing information and authorize us to charge your payment method for any fees incurred. Subscription fees are non-refundable except as required by law.
            </Paragraph>

            <SectionTitle>9. Service Availability</SectionTitle>
            <Paragraph>
                We strive to provide uninterrupted access to our Service, but we do not guarantee that the Service will always be available or error-free. We reserve the right to:
            </Paragraph>
            <List>
                • Modify or discontinue the Service at any time<br />
                • Perform maintenance and updates<br />
                • Suspend access for violations of these terms<br />
                • Change features or functionality
            </List>

            <SectionTitle>10. Disclaimer of Warranties</SectionTitle>
            <Paragraph>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </Paragraph>

            <SectionTitle>11. Limitation of Liability</SectionTitle>
            <Paragraph>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
            </Paragraph>

            <SectionTitle>12. Indemnification</SectionTitle>
            <Paragraph>
                You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of another party.
            </Paragraph>

            <SectionTitle>13. Termination</SectionTitle>
            <Paragraph>
                We may terminate or suspend your account and access to the Service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason. You may also terminate your account at any time by contacting us.
            </Paragraph>

            <SectionTitle>14. Governing Law</SectionTitle>
            <Paragraph>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
            </Paragraph>

            <SectionTitle>15. Changes to Terms</SectionTitle>
            <Paragraph>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
            </Paragraph>

            <SectionTitle>16. Severability</SectionTitle>
            <Paragraph>
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </Paragraph>

            <SectionTitle>17. Contact Us</SectionTitle>
            <Paragraph>
                If you have any questions about these Terms of Service, please contact us at:
            </Paragraph>
            <List>
                • Email: chanagun.vir@gmail.com
            </List>
            </Paper>
        </Container>
        </PageContainer>
    );
};

export default TermsOfServicePage;

