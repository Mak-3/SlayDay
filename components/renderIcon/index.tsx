import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { getIcon } from "@/constants/IconsMapping";

export const renderIcon = (category: string, overrideColor?: string) => {
  const { icon, library, color } = getIcon[category] || getIcon["Other"];
  const iconColor = overrideColor || color;

  const iconProps = { name: icon, size: 24, color: iconColor };

  switch (library) {
    case "FontAwesome":
      return <FontAwesome {...iconProps} />;
    case "FontAwesome5":
      return <FontAwesome5 {...iconProps} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons {...iconProps} />;
    case "MaterialIcons":
      return <MaterialIcons {...iconProps} />;
    case "Feather":
      return <Feather {...iconProps} />;
    default:
      return <MaterialIcons name="help" size={24} color={iconColor} />;
  }
};