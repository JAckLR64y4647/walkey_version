import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { icons } from "../constants/svg";

const HeaderBar = ({
  userName,
  isToggled,
  toggleSwitch,
}: {
  userName: string;
  isToggled: boolean;
  toggleSwitch: () => void;
}) => {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <icons.WalkeyIcon width={24} height={24} />
      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto" }}>
        <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: "600" }}>
          {userName} зараз{' '}
        </Text>
        <View style={{ position: "relative" }}>
          <Text style={{ fontSize: 14, fontWeight: "600" }}>
            {isToggled ? 'гуляє' : 'вдома'}
          </Text>
          <View style={{ position: "absolute", left: 0, right: 0, backgroundColor: "black", height: 2, bottom: -1 }} />
        </View>
        <Switch
          value={isToggled}
          onValueChange={toggleSwitch}
          thumbColor={isToggled ? '#F15F15' : '#f4f3f4'}
          trackColor={{ false: '#FED9C6', true: '#FED9C6' }}
          style={{ marginRight: 12, transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
        <TouchableOpacity
          onPress={() => {
            console.log('Bell icon clicked');
            navigation.navigate('HomeNotificationModal');
          }}
        >
          <icons.BellIcon width={22} height={22} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderBar;
