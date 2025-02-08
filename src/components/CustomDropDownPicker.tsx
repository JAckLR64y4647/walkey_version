import React, { useState, useEffect } from "react";
import DropDownPicker from 'react-native-dropdown-picker';

type ItemType<T extends string | number | boolean> = { label: string; value: T };

type CustomDropDownPickerProps<T extends string | number | boolean> = {
  items: ItemType<T>[];
  placeholder?: string;
  searchable?: boolean;
};

const CustomDropDownPicker = <T extends string | number | boolean>({
  items,
  placeholder = "Выберите значение",
  searchable = false,
}: CustomDropDownPickerProps<T>) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const formattedItems = items.map((item) => ({
      label: item.label,
      value: String(item.value), // Преобразуем value в строку
    }));
    setFilteredItems(formattedItems);
  }, [items]);

  useEffect(() => {
    if (searchable) {
      const lowerCaseInput = inputValue.toLowerCase();
      setFilteredItems((prevItems) =>
        prevItems.filter((item) => item.label.toLowerCase().includes(lowerCaseInput))
      );
    }
  }, [inputValue, searchable]);

  return (
    <DropDownPicker
      open={open}
      value={selectedValue}
      items={filteredItems}
      setOpen={setOpen}
      setValue={setSelectedValue}
      onChangeValue={(value) => setSelectedValue(value)}
      placeholder={placeholder}
      searchable={searchable}
      searchPlaceholder="Поиск..."
      onChangeSearchText={searchable ? setInputValue : undefined}
      maxHeight={200}
      style={{
        backgroundColor: "transparent",
        borderColor: "transparent",
        paddingHorizontal: 10,
        borderWidth: 0,
      }}
      placeholderStyle={{
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "left",
      }}
      textStyle={{
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
      }}
      dropDownContainerStyle={{
        borderWidth: 0,
        backgroundColor: "white",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
      }}
      listItemLabelStyle={{
        fontSize: 18,
        fontWeight: "400",
        paddingVertical: 10,
      }}
      selectedItemContainerStyle={{
        backgroundColor: "#f0f0f0",
      }}
      arrowIconStyle={{
        width: 20,
        height: 20,
      }}
      arrowIconContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
      showTickIcon={false}
    />
  );
};

export default CustomDropDownPicker;
