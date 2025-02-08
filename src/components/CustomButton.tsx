import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ButtonProps } from '../types/type';

const getBgVariantStyle = (variant: ButtonProps['bgVariant']) => {
  switch (variant) {
    case 'secondary':
      return styles.bgSecondary;
    case 'danger':
      return styles.bgDanger;
    case 'success':
      return styles.bgSuccess;
    case 'outline':
      return styles.bgOutline;
    case 'orange':
      return styles.bgOrange;
    default:
      return styles.bgPrimary;
  }
};

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
  switch (variant) {
    case 'primary':
      return styles.textPrimary;
    case 'secondary':
      return styles.textSecondary;
    case 'danger':
      return styles.textDanger;
    case 'success':
      return styles.textSuccess;
    default:
      return styles.textDefault;
  }
};

const convertClassNameToStyle = (className: string | undefined) => {
  if (!className) {
    return {};
  }
  const classArray = className.split(' ');
  let styleObj: any = {};

  classArray.forEach((cls) => {
    if (cls === 'w-full') {
      styleObj.width = '100%';
    }
    if (cls === 'rounded-full') {
      styleObj.borderRadius = 9999;
    }
    if (cls === 'p-3') {
      styleObj.padding = 12;
    }
    if (cls === 'flex') {
      styleObj.flexDirection = 'row';
    }
    if (cls === 'justify-center') {
      styleObj.justifyContent = 'center';
    }
    if (cls === 'items-center') {
      styleObj.alignItems = 'center';
    }
    if (cls === 'shadow-md') {
      styleObj.shadowOffset = { width: 0, height: 4 };
    }
    if (cls === 'shadow-neutral-400/70') {
      styleObj.shadowOpacity = 0.7;
    }
  });

  return styleObj;
};

const CustomButton = ({
  title,
  bgVariant = 'primary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getBgVariantStyle(bgVariant),
        convertClassNameToStyle(className),
      ]}
      {...props}
    >
      {IconLeft && <IconLeft />}
      <Text style={[styles.text, getTextVariantStyle(textVariant)]}>{title}</Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 9999,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 4.65,
    elevation: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bgPrimary: {
    backgroundColor: '#0286FF',
  },
  bgSecondary: {
    backgroundColor: '#6B7280',
  },
  bgDanger: {
    backgroundColor: '#EF4444',
  },
  bgSuccess: {
    backgroundColor: '#10B981',
  },
  bgOutline: {
    backgroundColor: 'transparent',
    borderColor: '#D1D5DB',
    borderWidth: 0.5,
  },
  bgOrange: {
    backgroundColor: '#FF6C22',
  },
  textPrimary: {
    color: '#000000',
  },
  textSecondary: {
    color: '#F3F4F6',
  },
  textDanger: {
    color: '#FECACA',
  },
  textSuccess: {
    color: '#D1FAE5',
  },
  textDefault: {
    color: '#FFFFFF',
  },
});

export default CustomButton;
