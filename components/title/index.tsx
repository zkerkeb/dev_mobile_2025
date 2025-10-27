import { ThemedText } from "../themed-text";

const Title = ({label = "Title by default"}) => {
  return(
    <ThemedText type="title">{label}</ThemedText>
  )
}

export default Title;