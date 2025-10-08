import React from 'react';
import styled from 'styled-components';

interface PrivacyPolicyPageProps {
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

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = () => {
    return (
        <PageContainer>
        <Container>
            <Paper>
            <Title>Privacy Policy</Title>

            <LastUpdated>
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </LastUpdated>

            <SectionTitle>1. Information We Collect</SectionTitle>
            <Paragraph>
                We collect information that you provide directly to us when you use our interview simulation platform, including:
            </Paragraph>
            <List>
                • Account information (name, email address, profile picture) when you sign in via OAuth providers<br />
                • Interview recordings and transcripts<br />
                • Resume information that you upload<br />
                • Feedback and evaluation data
            </List>

            <SectionTitle>2. How We Use Your Information</SectionTitle>
            <Paragraph>
                We use the information we collect to:
            </Paragraph>
            <List>
                • Provide, maintain, and improve our services<br />
                • Process and analyze your interview simulations<br />
                • Provide personalized feedback and evaluations<br />
                • Communicate with you about our services<br />
                • Ensure the security and integrity of our platform
            </List>

            <SectionTitle>3. Information Sharing</SectionTitle>
            <Paragraph>
                We do not sell your personal information. We may share your information only in the following circumstances:
            </Paragraph>
            <List>
                • With your consent<br />
                • To comply with legal obligations<br />
                • To protect our rights and prevent fraud<br />
                • With service providers who assist in operating our platform
            </List>

            <SectionTitle>4. Data Security</SectionTitle>
            <Paragraph>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </Paragraph>

            <SectionTitle>5. Third-Party Authentication</SectionTitle>
            <Paragraph>
                When you sign in using OAuth providers (Google, Facebook), we receive limited information from these services as permitted by your privacy settings with those providers. We use this information solely for authentication purposes and to create your account.
            </Paragraph>

            <SectionTitle>6. Your Rights</SectionTitle>
            <Paragraph>
                You have the right to:
            </Paragraph>
            <List>
                • Access your personal information<br />
                • Correct inaccurate information<br />
                • Request deletion of your information<br />
                • Opt-out of certain data collection practices
            </List>

            <SectionTitle>7. Data Retention</SectionTitle>
            <Paragraph>
                We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time.
            </Paragraph>

            <SectionTitle>8. Changes to This Policy</SectionTitle>
            <Paragraph>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
            </Paragraph>

            <SectionTitle>9. Contact Us</SectionTitle>
            <Paragraph>
                If you have any questions about this privacy policy or our practices, please contact us at:
            </Paragraph>
            <List>
                • Email: chanagun.vir@gmail.com
            </List>
            </Paper>
        </Container>
        </PageContainer>
    );
};

export default PrivacyPolicyPage;

