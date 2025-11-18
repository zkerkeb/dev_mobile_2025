import DuckList from "@/components/duckList";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ExploreScreen = () => {
  const router = useRouter();
  const { logout } = useAuth();
  return(
    <SafeAreaView>
    <ThemedView>
      <ThemedText>Explore test</ThemedText>
    </ThemedView>

    <Button title="Disconnect" onPress={logout} />
    {/* <Title label="Zak" />
    <Title label="Coco" />
    <Title label="Cuicui" />
    <Title/> */}
    {/* <Counter /> */}
    {/* <TodoList /> */}
    <DuckList />
    {/* <Counter beginValue={10} /> */}
    </SafeAreaView>
  )
}

export default ExploreScreen;