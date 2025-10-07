import { CheckCircle2, Circle, Lock } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { INTERVIEW_STAGES } from '../../constants';
import { useContextProvider } from '../layout/ContextProvider';

interface StageSelectorProps {
    selectedStages: string[];
    onStageToggle: (stageLabel: string) => void;
    disabled?: boolean;
}

const StageSelector = ({
    selectedStages,
    onStageToggle,
    disabled = false,
}: StageSelectorProps) => {

    const { isMobile } = useContextProvider();
    const optionalStages = INTERVIEW_STAGES.filter(stage => !stage.isMandatory);
    const mandatoryStages = INTERVIEW_STAGES.filter(stage => stage.isMandatory);
    const optionalSelectedStages = selectedStages.filter(
        label => !INTERVIEW_STAGES.find(s => s.label === label)?.isMandatory
    );
    
    const allOptionalSelected = optionalStages.every(stage => 
        selectedStages.includes(stage.label)
    );

    const handleSelectAll = () => {
        if (allOptionalSelected) {
        optionalStages.forEach(stage => {
            if (selectedStages.includes(stage.label)) {
            onStageToggle(stage.label);
            }
        });
        } else {
        optionalStages.forEach(stage => {
            if (!selectedStages.includes(stage.label)) {
            onStageToggle(stage.label);
            }
        });
        }
    };

    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: Size.Medium,
            width: '100%',
        }}
        >
        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: Size.Small,
            borderBottom: `2px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
            }}
        >
            <h3
            style={{
                fontSize: isMobile ? Size.Small : Size.Medium,
                fontFamily: font.Medium,
                color: Colors.PRIMARY_COLOR,
                margin: 0,
            }}
            >
                Interview Stages
            </h3>

            <button
            onClick={handleSelectAll}
            disabled={disabled}
            style={{
                background: 'transparent',
                border: 'none',
                color: Colors.ACCENT_COLOR,
                fontSize: isMobile ? '12px' : '12px',
                fontFamily: font.Medium,
                cursor: disabled ? 'default' : 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                opacity: disabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                e.currentTarget.style.backgroundColor = Colors.ACCENT_COLOR + '20';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            }}
            >
            {allOptionalSelected ? 'Deselect All' : 'Select All'}
            </button>
        </div>

        <div
            style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: Size.Small,
            width: '100%',
            }}
        >
            {INTERVIEW_STAGES.map((stage) => {
            const isSelected = selectedStages.includes(stage.label);
            const isMandatory = stage.isMandatory === true;
            const isDisabled = disabled || isMandatory;
            
            return (
                <div
                key={stage.key}
                onClick={() => !isDisabled && onStageToggle(stage.label)}
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: Size.Small,
                    padding: isMobile ? Size.Small : Size.Medium,
                    borderRadius: Size.Small,
                    border: `2px solid ${isSelected ? Colors.ACCENT_COLOR : Colors.LECTURE_CONTENT_PART_COLOR}`,
                    backgroundColor: isSelected
                    ? Colors.ACCENT_COLOR + '10'
                    : Colors.TEXT_WHITE_COLOR,
                    cursor: isDisabled ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isDisabled ? 0.85 : 1,
                    minHeight: isMobile ? '80px' : '90px',
                    position: 'relative',
                }}
                onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                    e.currentTarget.style.borderColor = Colors.ACCENT_COLOR_LIGHT;
                    e.currentTarget.style.backgroundColor = Colors.LECTURE_CONTENT_PART_COLOR;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isDisabled && !isSelected) {
                    e.currentTarget.style.borderColor = Colors.LECTURE_CONTENT_PART_COLOR;
                    e.currentTarget.style.backgroundColor = Colors.TEXT_WHITE_COLOR;
                    }
                }}
                >
                <div
                    style={{
                    marginTop: '2px',
                    flexShrink: 0,
                    }}
                >
                    {isMandatory ? (
                    <Lock
                        size={isMobile ? 18 : 20}
                        color={Colors.ACCENT_COLOR}
                    />
                    ) : isSelected ? (
                    <CheckCircle2
                        size={isMobile ? 20 : 24}
                        color={Colors.ACCENT_COLOR}
                        fill={Colors.ACCENT_COLOR + '40'}
                    />
                    ) : (
                    <Circle
                        size={isMobile ? 20 : 24}
                        color={Colors.SECONDARY_TEXT_COLOR}
                    />
                    )}
                </div>
                <div
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    flex: 1,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                        style={{
                        fontSize: isMobile ? Size.Small : Size.Small,
                        fontFamily: font.Medium,
                        color: isSelected ? Colors.PRIMARY_COLOR : Colors.SECONDARY_TEXT_COLOR,
                        lineHeight: '1.4',
                        }}
                    >
                        {stage.label}
                    </span>
                    {isMandatory && (
                        <span
                        style={{
                            fontSize: isMobile ? '10px' : '11px',
                            fontFamily: font.Medium,
                            color: Colors.ACCENT_COLOR,
                            backgroundColor: Colors.ACCENT_COLOR + '15',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            lineHeight: '1.2',
                        }}
                        >
                            Required
                        </span>
                    )}
                    </div>
                    {stage.description && (
                    <span
                        style={{
                        fontSize: isMobile ? '11px' : '12px',
                        fontFamily: font.Regular,
                        color: Colors.SECONDARY_TEXT_COLOR,
                        lineHeight: '1.4',
                        }}
                    >
                        {stage.description}
                    </span>
                    )}
                </div>
                </div>
            );
            })}
        </div>

        {optionalSelectedStages.length === 0 && (
            <div
            style={{
                padding: Size.Small,
                backgroundColor: Colors.TEXT_ERROR_COLOR + '10',
                borderRadius: Size.Small,
                border: `1px solid ${Colors.TEXT_ERROR_COLOR}`,
            }}
            >
            <p
                style={{
                margin: 0,
                fontSize: isMobile ? '12px' : Size.Small,
                fontFamily: font.Regular,
                color: Colors.TEXT_ERROR_COLOR,
                }}
            >
                Please select at least one optional stage to continue
            </p>
            </div>
        )}

        <div
            style={{
            padding: Size.Small,
            backgroundColor: Colors.ACCENT_COLOR + '10',
            borderRadius: Size.Small,
            border: `1px solid ${Colors.ACCENT_COLOR}`,
            }}
        >
            <p
            style={{
                margin: 0,
                fontSize: isMobile ? '12px' : Size.Small,
                fontFamily: font.Regular,
                color: Colors.PRIMARY_COLOR,
            }}
            >
            {mandatoryStages.length} required + {optionalSelectedStages.length} of {optionalStages.length} optional stages selected
            </p>
        </div>
        </div>
    );
};

export default StageSelector;

