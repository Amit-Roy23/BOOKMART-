import React, { memo, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "@/constants/colors";
import { rem } from "@/utils/responsive";
import { styles } from "./CustomTabBar.style";

export interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

interface AnimatedTabItemProps {
  route: any;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
}

// Fluid bubble spring configuration (buoyant and smooth)
const BUBBLE_SPRING = {
  damping: 14,
  stiffness: 145,
  mass: 0.75,
};

const BUBBLE_WOBBLE = {
  damping: 10,
  stiffness: 160,
  mass: 0.6,
};

const AnimatedTabItem: React.FC<AnimatedTabItemProps> = memo(
  ({ route, isFocused, options, onPress, onLongPress }) => {
    const scale = useSharedValue(isFocused ? 1.14 : 1.0);
    const pressedScale = useSharedValue(1.0);

    useEffect(() => {
      if (isFocused) {
        // Soft bubble pop & float
        scale.value = withSequence(
          withTiming(0.9, { duration: 70, easing: Easing.out(Easing.quad) }),
          withSpring(1.2, BUBBLE_WOBBLE),
          withSpring(1.14, BUBBLE_SPRING)
        );
      } else {
        scale.value = withSpring(1.0, BUBBLE_SPRING);
      }
    }, [isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value * pressedScale.value }],
    }));

    const handlePressIn = () => {
      pressedScale.value = withTiming(0.86, { duration: 70, easing: Easing.out(Easing.quad) });
    };

    const handlePressOut = () => {
      pressedScale.value = withSpring(1.0, BUBBLE_SPRING);
    };

    // Determine icon name based on route
    let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
    const normalizedRouteName = route.name.toLowerCase();
    if (normalizedRouteName === "home") {
      iconName = isFocused ? "home" : "home-outline";
    } else if (normalizedRouteName === "create") {
      iconName = isFocused ? "add-circle" : "add-circle-outline";
    } else if (normalizedRouteName === "analytics") {
      iconName = isFocused ? "bar-chart" : "bar-chart-outline";
    } else if (normalizedRouteName === "profile") {
      iconName = isFocused ? "person" : "person-outline";
    }

    const color = isFocused ? COLORS.primary : COLORS.textMuted;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID || (options as any).tabBarTestID}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.tabItem}
      >
        <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
          <Ionicons name={iconName} size={rem(1.5)} color={color} />
        </Animated.View>
      </Pressable>
    );
  }
);

const CustomTabBar: React.FC<CustomTabBarProps> = memo(({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const previousIndex = useRef<number>(state.index);

  const bottomMargin = insets.bottom > 0 ? insets.bottom + rem(1.25) : rem(1.0);
  const routeCount = state.routes.length;
  const tabWidth = containerWidth > 0 ? containerWidth / routeCount : 0;
  const pillWidth = tabWidth > 0 ? Math.min(tabWidth * 0.82, rem(3.4)) : 0;

  const pillTranslateX = useSharedValue(0);
  const pillScaleX = useSharedValue(1.0);
  const pillScaleY = useSharedValue(1.0);

  useEffect(() => {
    if (tabWidth > 0) {
      const targetX = state.index * tabWidth + (tabWidth - pillWidth) / 2;
      const indexDiff = Math.abs(state.index - previousIndex.current);

      if (indexDiff > 0) {
        // Liquid bubble stretch & squash morphing
        const stretchAmount = Math.min(1.0 + indexDiff * 0.16, 1.42);
        const squashAmount = Math.max(1.0 - indexDiff * 0.09, 0.78);

        // Fluid bubble glide
        pillTranslateX.value = withSpring(targetX, BUBBLE_SPRING);

        // Jelly elongation during transit, followed by a soft buoyant rebound
        pillScaleX.value = withSequence(
          withTiming(stretchAmount, { duration: 130, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withSpring(0.93, BUBBLE_WOBBLE),
          withSpring(1.0, BUBBLE_SPRING)
        );

        pillScaleY.value = withSequence(
          withTiming(squashAmount, { duration: 130, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withSpring(1.1, BUBBLE_WOBBLE),
          withSpring(1.0, BUBBLE_SPRING)
        );

        previousIndex.current = state.index;
      } else {
        pillTranslateX.value = withSpring(targetX, BUBBLE_SPRING);
      }
    }
  }, [state.index, tabWidth, pillWidth]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: pillTranslateX.value },
      { scaleX: pillScaleX.value },
      { scaleY: pillScaleY.value },
    ],
    width: pillWidth > 0 ? pillWidth : 0,
    opacity: pillWidth > 0 ? 1 : 0,
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && Math.abs(width - containerWidth) > 1) {
      setContainerWidth(width);
      const initialTabWidth = width / routeCount;
      const initialPillWidth = Math.min(initialTabWidth * 0.82, rem(3.4));
      pillTranslateX.value = state.index * initialTabWidth + (initialTabWidth - initialPillWidth) / 2;
    }
  };

  return (
    <View onLayout={onLayout} style={[styles.container, { bottom: bottomMargin }]}>
      {/* Liquid Shifting Bubble */}
      <Animated.View style={[styles.slidingPill, animatedPillStyle]} />

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <AnimatedTabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            options={options}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
});

export default CustomTabBar;
