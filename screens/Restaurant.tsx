import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { Dish } from "../components/dish";
import { RESTAURANT_FRAGMENT, DISH_FRAGMENT } from "../hooks/fragments";
import {
	createOrder,
	createOrderVariables,
} from "../__generated__/createOrder";
import {
	CreateOrderInput,
	CreateOrderItemInput,
} from "../__generated__/globalTypes";
import { restaurant, restaurantVariables } from "../__generated__/restaurant";

const RESTAURANT_QUERY = gql`
	query restaurant($input: RestaurantInput!) {
		restaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menu {
					...DishParts
				}
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
	mutation createOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			ok
			error
			orderId
		}
	}
`;

export const Restaurant = ({
	route,
	navigation,
}: {
	route: any;
	navigation: any;
}) => {
	const { item } = route.params;
	const { loading, data } = useQuery<restaurant, restaurantVariables>(
		RESTAURANT_QUERY,
		{
			variables: {
				input: {
					restaurantId: item.id,
				},
			},
		}
	);

	const [orderStarted, setOrderStarted] = useState(false);
	const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

	const triggerStartOrder = () => {
		setOrderStarted(true);
	};

	const getItem = (dishId: number) => {
		return orderItems.find((order) => order.dishId === dishId);
	};

	const isSelected = (dishId: number) => {
		return Boolean(getItem(dishId));
	};

	const addItemToOrder = (dishId: number) => {
		if (isSelected(dishId)) {
			return;
		}
		setOrderItems((current) => [{ dishId, options: [] }, ...current]);
	};

	const removeFromOrder = (dishId: number) => {
		setOrderItems((current) =>
			current.filter((dish) => dish.dishId !== dishId)
		);
	};

	const addOptionToItem = (dishId: number, optionName: string) => {
		if (!isSelected(dishId)) {
			return;
		}
		const oldItem = getItem(dishId);
		if (oldItem) {
			const hasOption = Boolean(
				oldItem.options?.find((aOption) => aOption.name === optionName)
			);
			if (!hasOption) {
				removeFromOrder(dishId);
				setOrderItems((current) => [
					{ dishId, options: [{ name: optionName }, ...oldItem.options!] },
					...current,
				]);
			}
		}
	};

	const removeOptionFromItem = (dishId: number, optionName: string) => {
		if (!isSelected(dishId)) {
			return;
		}
		const oldItem = getItem(dishId);
		if (oldItem) {
			removeFromOrder(dishId);
			setOrderItems((current) => [
				{
					dishId,
					options: oldItem.options?.filter(
						(option) => option.name !== optionName
					),
				},
				...current,
			]);
			return;
		}
	};

	const getOptionFromItem = (
		item: CreateOrderItemInput,
		optionName: string
	) => {
		return item.options?.find((option) => option.name === optionName);
	};

	const isOptionSelected = (dishId: number, optionName: string) => {
		const item = getItem(dishId);
		if (item) {
			return Boolean(getOptionFromItem(item, optionName));
		}
		return false;
	};

	const triggerCancelOrder = () => {
		setOrderStarted(false);
		setOrderItems([]);
	};

	const onCompleted = (data: createOrder) => {
		const {
			createOrder: { ok, orderId },
		} = data;
		if (data.createOrder.ok) {
			//navigate or pop the order page
		}
	};

	const [createOrderMutation, { loading: placingOrder }] = useMutation<
		createOrder,
		createOrderVariables
	>(CREATE_ORDER_MUTATION, {
		onCompleted,
	});

	const triggerConfirmOrder = () => {
		if (placingOrder) {
			return;
		}
		if (orderItems.length === 0) {
			alert("Can't place an empty order");
			return;
		}

		const ok = window.confirm("You are about to place an order");
		if (ok) {
			createOrderMutation({
				variables: {
					input: {
						restaurantId: item.id,
						items: orderItems,
					},
				},
			});
		}
	};

	const renderItem = ({ item }: { item: any }) => (
		<Dish
			isSelected={isSelected(item.id)}
			id={item.id}
			orderStarted={orderStarted}
			name={item.name}
			photo={item.photo}
			description={item.description}
			price={item.price}
			isCustomer={true}
			options={item.options}
			addItemToOrder={addItemToOrder}
			removeFromOrder={removeFromOrder}
		/>
	);

	return (
		<View>
			<View>
				{!orderStarted && (
					<Button
						mode="contained"
						style={{
							margin: 10,
							padding: 5,
						}}
						onPress={triggerStartOrder}
					>
						Start Order
					</Button>
				)}
				{orderStarted && (
					<View
						style={{
							margin: 10,
							flexDirection: "row",
						}}
					>
						<Button
							mode="contained"
							onPress={triggerConfirmOrder}
							style={{ marginRight: 15 }}
						>
							Confirm Order
						</Button>
						<Button mode="contained" onPress={triggerCancelOrder}>
							Cancel Order
						</Button>
					</View>
				)}
			</View>
			<View style={{ padding: 5 }}>
				<FlatList
					data={data?.restaurant.restaurant?.menu}
					keyExtractor={(item) => `${item.id}`}
					renderItem={renderItem}
				/>
			</View>
		</View>
	);
};
