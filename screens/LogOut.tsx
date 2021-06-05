import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { isLoggedInVar, tokenVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants/token";

export const Logout = () => {
	const logUserOut = async () => {
		await AsyncStorage.removeItem(LOCALSTORAGE_TOKEN);
		isLoggedInVar(false);
		tokenVar(null);
	};

	return (
		<View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
			<Button mode="contained" onPress={logUserOut}>
				Logout
			</Button>
		</View>
	);
};
