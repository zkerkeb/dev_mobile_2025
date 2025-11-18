import { Button } from "@react-navigation/elements";

const PrimaryButton = ({title, onPress}) => {
    return(
        <Button variant="filled" color="white" onPress={onPress}>
            {title}
        </Button>
    )
}

export default PrimaryButton;