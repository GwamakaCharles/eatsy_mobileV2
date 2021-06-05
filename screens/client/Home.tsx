import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { View, FlatList, TouchableOpacity } from "react-native";
import {
	restaurantsPageQuery,
	restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
import { RESTAURANT_FRAGMENT, CATEGORY_FRAGMENT } from "../../hooks/fragments";
import { Searchbar } from "react-native-paper";
import { Restaurant } from "../../components/Restaurant";

const RESTAURANTS_QUERY = gql`
	query restaurantsPageQuery($input: RestaurantsInput!) {
		allCategories {
			ok
			error
			categories {
				...CategoryParts
			}
		}
		restaurants(input: $input) {
			ok
			error
			totalPages
			totalResults
			results {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${CATEGORY_FRAGMENT}
`;

export const Home = ({ navigation }: { navigation: any }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const onChangeSearch = (query: string) => setSearchQuery(query);

	const [page, setPage] = useState(1);
	const { data, loading } = useQuery<
		restaurantsPageQuery,
		restaurantsPageQueryVariables
	>(RESTAURANTS_QUERY, {
		variables: {
			input: {
				page,
			},
		},
	});

	if (!loading) {
		try {
			console.log("there is some data");
		} catch (error) {
			console.log("error");
		}
	}

	const renderItem = ({ item }: { item: any }) => (
		<TouchableOpacity
			onPress={() => navigation.navigate("Restaurant", { item })}
		>
			<Restaurant
				key={item.id}
				coverImg={item.coverImg}
				id={item.id + ""}
				name={item.name}
				categoryName={item.category?.name}
			/>
		</TouchableOpacity>
	);

	return (
		<>
			<View style={{ padding: 10 }}>
				<Searchbar
					placeholder="Search"
					onChangeText={onChangeSearch}
					value={searchQuery}
				/>
			</View>
			<View style={{ padding: 10 }}>
				<FlatList
					data={data?.restaurants.results}
					keyExtractor={(item) => `${item.id}`}
					renderItem={renderItem}
				/>
			</View>
		</>
	);
};
