import { useState, useEffect } from "react";
import { Text, ScrollView, View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from "react-native";
import { icons } from "../../constants/svg";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { icons as indexIcons } from "../../constants/index";
import { useNavigation } from '@react-navigation/native';
import { useSignUp } from "@clerk/clerk-react";
import { parse, format } from 'date-fns';
import { StackNavigationProp } from '@react-navigation/stack';
import { uk } from 'date-fns/locale';
import { createUser } from "../../lib/api";
import InputField from "../../components/InputField";
import CustomDropDownPicker from "../../components/CustomDropDownPicker";
import { fetchDogBreeds } from "../../lib/fetchBreeds";
import BreedSelector from "../../components/BreedSelector";
import Slider from '@react-native-community/slider';
import { getServerUrl } from "../../utils/getServerUrl";
import { SignUpForm } from '../../types/type';

type AuthStackParamList = {
    Welcome: undefined;
    Home: undefined;
  };

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

const defaultForm: SignUpForm = {
    name: "",
    email: "",
    password: "",
    gender: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    breed: "",
    image: null,
    activityLevel: 50,
};


const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<SignUpForm>(defaultForm);

    const formatDate = (day: string, monthName: string, year: string): string => {
        const date = parse(`${day} ${monthName} ${year}`, 'd MMMM yyyy', new Date(), { locale: uk });
        return format(date, 'yyyy-MM-dd');
      };

    const [verification, setVerification] = useState<{ state: string; error: string; code: string }>({
        state: "default",
        error: "",
        code: "",
      });
    const [clerkId, setClerkId] = useState<string | null>(null); 
    const [openDayPicker, setOpenDayPicker] = useState(false);
    const [openMonthPicker, setOpenMonthPicker] = useState(false);
    const [openYearPicker, setOpenYearPicker] = useState(false);

    const onSignUpPress = async () => {
        if (!isLoaded || !signUp) return Alert.alert("Помилка", "Не вдалося ініціалізувати реєстрацію.");
        const { email, password } = form;
        
        if (!email || !password) return Alert.alert("Помилка", "Будь ласка, введіть емейл та пароль.");
        
        try {
          await signUp.create({ emailAddress: email, password });
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setVerification({ state: 'pending', error: '', code: '' });
          setStep(2);
        } catch (err: any) {
          Alert.alert('Помилка', err.errors?.[0]?.longMessage || 'Щось пішло не так');
        }
      };
      

      const onPressVerify = async () => {
        if (!isLoaded || !signUp) return Alert.alert("Помилка", "Не вдалося ініціалізувати реєстрацію.");
        const { code } = verification;
      
        if (!code.trim()) return Alert.alert("Помилка", "Будь ласка, введіть код підтвердження.");
      
        try {
          const { status, createdUserId, createdSessionId } = await signUp.attemptEmailAddressVerification({ code });
      
          if (status === 'complete') {
            if (createdUserId) {
              console.log("User ID from Clerk:", createdUserId);
              console.log("Session ID from Clerk:", createdSessionId);
              setClerkId(createdUserId);
              setStep(3);
            } else {
              Alert.alert("Помилка", "Clerk ID не доступний. Спробуйте ще раз.");
            }
          } else {
            setVerification(prev => ({ ...prev, error: 'Verification failed.', state: 'failed' }));
          }
        } catch (err: any) {
          setVerification(prev => ({ ...prev, error: err.errors?.[0]?.longMessage || 'Verification failed', state: 'failed' }));
        }
      };
      

    const onSubmitName = async () => {
        const { name, email, birthDay, birthMonth, birthYear, breed, activityLevel } = form;
    
        if (!name.trim()) return Alert.alert("Помилка", "Будь ласка, введіть своє ім'я.");
        if (![clerkId, email, name, birthDay, birthMonth, birthYear, breed, activityLevel].every(Boolean)) {
          return Alert.alert("Помилка", "Всі поля повинні бути заповнені");
        }
        if (!signUp || !setActive) return Alert.alert("Помилка", "Не вдалося завершити реєстрацію. Спробуйте пізніше");
    
        try {
          const formattedBirthDate = formatDate(birthDay, birthMonth, birthYear);
          const requestBody = {
            name,
            email,
            clerkId,
            gender: form.gender,
            birthDate: formattedBirthDate,
            breed,
            image: form.image || null,
            activityLevel,
          };
    
          console.log("Отправка данных:", JSON.stringify(requestBody));
          console.log("Server URL:", getServerUrl());
    
          const responseData = await createUser(requestBody);
          console.log("Response Data:", responseData);
    
          await setActive({ session: signUp.createdSessionId });
          Alert.alert("Успіх", "Реєстрація завершена");
    
          navigation.navigate('Home');
        } catch (err: any) {
          Alert.alert("Error", err.message || "Something went wrong");
        }
    };
    
      

    const renderDatePicker = () => {
        const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
        const months = [
            'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
            'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
        ];
        const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

       
    return (
        <View style={{ flexDirection: "row", justifyContent: "flex-start", marginLeft: 30, marginBottom: 24 }}>
          <View style={{ width: 105 }}>
            <CustomDropDownPicker
              open={openDayPicker}
              value={form.birthDay}
              items={days.map((day) => ({ label: day, value: day }))}
              setOpen={setOpenDayPicker}
              setValue={(callback) => setForm({ ...form, birthDay: callback(form.birthDay) })}
              placeholder="День"
            />
          </View>
  
          <View style={{ width: 150 }}>
            <CustomDropDownPicker
              open={openMonthPicker}
              value={form.birthMonth}
              items={months.map((month) => ({ label: month, value: month }))}
              setOpen={setOpenMonthPicker}
              setValue={(callback) => setForm({ ...form, birthMonth: callback(form.birthMonth) })}
              placeholder="Місяц"
            />
          </View>
  
          <View style={{ flex: 100 }}>
            <CustomDropDownPicker
              open={openYearPicker}
              value={form.birthYear}
              items={years.map((year) => ({ label: year, value: year }))}
              setOpen={setOpenYearPicker}
              setValue={(callback) => setForm({ ...form, birthYear: callback(form.birthYear) })}
              placeholder="Рік"
            />
          </View>
        </View>
      );
    };

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const takePhoto = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            cameraType: 'back',
            quality: 1,
            includeBase64: false,
            saveToPhotos: true,
        });
    
        if (result.didCancel || result.errorCode) {
            Alert.alert("Помилка", result.errorMessage || "Фото не було зроблено.");
            return;
        }
    
        if (result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            if (imageUri) {
                setSelectedImage(imageUri);
                setForm({ ...form, image: imageUri });
            } else {
                Alert.alert("Помилка", "Не вдалося отримати зображення.");
            }
        } else {
            Alert.alert("Помилка", "Фото не було отримано.");
        }
    };

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
        });
    
        if (result.didCancel || result.errorCode || !result.assets?.length) {
            Alert.alert("Помилка", result.errorMessage || "Зображення не було вибрано.");
            return;
        }
    
        const imageUri = result.assets[0].uri;
        if (imageUri) {
            setSelectedImage(imageUri);
            setForm({ ...form, image: imageUri });
        } else {
            Alert.alert("Помилка", "Не вдалося отримати URI зображення.");
        }
    };
    

    const [breeds, setBreeds] = useState<{ label: string; value: string }[]>([]);
    
    useEffect(() => {
        const fetchBreedsData = async () => {
            const fetchedBreeds = await fetchDogBreeds();
            setBreeds(fetchedBreeds.map((breed: string) => ({ label: breed, value: breed })));
        };
        fetchBreedsData();
    }, []);

    useEffect(() => {
        if (form.email) {
            console.log("Email updated:", form.email);
        }
    }, [form.email]);
    

    const [activityLevel, setActivityLevel] = useState(50);

    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between' }}>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
            
            <TouchableOpacity
                onPress={() => {
                    if (step === 1) {
                        navigation.navigate('Welcome');
                    } else if (step === 3) {
                        setStep(step - 2); 
                    } else {
                        setStep(step - 1); 
                    }
                }}
                style={{
                    position: 'absolute',
                    width: 36,
                    height: 64,
                    top: 68,
                    left: 45,
                    zIndex: 10
                }}
            >
                <icons.ArrowLeft width={36} height={64}/>
            </TouchableOpacity>
            {step === 1 && (
                <View style={{ padding: 5 }}>
                    <View style={{ position: 'relative', width: '100%', height: 250 }}>
                        <Text style={{
                            fontSize: 20,
                            color: 'black',
                            fontFamily: 'JakartaSemiBold',
                            position: 'absolute',
                            bottom: 5,
                            left: 5
                        }}>
                            Email пет-перента
                        </Text>
                    </View>
                    <InputField
                        label="Email"
                        placeholder="Введіть email"
                        icon={icons.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        autoComplete="email"
                        value={form.email}
                        onChangeText={(value: string) => {
                            if (value !== form.email) {
                                setForm({ ...form, email: value });
                            }
                        }}
                    />

                    <InputField
                        label="Password"
                        placeholder="Введіть пароль"
                        icon={icons.lock}
                        secureTextEntry
                        textContentType="password"
                        value={form.password}
                        onChangeText={(value: string) => {
                            if (value !== form.password) {
                                setForm({ ...form, password: value });
                            }
                        }}
                    />

                    <Text style={{ color: '#9ca3af', marginTop: 8 }}>
                        Чому у песиків все ще нема особистих...
                    </Text>
                </View>
                )}
                {step === 2 && (
                    <View style={{ padding: 5 }}>
                        <View style={{ position: 'relative', width: '100%', height: 250 }}>
                            <Text style={{
                                fontSize: 20,
                                color: 'black',
                                fontFamily: 'JakartaSemiBold',
                                position: 'absolute',
                                bottom: 5,
                                left: 5
                            }}>
                                Код із email
                            </Text>
                        </View>

                        <InputField
                            label="Kод підтвердження"
                            icon={icons.lock}
                            placeholder="123456"
                            value={verification.code}
                            keyboardType="numeric"
                            onChangeText={(code) => setVerification({ ...verification, code })}
                        />
                        <Text style={{ color: '#9ca3af', marginTop: 8 }}>
                            Будьте уважними, як ваш песик.
                        </Text>
                        {verification.error && (
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                {verification.error}
                            </Text>
                        )}
                    </View>
                )}
                {step === 3 && (
                    <View style={{ flex: 1, backgroundColor: "white" }}>
                        <View style={{ width: "100%", height: 250 }}>
                            <View style={{ position: "absolute", top: 129, left: 0, right: 0, justifyContent: "center", alignItems: "center" }}>
                                <icons.LogoIcon width={133} height={41} />
                            </View>
                        </View>
                        <View style={{ position: "absolute", top: 235, left: 0, right: 0, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 20, color: "black", fontFamily: "JakartaSemiBold", textAlign: "center", paddingHorizontal: 20 }}>
                                Ласкаво просимо до{"\n"}
                                <Text style={{ fontSize: 20, color: "black", fontFamily: "JakartaSemiBold" }}>Walkey!</Text>
                            </Text>
                        </View>
                        <View style={{ marginBottom: 33 }} />
                        <View style={{ padding: 20 }}>
                            {[
                                { text: "Будьте собою!", description: "Переконайтеся, що інформація про вашу собаку (вік, фото, біографія) є точною." },
                                { text: "Турбуйтеся про безпеку!", description: "Не діліться особистою інформацією занадто швидко." },
                                { text: "Соціалізуйтеся з повагою!", description: "Поважайте інших власників собак і не забувайте про гарну поведінку." },
                                { text: "Будьте уважними!", description: "Звітуйте про будь-які інциденти або небезпеки під час прогулянки." },
                            ].map((item, index) => (
                                <View key={index} style={{ marginBottom: 32, paddingLeft: 30, paddingRight: 40 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <icons.PawIcon width={24} height={24} style={{ marginRight: 8 }} />
                                        <Text style={{ fontSize: 18, fontFamily: "JakartaSemiBold" }}>{item.text}</Text>
                                    </View>
                                    <View style={{ paddingLeft: 32 }}>
                                        <Text style={{ color: "#6B7280", marginTop: 8 }}>{item.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
             {step === 4 && (
                <View style={{ padding: 20 }}>
                    <View style={{ position: "relative", width: "100%", height: 250 }}>
                        <Text style={{ fontSize: 20, color: "black", fontFamily: "JakartaSemiBold", position: "absolute", bottom: 20, left: 20 }}>
                            Як звати вашого песика?
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: 8 }}>
                        <InputField
                            label="Мого песика звати..."
                            placeholder="Байт"
                            icon={indexIcons.person}
                            value={form.name}
                            onChangeText={(value: string) => setForm({ ...form, name: value })}
                        />
                        <Text style={{ color: "#9CA3AF", marginTop: 8 }}>
                            Це ім'я буде видно іншим користувачам і його не можна буде змінити.
                        </Text>
                    </View>
                </View>
            )}
            {step === 5 && (
                <View style={{ padding: 20 }}>
                    <View style={{ position: "relative", width: "100%", height: 250 }}>
                        <Text style={{ fontSize: 20, color: "black", fontFamily: "JakartaSemiBold", position: "absolute", bottom: 20, left: 20 }}>
                            І {form.name} - це...
                        </Text>
                    </View>

                    <Text style={{ color: "#9CA3AF", marginLeft: 20, marginTop: 8, marginBottom: 84 }}>
                        За біологічною інформацією в паспорті, не за гендероном.
                    </Text>

                    <View style={{ alignItems: "center" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 84 }}>
                            <View style={{ alignItems: "center" }}>
                                <TouchableOpacity
                                    onPress={() => setForm({ ...form, gender: "male" })}
                                    style={{
                                        width: 93,
                                        height: 93,
                                        padding: 20,
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderColor: form.gender === "male" ? "#FF6C22" : "#9A9999",
                                        backgroundColor: form.gender === "male" ? "#FFE5D8" : "transparent",
                                    }}
                                >
                                    <icons.MaleIcon
                                        width={37}
                                        height={37}
                                        color={form.gender === "male" ? "#FF6C22" : "#9A9999"}
                                    />
                                </TouchableOpacity>
                                <Text style={{ marginTop: 8 }}>Хлопчик</Text>
                            </View>

                            <View style={{ width: 53 }} />

                            <View style={{ alignItems: "center" }}>
                                <TouchableOpacity
                                    onPress={() => setForm({ ...form, gender: "female" })}
                                    style={{
                                        width: 93,
                                        height: 93,
                                        padding: 20,
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderColor: form.gender === "female" ? "#FF6C22" : "#9A9999",
                                        backgroundColor: form.gender === "female" ? "#FFE5D8" : "transparent",
                                    }}
                                >
                                    <icons.FemaleIcon
                                        width={37}
                                        height={37}
                                        color={form.gender === "female" ? "#FF6C22" : "#9A9999"}
                                    />
                                </TouchableOpacity>
                                <Text style={{ marginTop: 8 }}>Дівчинка</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
            {step === 6 && (
                <View style={{ padding: 20, marginTop: 183, marginBottom: 24 }}>
                    <Text style={{ fontSize: 20, color: "black", fontFamily: "JakartaSemiBold" }}>
                        {form.gender === "male" ? `Коли ${form.name} народився?` : `Коли ${form.name} народилася?`}
                    </Text>
                    <View style={{ padding: 20 }} />
                    {renderDatePicker()}
                </View>
            )}
            {step === 7 && (
                <View style={{ padding: 20 }}>
                    <View style={{ padding: 20, marginTop: 183, marginBottom: 24 }}>
                        <Text style={{ fontSize: 20, color: "black", fontFamily: "JakartaSemiBold" }}>
                            Покажіть вашого песика {form.name}
                        </Text>
                        <Text style={{ color: "#9CA3AF", marginTop: 8 }}>
                            Це фото будуть бачити інші песики. Ви зможете будь-коли його змінити.
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 40 }}>
                            <TouchableOpacity
                                onPress={takePhoto}
                                style={{
                                    width: 138,
                                    height: 121,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: "#FF6C22",
                                    backgroundColor: "#FFE5D8",
                                }}
                            >
                                <icons.CameraIcon width={30} height={30} color="#FF6C22" />
                                <Text style={{ marginTop: 12, color: "#FF6C22" }}>Зробити фото</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={pickImage}
                                style={{
                                    width: 138,
                                    height: 121,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: "#D3D3D3",
                                    backgroundColor: "#F5F5F5",
                                }}
                            >
                                <icons.PhotoIcon width={20} height={20} color="#D3D3D3" />
                                <Text style={{ marginTop: 20, color: "#D3D3D3" }}>Вибрати фото</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedImage && (
                            <View style={{ marginTop: 40, alignItems: "center" }}>
                                <Text style={{ fontSize: 18 }}>Вибране фото:</Text>
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{ width: 200, height: 200, borderRadius: 8 }}
                                />
                            </View>
                        )}
                    </View>
                </View>
            )}
            {step === 8 && (
                <View style={{ padding: 20 }}>
                    <View style={{ padding: 20, marginTop: 183, marginBottom: 24 }}>
                        <Text style={{ fontSize: 20, color: "black", fontFamily: "JakartaSemiBold", marginBottom: 8 }}>
                            Яка порода {form.name}?
                        </Text>
                        <Text style={{ color: "#9CA3AF" }}>
                            Виберіть породу вашого улюбленця для підбору найбільш відповідних друзів.
                        </Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: "500", color: "black", marginBottom: 16 }}>
                        Порода
                    </Text>

                    <View>
                        <BreedSelector
                            items={breeds}
                            placeholder="Мопс"
                            value={form.breed}
                            onChangeValue={(value) => setForm({ ...form, breed: value })}
                        />
                    </View>
                </View>
            )}
            {step === 9 && (
                <View style={{ padding: 20 }}>
                    <View style={{ padding: 20, marginTop: 183, marginBottom: 24 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
                            Який рівень активності {form.name}?
                        </Text>
                        <Text style={{ color: "#9CA3AF", marginBottom: 32 }}>
                            Це допоможе в пошуку найкращих друзів.
                        </Text>
                    </View>

                    <View style={{ alignItems: "center" }}>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={activityLevel}
                            minimumTrackTintColor="#FF6C22"
                            maximumTrackTintColor="#E5E5E5"
                            thumbTintColor="#FF6C22"
                            onValueChange={(value) => setActivityLevel(value)}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 16 }}>
                            <Text style={{ color: "#9CA3AF" }}>Дуже низький</Text>
                            <Text style={{ color: "#9CA3AF" }}>Дуже високий</Text>
                        </View>
                    </View>
                </View>
            )}
            </ScrollView>
            </KeyboardAvoidingView>
                {step === 1 && (
                    <TouchableOpacity
                        onPress={onSignUpPress}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Продовжити</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                           
                        </View>
                    </TouchableOpacity>
                )}
                {step === 2 && (
                    <TouchableOpacity
                        onPress={onPressVerify}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Продовжити</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                           
                        </View>
                    </TouchableOpacity>
                )}
                {step === 3 && (
                    <TouchableOpacity
                        onPress={() => setStep(4)}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Продовжити</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                            
                        </View>
                    </TouchableOpacity>
                )}
                {step === 4 && (
                    <TouchableOpacity
                        onPress={() => setStep(5)}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Продовжити</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                           
                        </View>
                    </TouchableOpacity>
                )}
                {step === 5 && (
                    <TouchableOpacity
                        onPress={() => setStep(6)}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Продовжити</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                            
                        </View>
                    </TouchableOpacity>
                )}
                {step === 6 && (
                    <TouchableOpacity
                        onPress={() => setStep(7)}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Продовжити</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                            
                        </View>
                    </TouchableOpacity>
                )}
                {step === 7 && (
                    <TouchableOpacity
                        onPress={() => {
                            if (!form.image) {
                                Alert.alert("Помилка", "Будь ласка, виберіть або зробіть фото вашого песика.");
                            } else {
                                setStep(8);
                            }
                        }}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Продовжити</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                           
                        </View>
                    </TouchableOpacity>
                )}
                {step === 8 && (
                    <TouchableOpacity
                        onPress={() => setStep(9)}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Продовжити</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                           
                        </View>
                    </TouchableOpacity>
                )}
                {step === 9 && (
                    <TouchableOpacity
                        onPress={onSubmitName}
                        style={{
                            position: "absolute",
                            bottom: 35,
                            left: 20,
                            right: 20,
                            backgroundColor: "#FF6C22",
                            borderRadius: 50,
                            paddingVertical: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontFamily: "JakartaSemiBold" }}>Надіслати</Text>
                        <View style={{ position: "absolute", right: 20 }}>
                        
                        </View>
                    </TouchableOpacity>
                )}
        </View>
    );
};

export default SignUp;
