import React, { useState } from 'react';
import font from '../../assets/styles/Font';
import { Colors } from '../../assets/styles';


interface RubricCriteria {
    id: string;
    code: string;
    name: string;
    description: string;
}

interface Rubric {
    id: string;
    name: string;
    description: string;
    criteria: RubricCriteria[];
}

const CriteriaTab: React.FC = () => {
    const [selectedRubric, setSelectedRubric] = useState<string>('greeting');

    const rubrics: Rubric[] = [
        {
            id: 'greeting',
            name: 'Greeting Rubric',
            description: 'Evaluates greeting phase: friendliness, confidence, and communication style',
            criteria: [
                {
                    id: '1',
                    code: 'A',
                    name: 'Friendliness',
                    description: 'Was the candidate polite and welcoming?'
                },
                {
                    id: '2',
                    code: 'B',
                    name: 'Confidence',
                    description: 'Did the candidate sound comfortable starting the conversation?'
                },
                {
                    id: '3',
                    code: 'C',
                    name: 'Communication Style',
                    description: 'Was the greeting clear, professional, and appropriate?'
                }
            ]
        },
        {
            id: 'intro',
            name: 'Intro Rubric',
            description: 'Evaluates candidate introduction: clarity, relevance, confidence',
            criteria: [
                {
                    id: '4',
                    code: 'A',
                    name: 'Clarity of Background',
                    description: 'Was the introduction clear and structured?'
                },
                {
                    id: '5',
                    code: 'B',
                    name: 'Relevance',
                    description: 'Did they highlight key experiences or studies relevant to the role?'
                },
                {
                    id: '6',
                    code: 'C',
                    name: 'Confidence & Presence',
                    description: 'Did they present themselves confidently?'
                },
                {
                    id: '7',
                    code: 'D',
                    name: 'Communication Style',
                    description: 'Was the tone and pacing professional?'
                }
            ]
        },
        {
            id: 'experience',
            name: 'Experience Rubric',
            description: 'Evaluates candidate work experience explanations',
            criteria: [
                {
                    id: '8',
                    code: 'A',
                    name: 'Role Clarity',
                    description: 'Did they clearly explain their role and responsibilities?'
                },
                {
                    id: '9',
                    code: 'B',
                    name: 'Achievements',
                    description: 'Did they highlight measurable impact or contributions?'
                },
                {
                    id: '10',
                    code: 'C',
                    name: 'Technical/Domain Relevance',
                    description: 'Did their experience align with the skills needed?'
                },
                {
                    id: '11',
                    code: 'D',
                    name: 'Reflection/Insights',
                    description: 'Did they reflect on what they learned or improved?'
                }
            ]
        },
        {
            id: 'project',
            name: 'Project Rubric',
            description: 'Evaluates candidate project explanations: problem, implementation, outcomes, and challenges',
            criteria: [
                {
                    id: '12',
                    code: 'A',
                    name: 'Problem Definition',
                    description: 'Did they clearly describe the project\'s goal or challenge?'
                },
                {
                    id: '13',
                    code: 'B',
                    name: 'Implementation Details',
                    description: 'Did they explain tools, tech stack, or design decisions?'
                },
                {
                    id: '14',
                    code: 'C',
                    name: 'Impact/Outcome',
                    description: 'Was there a result or value created?'
                },
                {
                    id: '15',
                    code: 'D',
                    name: 'Challenges & Solutions',
                    description: 'Did they describe obstacles and how they overcame them?'
                }
            ]
        },
        {
            id: 'technical',
            name: 'Technical Rubric',
            description: 'Evaluates answers to technical questions on correctness, clarity, and depth',
            criteria: [
                {
                    id: '16',
                    code: 'A',
                    name: 'Technical Correctness',
                    description: 'Was the answer technically correct?'
                },
                {
                    id: '17',
                    code: 'B',
                    name: 'Clarity of Reasoning',
                    description: 'Was the explanation structured and logical?'
                },
                {
                    id: '18',
                    code: 'C',
                    name: 'Technical Depth',
                    description: 'Did the answer show deeper understanding or examples?'
                },
                {
                    id: '19',
                    code: 'D',
                    name: 'Problem-Solving Approach',
                    description: 'Did they show how they think or debug?'
                }
            ]
        },
        {
            id: 'behavioral',
            name: 'Behavioral Rubric',
            description: 'Evaluates responses to behavioral questions using STAR method',
            criteria: [
                {
                    id: '20',
                    code: 'A',
                    name: 'Situation/Task Clarity',
                    description: 'Did they explain the context clearly?'
                },
                {
                    id: '21',
                    code: 'B',
                    name: 'Actions Taken',
                    description: 'Did they describe their role and specific actions?'
                },
                {
                    id: '22',
                    code: 'C',
                    name: 'Outcome',
                    description: 'Was there a clear result/impact?'
                },
                {
                    id: '23',
                    code: 'D',
                    name: 'Reflection/Learning',
                    description: 'Did they reflect on what they learned or improved?'
                }
            ]
        },
        {
            id: 'general',
            name: 'General Rubric',
            description: 'Used when step is UNKNOWN. Evaluates general communication and technical accuracy',
            criteria: [
                {
                    id: '24',
                    code: 'A',
                    name: 'Clarity of Explanation',
                    description: 'Was the explanation easy to follow and well-structured?'
                },
                {
                    id: '25',
                    code: 'B',
                    name: 'Technical Accuracy',
                    description: 'Was the content technically accurate and complete?'
                },
                {
                    id: '26',
                    code: 'C',
                    name: 'Communication Style',
                    description: 'Was the tone, pacing, and language professional and effective?'
                },
                {
                    id: '27',
                    code: 'D',
                    name: 'Technical Depth',
                    description: 'Did the answer show deep understanding, reasoning, or examples?'
                }
            ]
        }
    ];

    const selectedRubricData = rubrics.find(rubric => rubric.id === selectedRubric) || rubrics[0];

    return (
        <div style={{ 
            backgroundColor: Colors.BACKGROUND_COLOR,
            borderRadius: '8px',
            fontFamily: font.Regular
        }}>
            <div style={{ 
                fontSize: '16px', 
                marginBottom: '16px',
                color: Colors.PRIMARY_COLOR,
            }}>
                Evaluation Criteria Guide
            </div>
            
            <div style={{ 
                fontSize: '12px', 
                marginBottom: '16px',
                color: Colors.SECONDARY_TEXT_COLOR,
                lineHeight: '1.5'
            }}>
                This guide explains the criteria used to evaluate different phases of the interview. 
                Each rubric contains specific criteria that assess various aspects of candidate performance.
            </div>

            <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                    fontSize: '14px', 
                    marginBottom: '8px',
                    color: Colors.PRIMARY_COLOR,
                }}>
                    Select Rubric Category:
                </div>
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px',
                    marginBottom: '20px'
                }}>
                    {rubrics.map((rubric) => (
                        <button
                            key={rubric.id}
                            onClick={() => setSelectedRubric(rubric.id)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: selectedRubric === rubric.id 
                                    ? `2px solid ${Colors.ACCENT_COLOR}` 
                                    : `1px solid ${Colors.BORDER_COLOR}`,
                                backgroundColor: selectedRubric === rubric.id 
                                    ? Colors.ACCENT_COLOR_LIGHT
                                    : Colors.BACKGROUND_COLOR,
                                color: selectedRubric === rubric.id
                                    ? Colors.ACCENT_COLOR
                                    : Colors.PRIMARY_COLOR,
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontFamily: font.Regular,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {rubric.name}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ 
                backgroundColor: Colors.LECTURE_CONTENT_PART_COLOR,
                borderRadius: '8px',
                padding: '20px',
                border: `1px solid ${Colors.BORDER_COLOR}`
            }}>
                <div style={{ 
                    fontSize: '14px', 
                    marginBottom: '8px',
                    color: Colors.PRIMARY_COLOR,
                    fontFamily: font.Medium
                }}>
                    {selectedRubricData.name}
                </div>
                
                <div style={{ 
                    fontSize: '12px', 
                    marginBottom: '16px',
                    color: Colors.SECONDARY_TEXT_COLOR,
                    fontStyle: 'italic'
                }}>
                    {selectedRubricData.description}
                </div>

                <div style={{ 
                    fontSize: '12px', 
                    marginBottom: '8px',
                    color: Colors.PRIMARY_COLOR,
                    fontFamily: font.Medium
                }}>
                    Evaluation Criteria:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedRubricData.criteria.map((criterion) => (
                        <div key={criterion.id} style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: Colors.BACKGROUND_COLOR,
                            borderRadius: '6px',
                            border: `1px solid ${Colors.BORDER_COLOR}`
                        }}>
                            <div style={{ 
                                minWidth: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: Colors.ACCENT_COLOR,
                                color: Colors.TEXT_WHITE_COLOR,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                fontFamily: font.Bold
                            }}>
                                {criterion.code}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    fontSize: '12px', 
                                    marginBottom: '4px',
                                    color: Colors.PRIMARY_COLOR,
                                    fontFamily: font.Medium
                                }}>
                                    {criterion.name}
                                </div>
                                <div style={{ 
                                    fontSize: '12px',
                                    color: Colors.SECONDARY_TEXT_COLOR,
                                    lineHeight: '1.4'
                                }}>
                                    {criterion.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ 
                marginTop: '24px',
                padding: '16px',
                backgroundColor: Colors.ACCENT_COLOR_LIGHT,
                borderRadius: '8px',
                border: `1px solid ${Colors.ACCENT_COLOR}`
            }}>
                <div style={{ 
                    fontSize: '12px', 
                    marginBottom: '8px',
                    color: Colors.ACCENT_COLOR,
                    fontFamily: font.Medium
                }}>
                    How to Use This Guide:
                </div>
                <div style={{ 
                    fontSize: '12px',
                    color: Colors.PRIMARY_COLOR,
                    lineHeight: '1.5'
                }}>
                    • Each criterion is evaluated on a scale (typically 1-5 or 1-4)<br/>
                    • Higher scores indicate better performance in that specific area<br/>
                    • The overall rubric score combines all criteria for that interview phase<br/>
                    • Use this guide to understand what evaluators are looking for in each response
                </div>
            </div>
        </div>
    );
};

export default CriteriaTab;
