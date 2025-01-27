import { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from '../../components/InputField';
import { useSignIn } from "@clerk/clerk-react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { icons } from "../../constants/svg";

type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
};

type SignInNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SignIn = () => {
  const { signIn } = useSignIn() || {};
  const navigation = useNavigation<SignInNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password || !signIn) {
      Alert.alert("Помилка", email && password ? "Неможливо авторизуватися. Попробуйте ще раз." : "Будь ласка, введіть email та пароль.");
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await signIn.create({ identifier: email, password });
      Alert.alert(result.status === "complete" ? "Успіх" : "Помилка", result.status === "complete" ? "Вхід виконано успішно." : "Невірні дані для входу.");
      if (result.status === "complete") navigation.navigate('Home');
    } catch {
      Alert.alert("Помилка", "Щось пішло не так. Перевірте ваші дані.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '600', color: 'black', marginBottom: 20 }}>
          Вхід
        </Text>

        <InputField
          label="Email"
          placeholder="Введіть email"
          icon={icons.email}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />

        <InputField
          label="Пароль"
          placeholder="Введіть пароль"
          icon={icons.lock}
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleSignIn}
          style={{
            marginTop: 20,
            backgroundColor: '#FF6C22',
            borderRadius: 50,
            paddingVertical: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          disabled={loading}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
            {loading ? "Завантаження..." : "Увійти"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={{ marginTop: 20, alignItems: 'center' }}
        >
          <Text style={{ color: '#FF6C22', fontSize: 18, fontWeight: '600' }}>
            Зареєструватися
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
