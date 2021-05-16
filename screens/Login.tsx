import { gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { LOCALSTORAGE_TOKEN } from "../constants/token";
import {
	loginMutation,
	loginMutationVariables,
} from "../__generated__/loginMutation";

export const LOGIN_MUTATION = gql`
	mutation loginMutation($loginInput: LoginInput!) {
		login(input: $loginInput) {
			ok
			token
			error
		}
	}
`;

interface ILoginForm {
	email: string;
	password: string;
}

const Login = ({ navigation }: { navigation: any }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const {
		control,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginForm>({
		mode: "onChange",
	});

	const storeToken = async (token: string) => {
		try {
			await AsyncStorage.setItem(LOCALSTORAGE_TOKEN, token);
		} catch (e) {
			// saving error
		}
	};

	const onCompleted = (data: loginMutation) => {
		const {
			login: { ok, token },
		} = data;

		if (ok && token) {
			storeToken(token);
			// isLoggedInVar(true);
			console.log("logged in");
			console.log(token);
			navigation.navigate("Register");
		} else {
			console.log("could not log in");
		}
	};

	const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
		loginMutation,
		loginMutationVariables
	>(LOGIN_MUTATION, {
		onCompleted,
	});

	const onSubmit = () => {
		if (!loading) {
			const { email, password } = getValues();
			loginMutation({
				variables: {
					loginInput: {
						email,
						password,
					},
				},
			});
		}
	};

	return (
		<View style={{ padding: 10 }}>
			<Controller
				control={control}
				render={({ field: { onChange, value } }) => (
					<TextInput
						label="email"
						value={value}
						mode="outlined"
						placeholder="Type your Email"
						onChangeText={(value) => onChange(value)}
						style={{ marginTop: 100 }}
					/>
				)}
				name="email"
				rules={{ required: true }}
			/>
			{errors.email && <Text>This is required.</Text>}
			<Controller
				name="password"
				control={control}
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						label="password"
						secureTextEntry
						value={value}
						mode="outlined"
						placeholder="Type your Password"
						onChangeText={(value) => onChange(value)}
						style={{ marginTop: 5 }}
					/>
				)}
			/>
			{errors.password && <Text>This is required.</Text>}

			<Button
				mode="contained"
				//TODO:put the right icons here
				icon={loading ? "loading" : "lock"}
				onPress={handleSubmit(onSubmit)}
				style={{
					padding: 10,
					marginTop: 10,
					borderColor: "green",
					backgroundColor: "red",
				}}
			>
				Login
			</Button>
			{loginMutationResult?.login.error && <Text>Login error</Text>}

			<View style={{ paddingTop: 10, alignItems: "flex-end" }}>
				<Link to="/Register" style={{ color: "blue", fontSize: 14 }}>
					Create an Account
				</Link>
			</View>
		</View>
	);
};

export default Login;
