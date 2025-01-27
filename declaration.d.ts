declare module 'react-native-dropdown-picker' {
  export interface DropdownPickerProps {
    items: { label: string, value: string }[];
    defaultValue: string;
    onChangeItem: (item: { label: string, value: string }) => void;
  }

  const DropdownPicker: React.ComponentType<DropdownPickerProps>;
  
  export default DropdownPicker;
}
