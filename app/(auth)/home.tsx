import LoginForm from "@/components/loginForm";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const router = useRouter();
    
    // useEffect(() => {


    //     const token = SecureStore.getItem('token');
    //     if(token !== null) {
    //         router.replace('/(tabs)');
    //     }
    // }, []);

    return(
        <SafeAreaView>
            <ThemedText>Home</ThemedText>
            <LoginForm />

       
        </SafeAreaView>
    )
}

export default Home;     {/* <Button title="Liens vers Pokemon" onPress={() => router.replace('/pokemon')} />
    <ThemedView>
        <Link replace href="/pokemon">
            <Link.Trigger>  
                <ThemedText> Liens vers Pokemon</ThemedText>
            </Link.Trigger>
        </Link>
        <Link href="/(tabs)">
        
            <Link.Trigger>  
                <ThemedText> Liens vers (tabs)</ThemedText>
            </Link.Trigger>
        </Link>
        <ThemedText>Home</ThemedText> */}
    {/* </ThemedView> */}