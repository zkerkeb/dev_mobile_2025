import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

const TaskItem = ({todo}) => {
    return(
        <ThemedView>
            <ThemedText>{todo}</ThemedText>
        </ThemedView>
    )
}


export default TaskItem ;