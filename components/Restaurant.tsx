import React from "react";
import { Card, IconButton } from "react-native-paper";

interface IRestaurantProps {
	id: string;
	coverImg: string;
	name: string;
	categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
	id,
	coverImg,
	name,
	categoryName,
}) => (
	<Card key={id} style={{ marginBottom: 10 }}>
		<Card.Cover source={{ uri: coverImg }} />
		<Card.Title
			title={name}
			subtitle={categoryName}
			right={(props) => (
				//TODO:Add functionality to this icon
				<IconButton color="red" {...props} icon="heart" onPress={() => {}} />
			)}
		/>
	</Card>
);
