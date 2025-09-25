import React, { useState, useEffect, type CSSProperties } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { PrimaryButton, PrimaryTextArea, PrimaryDropdown } from '../common';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { useContextProvider } from '../layout/ContextProvider';
import type { CreateUserIssueReportReq } from '../../interface/reportIssueInterface';
import { useDispatch, useSelector } from 'react-redux';
import { createIssueReportAction, listIssueCategoriesAction } from '../../actions/issueReport';
import type { RootState } from '../../reducers/rootReducer';

interface CreateAndUpdateIssuePopupProps {
    isVisible: boolean;
    onClose: () => void;
}

const CreateAndUpdateIssuePopup: React.FC<CreateAndUpdateIssuePopupProps> = ({
    isVisible,
    onClose,
}) => {
    const { isMobile } = useContextProvider();
    const dispatch = useDispatch();
    const { listIssueCategories } = useSelector((state: RootState) => state.issueReport);

    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ description?: string; categoryId?: string }>({});

    useEffect(() => {
        dispatch(listIssueCategoriesAction());
    }, [dispatch]);

    useEffect(() => {
        if (isVisible) {
            setDescription('');
            setCategoryId('');
            setErrors({});
        }
    }, [isVisible]);

    const validateForm = (): boolean => {
        const newErrors: { description?: string; categoryId?: string } = {};

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.trim().length < 1) {
            newErrors.description = 'Description must be at least 1 character';
        } else if (description.trim().length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        if (listIssueCategories.data.length === 0) {
            newErrors.categoryId = 'No categories available. Please try again later.';
        } else if (!categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const createData: CreateUserIssueReportReq = {
                description: description.trim(),
                category_id: categoryId,
            };
                
            dispatch(createIssueReportAction(createData));

            onClose();
        } catch (error) {
            console.error('Error submitting issue report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setDescription('');
        setCategoryId('');
        setErrors({});
        onClose();
    };

    if (!isVisible) return null;

    const overlayStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? Size.Small : Size.Medium,
    };

    const modalStyle: CSSProperties = {
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        borderRadius: Size.Medium,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        padding: isMobile ? Size.Medium : Size.LargeMedium,
        minWidth: isMobile ? '90vw' : '500px',
        maxWidth: isMobile ? '95vw' : '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 10000,
        border: `1px solid ${Colors.BORDER_COLOR}`,
        position: 'relative',
    };

    const headerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Size.Large,
        paddingBottom: Size.Medium,
        borderBottom: `1px solid ${Colors.BORDER_COLOR}`,
    };

    const titleStyle: CSSProperties = {
        fontSize: isMobile ? Size.Medium : Size.LargeMedium,
        color: Colors.PRIMARY_COLOR,
        fontFamily: font.Medium,
        margin: 0,
    };

    const closeButtonStyle: CSSProperties = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: Size.Small,
        borderRadius: Size.Small,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
    };

    const formStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Large,
    };

    const buttonContainerStyle: CSSProperties = {
        display: 'flex',
        gap: Size.Medium,
        marginTop: Size.Small,
        flexDirection: isMobile ? 'column' : 'row',
    };

    const characterCountStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        color: description.length > 900 ? Colors.TEXT_ERROR_COLOR : Colors.SECONDARY_TEXT_COLOR,
        textAlign: 'right',
        marginTop: Size.Small,
        fontFamily: font.Regular,
    };

    return (
        <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && handleCancel()}>
            <div style={modalStyle}>
                <div style={headerStyle}>
                    <p style={titleStyle}>
                        Create Issue Report
                    </p>
                    <button
                        style={closeButtonStyle}
                        onClick={handleCancel}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = Colors.BORDER_COLOR;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <X size={20} color={Colors.SECONDARY_TEXT_COLOR} />
                    </button>
                </div>

                <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
                    {listIssueCategories.data.length > 0 ? (
                        <PrimaryDropdown
                            label="Category"
                            value={categoryId}
                            onChange={setCategoryId}
                            options={listIssueCategories.data.map((category) => ({
                                value: category.id,
                                label: category.name,
                            }))}
                            placeholder="Select a category"
                            error={errors.categoryId}
                            disabled={isSubmitting}
                        />
                    ) : (
                        <div>
                            <div style={{
                                fontSize: isMobile ? Size.Small : Size.Medium,
                                color: Colors.PRIMARY_COLOR,
                                marginBottom: Size.Small,
                                textAlign: 'start',
                            }}>
                                Category
                            </div>
                            <div style={{
                                width: '100%',
                                marginTop: Size.Small,
                                height: isMobile ? '35px' : '45px',
                                border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
                                borderRadius: Size.Small,
                                padding: Size.Small,
                                paddingLeft: Size.Medium,
                                paddingRight: Size.Medium,
                                fontFamily: font.Regular,
                                backgroundColor: Colors.BORDER_COLOR,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: Colors.SECONDARY_TEXT_COLOR,
                                fontSize: isMobile ? Size.Small : Size.Medium,
                                gap: Size.Small,
                            }}>
                                <AlertCircle size={16} />
                                No categories available
                            </div>
                            {errors.categoryId && (
                                <div style={{
                                    fontSize: Size.Small,
                                    color: Colors.TEXT_ERROR_COLOR,
                                    fontFamily: font.Regular,
                                    textAlign: 'right',
                                    marginTop: Size.Small,
                                }}>
                                    {errors.categoryId}
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <PrimaryTextArea
                            label="Description"
                            value={description}
                            onChange={setDescription}
                            placeholder="Describe the issue in detail..."
                            rows={6}
                            error={errors.description}
                            disabled={isSubmitting}
                        />
                        <div style={characterCountStyle}>
                            {description.length}/1000 characters
                        </div>
                    </div>

                    <div style={buttonContainerStyle}>
                        <PrimaryButton
                            label="Cancel"
                            onClick={handleCancel}
                            isCancel={true}
                            isDisabled={isSubmitting}
                        />
                        <PrimaryButton
                            label={
                                isSubmitting
                                    ? 'Creating...'
                                    : 'Create Issue'
                            }
                            onClick={handleSubmit}
                            isDisabled={
                                isSubmitting || 
                                !description.trim() || 
                                !categoryId || 
                                listIssueCategories.data.length === 0
                            }
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAndUpdateIssuePopup;