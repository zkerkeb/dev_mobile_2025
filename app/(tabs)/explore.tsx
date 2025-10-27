import Counter from "@/components/counter";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";


const ExploreScreen = () => {
  return(
    <SafeAreaView>
    <ThemedView>
      <ThemedText>Explore</ThemedText>
    </ThemedView>
    {/* <Title label="Zak" />
    <Title label="Coco" />
    <Title label="Cuicui" />
    <Title/> */}
    <Counter />
    {/* <Counter beginValue={10} /> */}
    </SafeAreaView>
  )
}

export default ExploreScreen;