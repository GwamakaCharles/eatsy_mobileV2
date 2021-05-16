import { WebSocketLink } from "@apollo/client/link/ws";

import {
	ApolloClient,
	makeVar,
	InMemoryCache,
	HttpLink,
	split,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMainDefinition } from "@apollo/client/utilities";
import { LOCALSTORAGE_TOKEN } from "./constants/token";

const getToken = async () => {
	try {
		const value = await AsyncStorage.getItem(LOCALSTORAGE_TOKEN);
		if (value !== null) {
			// value previously stored
			return value;
		}
	} catch (e) {
		// error reading value
		console.log(e);
	}
};

export const token = getToken();

const httpLink = new HttpLink({
	uri: "https://eat-aks-ingress.eastus.cloudapp.azure.com/graphql",
});

const wsLink = new WebSocketLink({
	uri: "wss://eat-aks-ingress.eastus.cloudapp.azure.com/graphql",
	options: {
		reconnect: true,
		connectionParams: {
			Bearer: token || "",
		},
	},
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	httpLink
);

// Initialize Apollo Client
export const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});
