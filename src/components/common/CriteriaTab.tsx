import React, { useState } from 'react';
import font from '../../assets/styles/Font';
import { Colors } from '../../assets/styles';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../reducers/rootReducer';
import { useEffect } from 'react';
import { getEvaluationRubricAndCriteria } from '../../actions/evaluationAction';
import type { CriterionRow } from '../../interface/evaluationInterface';

const CriteriaTab: React.FC = () => {
    const [selectedRubric, setSelectedRubric] = useState<string>('');
    const dispatch = useDispatch();
    
    const { evaluationRubricAndCriteria } = useSelector((state: RootState) => state.evaluation);

    useEffect(() => {
        dispatch(getEvaluationRubricAndCriteria());
    }, [dispatch]);

    useEffect(() => {
        if (evaluationRubricAndCriteria.rubrics.length > 0) {
            setSelectedRubric(evaluationRubricAndCriteria.rubrics[0].id);
        }
    }, [evaluationRubricAndCriteria]);

    const selectedRubricData = evaluationRubricAndCriteria.rubrics.find(rubric => rubric.id === selectedRubric) || evaluationRubricAndCriteria.rubrics[0];
    
    if (evaluationRubricAndCriteria.rubrics.length === 0) {
        return <div style={{ fontSize: '16px', color: Colors.PRIMARY_COLOR, fontFamily: font.Medium }}>Loading...</div>;
    }

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
                    {evaluationRubricAndCriteria.rubrics.map((rubric) => (
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
                    {selectedRubricData.description_md}
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
                    {selectedRubricData.criteria.map((criterion: CriterionRow) => (
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
                                {criterion.name[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    fontSize: '12px', 
                                    marginBottom: '4px',
                                    color: Colors.PRIMARY_COLOR,
                                    fontFamily: font.Medium,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    {criterion.name}
                                    <div style={{ 
                                        fontSize: '12px', 
                                        color: criterion.color,
                                        fontFamily: font.Bold,
                                        backgroundColor: criterion.color + '20',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        {criterion.percentage}%
                                    </div>
                                </div>
                                <div style={{ 
                                    fontSize: '12px',
                                    color: Colors.SECONDARY_TEXT_COLOR,
                                    lineHeight: '1.4'
                                }}>
                                    {criterion.description_md}
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
