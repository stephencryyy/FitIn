import { Tabs , useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useT } from '@/src/hooks/useT';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useWorkoutStore } from '@/src/store/workoutStore';

export default function TabLayout() {
  const router = useRouter();
  const t = useT();
  const locale = useSettingsStore((s) => s.locale);
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
  const pathname = usePathname();

  const isActiveWorkoutScreen = pathname?.includes('/workouts/active');
  const showFab = !activeWorkout && !isActiveWorkoutScreen;

  // TODO(dark-mode): tabBarStyle uses static colors via expo-router's screenOptions
  // (it doesn't run through NativeWind's className resolver), so dark variants
  // for the floating tab bar need an explicit `useColorScheme()` swap. Left as
  // a follow-up — covered by the dark mode foundation pass.
  return (
    <View className="flex-1 bg-dark-50 dark:bg-dark-900">
      <Tabs
        key={locale}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#607085',
          tabBarStyle: {
            position: 'absolute',
            bottom: 12,
            left: 16,
            right: 16,
            backgroundColor: 'rgba(255,255,255,0.92)',
            borderTopWidth: 0,
            borderRadius: 28,
            paddingBottom: 0,
            paddingTop: 0,
            height: 72,
            borderWidth: 1,
            borderColor: '#d8e3ee',
            shadowColor: '#1e3a5a',
            shadowOffset: { width: 0, height: 18 },
            shadowOpacity: 0.1,
            shadowRadius: 40,
            elevation: 12,
          },
          tabBarItemStyle: {
            borderRadius: 20,
            marginHorizontal: 3,
            marginVertical: 6,
            paddingVertical: 8,
          },
          tabBarActiveBackgroundColor: '#132338',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '800',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            title: t('tabs.workouts'),
            tabBarIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="nutrition"
          options={{
            title: t('tabs.nutrition'),
            tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: t('tabs.social'),
            tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('tabs.profile'),
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          }}
        />
      </Tabs>

      {showFab && (
        <TouchableOpacity
          onPress={() => router.push('/assistant')}
          className="absolute bottom-24 right-5 w-14 h-14 rounded-full items-center justify-center overflow-hidden"
          style={{
            shadowColor: '#ff6b3d',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 10,
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#ff815e', '#ff6b3d', '#ff8d62']}
            className="w-full h-full items-center justify-center"
          >
            <Ionicons name="sparkles" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}
