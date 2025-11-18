import { StyleSheet, TextInput } from "react-native";
import { ThemedText } from "../themed-text";

const InputCommon = ({titleInput, ...rest}) => {

    return(
        <>
        <ThemedText type="title">{titleInput}</ThemedText>
        <TextInput {...rest} style={styles.input} />
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#787676',
        padding: 10,
        borderRadius: 4,
        color: 'white',
    },
});

export default InputCommon;