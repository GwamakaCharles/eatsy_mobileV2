/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import { token } from "../apollo";
import Login from "../screens/Login";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<RootNavigator />
		</NavigationContainer>
	);
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{token == null ? (
				// No token found, user isn't signed in
				<Stack.Screen
					name="LogIn"
					component={Login}
					options={{
						title: "Sign in",
						// When logging out, a pop animation feels intuitive
						// You can remove this if you want the default 'push' animation
						// animationTypeForReplace: state.isSignout ? "pop" : "push",
					}}
				/>
			) : (
				// User is signed in
				<>
					<Stack.Screen name="Root" component={BottomTabNavigator} />
					<Stack.Screen
						name="NotFound"
						component={NotFoundScreen}
						options={{ title: "Oops!" }}
					/>
				</>
			)}
		</Stack.Navigator>
	);
}
