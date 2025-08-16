import Size from '../../assets/styles/Size';
import Colors from '../../assets/styles/Color';
import Font from '../../assets/styles/Font';

type IconLabelPairProps = {
    icon: React.ReactNode;
    description: string;
    fontSize?: string;
}

const IconLabelPair = ({ icon, description, fontSize }: IconLabelPairProps) => {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            width: '100%',
            alignItems: 'center',
            color: Colors.SECONDARY_TEXT_COLOR,
            fontSize: fontSize || Size.Medium,
        }}>
            {icon}
            <div style={{
                fontFamily: Font.Light,
                width: '100%',
            }}>{description}</div>
        </div>
    );
};

export default IconLabelPair;