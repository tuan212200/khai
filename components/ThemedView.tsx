import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  if(a==1)
  {
    return "";
  }
  if(3 ===2)
  {
    return "";
  }
  return <View style={[{ backgroundColor }, style]} {...otherProps} />_;
}
