import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useState } from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  icon?: JSX.Element | number;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  textContentType?: TextInput["props"]["textContentType"];
  keyboardType?: TextInput["props"]["keyboardType"];
  autoCapitalize?: TextInput["props"]["autoCapitalize"];
  autoComplete?: TextInput["props"]["autoComplete"];
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  textContentType,
  keyboardType,
  autoCapitalize,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <KeyboardAvoidingView behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>

          <View
            style={[
              styles.inputContainer,
              isFocused ? styles.inputFocused : styles.inputDefault,
            ]}
          >
            {icon && typeof icon === "number" ? (
              <Image source={icon} style={styles.icon} />
            ) : (
              icon
            )}

            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              autoComplete={autoComplete}
              textContentType={textContentType}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              selectionColor="black"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  inputDefault: {
    borderColor: "#f3f3f3",
  },
  inputFocused: {
    borderColor: "#000",
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
    fontWeight: "600",
    textAlign: "left",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
});

export default InputField;

