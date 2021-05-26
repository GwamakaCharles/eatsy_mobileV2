import React from "react";
import { View } from "react-native";
import { Card, Button, Title, Paragraph } from "react-native-paper";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";

interface IDishProps {
	id?: number;
	description: string;
	name: string;
	photo: string;
	price: number;
	isCustomer?: boolean;
	orderStarted?: boolean;
	isSelected?: boolean;
	options?: restaurant_restaurant_restaurant_menu_options[] | null;
	addItemToOrder?: (dishId: number) => void;
	removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
	id = 0,
	description,
	name,
	price,
	isCustomer = false,
	orderStarted = false,
	options,
	photo,
	isSelected,
	addItemToOrder,
	removeFromOrder,
	children: dishOptions,
}) => {
	const onClick = () => {
		if (orderStarted) {
			if (!isSelected && addItemToOrder) {
				return addItemToOrder(id);
			}
			if (isSelected && removeFromOrder) {
				return removeFromOrder(id);
			}
		}
	};
	return (
		<Card style={{ margin: 10 }}>
			<Card.Title title={name} />
			<Card.Cover source={{ uri: photo }} />
			<Card.Content>
				<Paragraph>{description}</Paragraph>
				<Paragraph>{price}</Paragraph>
			</Card.Content>
			{orderStarted && (
				<Card.Actions>
					<Button onPress={onClick}>{isSelected ? "Remove" : "Add"}</Button>
				</Card.Actions>
			)}
		</Card>
	);
};
