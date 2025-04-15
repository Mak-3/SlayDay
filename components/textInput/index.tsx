import { CrimsonLuxe } from "@/constants/Colors";
import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";

interface CustomTextInputProps {
  name: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  required?: boolean;
  showError?: boolean;
  [key: string]: any;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  name,
  value,
  onChangeText,
  placeholder,
  required,
  showError = false,
  ...rest
}) => {
  const [isFocussed, setIsFocussed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showError && required && !value.trim()) {
      setError(`${name} is important`);
    } else {
      setError("");
    }
  }, [showError, required, value]);

  const handleBlur = () => {
    setIsFocussed(false);
    if (required && !value.trim()) {
      setError("This field is important");
    } else {
      setError("");
    }
  };

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          if (required && text.trim()) {
            setError("");
          }
        }}
        placeholder={placeholder}
        style={[
          styles.input,
          isFocussed && styles.focusedInput,
          error && styles.errorInput,
        ]}
        onFocus={() => setIsFocussed(true)}
        onBlur={handleBlur}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
    height: 48,
    justifyContent: "center",
    paddingVertical: 14,
    marginVertical: 5,
  },
  focusedInput: {
    backgroundColor: CrimsonLuxe.primary100,
    borderColor: CrimsonLuxe.primary300,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 4,
  },
});

export default CustomTextInput;