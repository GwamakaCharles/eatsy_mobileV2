import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import { Link } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import {
	createAccountMutation,
	createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";

export const CREATE_ACCOUNT_MUTATION = gql`
	mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
		createAccount(input: $createAccountInput) {
			ok
			error
		}
	}
`;

interface ICreateAccountForm {
	email: string;
	password: string;
	role: UserRole;
}

export const Register = ({ navigation }: { navigation: any }) => {
	const [selectedLanguage, setSelectedLanguage] = useState();

	const {
		control,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<ICreateAccountForm>({
		mode: "onChange",
		defaultValues: { role: UserRole.Client },
	});

	const onCompleted = (data: createAccountMutation) => {
		const {
			createAccount: { ok, error },
		} = data;

		if (ok) {
			alert("Account Created! Log in now!");
			navigation.navigate("Home");
		}

		if (error) {
			console.log(`Can't create account with this error: ${error}`);
		}
	};

	const [
		createAccountMutation,
		{ loading, data: createAccountMutationResult },
	] = useMutation<createAccountMutation, createAccountMutationVariables>(
		CREATE_ACCOUNT_MUTATION,
		{ onCompleted }
	);

	const onSubmit = () => {
		if (!loading) {
			const { email, password, role } = getValues();
			createAccountMutation({
				variables: {
					createAccountInput: { email, password, role },
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
				rules={{
					required: true,
					pattern:
						/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				}}
			/>
			{errors.email?.message && <Text>{errors.email?.message}</Text>}
			{errors.email?.type === "pattern" && (
				<Text>"Please enter a valid email"</Text>
			)}

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
						placeholder="Choose your Password"
						onChangeText={(value) => onChange(value)}
						style={{ marginTop: 5 }}
					/>
				)}
			/>
			{errors.password?.message && <Text>{errors.password?.message}</Text>}

			<Picker
				mode="dropdown"
				selectedValue={selectedLanguage}
				onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
			>
				{Object.keys(UserRole).map((role, index) => (
					<Picker.Item key={index}>{role}</Picker.Item>
                ))}
                
				<Picker.Item label="Java" value="java" />
				<Picker.Item label="JavaScript" value="js" />
			</Picker>
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
				Create Account
			</Button>
			{createAccountMutationResult?.createAccount.error && (
				<Text>{createAccountMutationResult?.createAccount.error}</Text>
			)}
			<View style={{ paddingTop: 10, alignItems: "flex-end" }}>
				<Text>
					Already have an account?{" "}
					<Link to="/Login" style={{ color: "blue", fontSize: 14 }}>
						Login
					</Link>
				</Text>
			</View>
		</View>
	);
};
