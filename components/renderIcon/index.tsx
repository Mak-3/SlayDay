import React from "react";
import { 
  FontAwesome, 
  FontAwesome5, 
  MaterialCommunityIcons, 
  MaterialIcons, 
  Feather 
} from "@expo/vector-icons";
import { getIcon } from "@/constants/IconsMapping";

export const renderIcon = (category: string, overrideColor?: string) => {
  const { icon, library, color } = getIcon[category] || getIcon["Other"];
  const iconColor = overrideColor || color;

  const iconProps = { size: 24, color: iconColor };

  switch (library) {
    case "FontAwesome":
      return <FontAwesome name={icon as any} {...iconProps} />;
    case "FontAwesome5":
      return <FontAwesome5 name={icon as any} {...iconProps} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={icon as any} {...iconProps} />;
    case "MaterialIcons":
      return <MaterialIcons name={icon as any} {...iconProps} />;
    case "Feather":
      return <Feather name={icon as any} {...iconProps} />;
    default:
      return <MaterialIcons name="help" {...iconProps} />;
  }
};
