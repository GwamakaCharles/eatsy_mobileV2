import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

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

export const isLoggedInVar = makeVar<Boolean>(false);
export const tokenVar = makeVar<String | null>("");

const TOKEN = LOCALSTORAGE_TOKEN;

export const logUserIn = async (token: string) => {
	await AsyncStorage.setItem(TOKEN, token);
	isLoggedInVar(true);
	tokenVar(token);
};

export const logUserOut = async () => {
	await AsyncStorage.removeItem(TOKEN);
	isLoggedInVar(false);
	tokenVar(null);
};

const uploadHttpLink = new HttpLink({
	uri: "https://eat-aks-ingress.eastus.cloudapp.azure.com/graphql",
});

const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			token: tokenVar(),
		},
	};
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		console.log(`GraphQL Error`, graphQLErrors);
	}
	if (networkError) {
		console.log("Network Error", networkError);
	}
});

const wsLink = new WebSocketLink({
	uri: "wss://eat-aks-ingress.eastus.cloudapp.azure.com/graphql",
	options: {
		reconnect: true,
		connectionParams: () => ({
			token: tokenVar(),
		}),
	},
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	httpLinks
);

// Initialize Apollo Client
export const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});
