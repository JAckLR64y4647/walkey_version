import React from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { images } from "../../constants/index";

type AuthStackParamList = {
  "SignUp": undefined;
  "SignIn": undefined;
};

const Onboarding = () => {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={images.welcomeLogo} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Ласкаво просимо до Walkey!</Text>
                <Text style={styles.subtitle}>
                    Усе для щасливих і безпечних прогулянок з вашим песиком.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate("SignUp")}
                >
                    <Text style={styles.primaryButtonText}>Почати</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate("SignIn")}
                >
                    <Text style={styles.secondaryButtonText}>Увійти</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
    },
    logoContainer: {
        marginTop: 92,
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 44,
        marginBottom: 6,
    },
    title: {
        color: "#000",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        color: "#6b7280",
        fontSize: 16,
        marginTop: 8,
        textAlign: "center",
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: 44,
        marginBottom: 70,
    },
    primaryButton: {
        backgroundColor: "#FF6C22",
        borderRadius: 30,
        paddingVertical: 16,
        marginBottom: 16,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    secondaryButton: {
        backgroundColor: "#FFE5D8",
        borderRadius: 30,
        paddingVertical: 16,
    },
    secondaryButtonText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default Onboarding;
