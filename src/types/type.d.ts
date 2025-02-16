export interface OtherDog {
    other_dog_id: number;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    other_dog_image_url: string;
    rating: number;
}

export interface SignUpForm {
    name: string;
    email: string;
    password: string;
    gender: string;
    birthDay: string;
    birthMonth: string;
    birthYear: string;
    breed: string;
    image: string | null;
    activityLevel: number;
}

export interface MarkerData {
    latitude: number;
    longitude: number;
    id: number;
    title: string;
    profile_image_url: string;
    other_dog_image_url: string;
    rating: number;
    first_name: string;
    last_name: string;
    time?: number;
}

export type UpdateLocationParams = {
    latitude: number;
    longitude: number;
    clerkId: string;
  };

  export type Filters = Record<string, string>;

  export type UserLocation = {
    latitude: number;
    longitude: number;
    address: string;
  };

export interface MapProps {
    destinationLatitude?: number;
    destinationLongitude?: number;
    onOtherDogTimesCalculated?: (otherDogsWithTimes: MarkerData[]) => void;
    selectedOtherDog?: number | null;
    onMapReady?: () => void;
}

export interface Ride {
    origin_address: string;
    destination_address: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_latitude: number;
    destination_longitude: number;
    ride_time: number;
    other_dog_id: number;
    user_email: string;
    created_at: string;
    otherDog: {
        first_name: string;
        last_name: string;
    };
}

export interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "success" | "outline" | "orange";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

export interface GoogleInputProps {
    icon?: string;
    initialLocation?: string;
    containerStyle?: string;
    textInputBackgroundColor?: string;
    handlePress: (params: { latitude: number; longitude: number; address: string }) => void;
}

export interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

export interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    setUserLocation: (params: { latitude: number; longitude: number; address: string }) => void;
    setDestinationLocation: (params: { latitude: number; longitude: number; address: string }) => void;
}

export interface OtherDogStore {
    drivers: MarkerData[];
    selectedOtherDog: number | null;
    setSelectedOtherDog: (driverId: number) => void;
    setOtherDogs: (drivers: MarkerData[]) => void;
    clearSelectedOtherDog: () => void;
}

export interface OtherDogCardProps {
    item: MarkerData;
    selected: number;
    setSelected: () => void;
}