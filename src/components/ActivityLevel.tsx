import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActivityLevel = ({ activity }: { activity: number }) => {
  const getBarsAndText = (level: number) => {
    if (level <= 20) {
      return { bars: 1, text: 'Неактивний' };
    }
    if (level <= 40) {
      return { bars: 2, text: 'Мало активний' };
    }
    if (level <= 60) {
      return { bars: 3, text: 'Активний' };
    }
    if (level <= 80) {
      return { bars: 4, text: 'Активний' };
    }
    return { bars: 5, text: 'Дуже активний' };
  };

  const { bars, text } = getBarsAndText(activity);

  const barStyles = Array.from({ length: 5 }).map((_, index) => ({
    ...styles.bar,
    backgroundColor: index < bars ? 'black' : '#d3d3d3',
  }));

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {barStyles.map((style, index) => (
          <View key={index} style={style} />
        ))}
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  bar: {
    width: 8,
    height: 24,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ActivityLevel;
