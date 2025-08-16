import { type CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import Font from '../../assets/styles/Font';

type Props = {
    message?: string;
};

export const ErrorMessage = ({ message }: Props) => {

    const errorMessageStyle: CSSProperties = {
        fontSize: Size.Medium,
        fontFamily: Font.Regular,
        color: Colors.TEXT_ERROR_COLOR,
        textAlign: 'center',
    };

    return message ? (
        <div style={errorMessageStyle}>{message}</div>
    ) : null;
};

export default ErrorMessage;