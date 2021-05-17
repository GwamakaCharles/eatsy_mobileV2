import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { token } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants/token";

export const Logout = () => {
	const removeToken = () => {
		if (token !== null) {
			console.log("removed token", token);
			// AsyncStorage.removeItem(LOCALSTORAGE_TOKEN);
		}
	};

	return (
		<View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
			<Button mode="contained" onPress={removeToken}>
				Logout
			</Button>
		</View>
	);
};
