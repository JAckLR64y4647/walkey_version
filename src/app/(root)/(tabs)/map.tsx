import { View, Switch, Text, Button, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { icons } from "../../../constants/svg";
import Geolocation from "react-native-geolocation-service";
import NetInfo from "@react-native-community/netinfo";
import { Linking } from "react-native";
import { useLocationStore } from "../../../store/index";
import { useUser } from "@clerk/clerk-react";
import FilterModal from "../../../app/(root)/(modal)/FilterModal";
import DogProfileModal from "../../../app/(root)/(modal)/DogProfile";
import { updateLocation, fetchOtherUsersLocations } from "../../../lib/api";
import { Filters } from "../../../types/type";

const Map = () => {
  const { setUserLocation } = useLocationStore();
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const { user } = useUser();
  const [userName, setUserName] = useState<string>("Байт");
  const [isLoading, setLoading] = useState<boolean>(true);
  const [otherUsersLocations, setOtherUsersLocations] = useState<any[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({});
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  const [selectedDog, setSelectedDog] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const SERVER_URL = "https://799d-93-200-239-96.ngrok-free.app";

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const closeDogProfile = () => {
    setSelectedDog(null);
    setIsModalVisible(false);
  };

  const applyFilters = async () => {
    toggleFilterModal();
    if (user && user.id) {
      const filteredUsers = await fetchOtherUsersLocations(user.id, filters);
      if (filteredUsers.length === 0) {
        Alert.alert("Результатов не найдено", "Попробуйте изменить фильтры");
        setOtherUsersLocations([]);
      } else {
        setOtherUsersLocations(filteredUsers);
        setFiltersApplied(true);
      }
    }
  };

  const resetFilters = async () => {
    setFilters({});
    setFiltersApplied(false);

    if (user && user.id) {
      try {
        const response = await fetch(`${SERVER_URL}/api/users/locations?clerkId=${user.id}`);
        const data = await response.json();
        setOtherUsersLocations(data);
      } catch (error) {
        console.error("Ошибка при сбросе фильтров:", error);
        Alert.alert("Ошибка", "Не удалось сбросить фильтры");
      }
    }
  };

  const toggleSwitch = () => setIsToggled(!isToggled);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) return;

      try {
        const response = await fetch(`${SERVER_URL}/api/user?clerkId=${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setUserName(data.name);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const toggleConnectionListener = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    toggleConnectionListener();
    if (!isConnected) return;
  
    (async () => {
      try {
        const hasPermission = await Geolocation.requestAuthorization('whenInUse'); // Specify authorization level
        if (hasPermission !== 'granted') {
          setErrorMsg("Доступ до розташування було відхилено");
          return;
        }
  
        Geolocation.getCurrentPosition(
          async (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: "Ваша адреса",
            });
  
            if (user && position.coords.latitude && position.coords.longitude) {
              await updateLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, clerkId: user.id });
            }
  
            if (user && user.id) {
              const locations = await fetchOtherUsersLocations(user.id);
              setOtherUsersLocations(locations);
            }
          },
          (error) => {
            console.error("Помилка при отриманні розташування", error);
            setErrorMsg("Помилка при отриманні розташування");
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (error) {
        console.error("Помилка при отриманні розташування", error);
        setErrorMsg("Помилка при отриманні розташування");
      }
    })();
  }, [setUserLocation, isConnected]);

  if (errorMsg) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Text>{errorMsg}</Text>
        <Button title="Відкрити налаштування" onPress={() => Linking.openSettings()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
        <icons.WalkeyIcon width={22} height={22} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
          <Text style={{ fontSize: 14, fontWeight: '600' }}>{userName} зараз </Text>
          <View style={{ position: 'relative' }}>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>{isToggled ? 'гуляє' : 'вдома'}</Text>
            <View style={{ position: 'absolute', left: 0, right: 0, backgroundColor: 'black', height: 2, bottom: -1 }} />
          </View>
          <Switch
            value={isToggled}
            onValueChange={toggleSwitch}
            thumbColor={isToggled ? "#F15F15" : "#f4f3f4"}
            trackColor={{ false: "#FED9C6", true: "#FED9C6" }}
            style={{ marginRight: 12, transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={toggleFilterModal}
        style={{
          position: 'absolute', backgroundColor: 'white', borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.2, width: 180,
          top: 150, right: 35, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        }}
      >
        <icons.FilterIcon width={24} height={24} style={{ paddingRight: 8 }} />
        <Text style={{ textAlign: 'center', color: 'black', fontSize: 14, paddingLeft: 8 }}>Фільтрувати</Text>
      </TouchableOpacity>

      {filtersApplied && (
        <TouchableOpacity
          onPress={resetFilters}
          style={{
            position: 'absolute', backgroundColor: '#F15F15', borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.2, width: 180, height: 35,
            top: 200, right: 35, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          }}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 14 }}>Скинути фільтри</Text>
        </TouchableOpacity>
      )}

      <FilterModal
        visible={filterModalVisible}
        toggleFilterModal={toggleFilterModal}
        applyFilters={applyFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
      />

      <DogProfileModal
        isVisible={isModalVisible}
        onClose={closeDogProfile}
        dog={selectedDog}
      />
    </SafeAreaView>
  );
};

export default Map;
