import React from "react";
import { View, Text } from "react-native";

export const Restaurant = ({
	route,
	navigation,
}: {
	route: any;
	navigation: any;
}) => {
	const { item } = route.params;
	return (
		<View>
			<Text>Restaurant page</Text>
			<Text>item: {JSON.stringify(item.id)}</Text>
		</View>
	);
};
