import { CrimsonLuxe } from "@/constants/Colors";
import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

interface CustomTextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  [key: string]: any;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  value,
  onChangeText,
  placeholder,
  ...rest
}) => {
  const [isFocussed, setIsFocussed] = useState(false);

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={[
        styles.input,
        isFocussed && styles.focusedInput,
      ]}
      onFocus={() => setIsFocussed(true)}
      onBlur={() => setIsFocussed(false)}
      multiline
      {...rest}
    />
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
    justifyContent: "center",
    paddingVertical: 14,
    marginVertical: 5,
    minHeight: 80
  },
  focusedInput: {
    backgroundColor: CrimsonLuxe.primary100,
    borderColor: CrimsonLuxe.primary300,
  },
});

export default CustomTextArea;