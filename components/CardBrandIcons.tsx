import React from "react";
import { View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

function VisaMark() {
  return (
    <Svg width={28} height={18} viewBox="0 0 28 18">
      <Path d="M0 2a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2Z" fill="#1A1F71" />
      <Path
        d="M11.5 12.3H9.7l1.13-6.6h1.8l-1.13 6.6Zm7.35-6.45a4.6 4.6 0 0 0-1.63-.28c-1.8 0-3.06.9-3.07 2.2 0 .96.9 1.5 1.6 1.82.71.33.95.54.95.83 0 .45-.57.66-1.1.66-.73 0-1.13-.1-1.73-.36l-.24-.11-.26 1.53c.42.18 1.2.34 2 .35 1.9 0 3.15-.89 3.16-2.28 0-.76-.48-1.34-1.55-1.82-.65-.31-1.04-.51-1.04-.83 0-.28.34-.58 1.06-.58.6-.01 1.04.12 1.38.25l.17.08.25-1.46Zm4.34-.15h-1.4c-.43 0-.76.12-.95.55l-2.68 6.05h1.9l.38-.99h2.32l.22.99h1.68l-1.47-6.6Zm-2.24 4.27.72-1.85c-.01.02.15-.38.24-.63l.12.57.42 1.9h-1.5ZM7.9 5.7l-1.76 4.5-.19-.92C5.61 8 4.46 6.72 3.17 6.06l1.6 6.24h1.92l2.87-6.6H7.9Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function MastercardMark() {
  return (
    <Svg width={28} height={18} viewBox="0 0 28 18">
      <Path d="M0 2a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2Z" fill="#F7F7F7" />
      <Circle cx="11" cy="9" r="5.2" fill="#EB001B" />
      <Circle cx="17" cy="9" r="5.2" fill="#F79E1B" fillOpacity={0.9} />
    </Svg>
  );
}

export default function CardBrandIcons() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <VisaMark />
      <MastercardMark />
    </View>
  );
}
