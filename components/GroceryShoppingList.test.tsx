import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GroceryShoppingList from "./GroceryShoppingList";

describe("GroceryShoppingList Component", () => {
    it("renders correctly", () => {
        const { getByPlaceholderText, getByText } = render(<GroceryShoppingList />);
        expect(getByPlaceholderText("Enter grocery item")).toBeTruthy();
        expect(getByText("Add the item to list")).toBeTruthy();
    });

    it("allows the user to add a grocery item to the list", () => {
        const { getByPlaceholderText, getByText, queryByText } = render(<GroceryShoppingList />);
        
        const input = getByPlaceholderText("Enter grocery item");
        const button = getByText("Add the item to list");

        // Add first item
        fireEvent.changeText(input, "Apples");
        fireEvent.press(button);
        expect(queryByText("Apples")).toBeTruthy();

        // Add second item
        fireEvent.changeText(input, "Bananas");
        fireEvent.press(button);
        expect(queryByText("Bananas")).toBeTruthy();
        expect(queryByText("Apples")).toBeTruthy();
    });

    it("clears the input field after adding an item", () => {
        const { getByPlaceholderText, getByText } = render(<GroceryShoppingList />);
        
        const input = getByPlaceholderText("Enter grocery item");
        const button = getByText("Add the item to list");

        fireEvent.changeText(input, "Milk");
        fireEvent.press(button);
        expect(input.props.value).toBe("");
    });
});