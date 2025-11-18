import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import PrimaryButton from "../buttons/primaryButton";
import InputCommon from "../inputCommon";
import { ThemedView } from "../themed-view";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handledevLogin = () => {
        setEmail('dev@dev.com');
        setPassword('test');
    }

    const handleLogin = () => {
        console.log(email, password);
        if(email === '' || password === '') {
            alert('Email and password are required');
            return;
        }
        if(email.length < 3 || password.length < 3) {
            alert('Email and password must be at least 3 characters long');
            return;
        }
        axios({
            method: 'POST',
            url: 'https://test-devpush-app-luca-morgado.app.lucamorgado.com/login',
            data: {
                email: email,
                password: password,
            },
        })
        .then(async (response) => {
            console.log(response.headers.authorization.split(` `)[1]);
            const token = response.headers.authorization.split(` `)[1];
            await login(token);
            router.replace('/(tabs)');
        })
        .catch((error) => {
            console.log(error);
        }).finally(() => {
            console.log('finally');
        });
    }
    return (
        <ThemedView style={styles.inputContainer}>
            <InputCommon value={email} onChangeText={text => setEmail(text)} titleInput="Email" placeholder="Email" placeholderTextColor="#787676" autoCapitalize="none" />
            <InputCommon value={password} onChangeText={setPassword} titleInput="Password" placeholder="Password" placeholderTextColor="#787676" autoCapitalize="none" />
            <PrimaryButton title="Login" onPress={handleLogin} />
            {__DEV__ && <PrimaryButton title="Login dev" onPress={handledevLogin} />}
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        gap: 16,
        paddingHorizontal: 24,
    },
});


export default LoginForm;