import React from "react";
import styled from "styled-components";
import useInput from "@/utils/useInput";

interface InputProps {
  isTyping?: boolean;
}

interface ISuggestion {
  place_name: string;
}

const InputField = () => {
  const address = useInput("");

  return (
    <div>
      <Input
        placeholder="Address"
        {...address}
        isTyping={address.value !== ""}
      />
      {address.suggestions?.length > 0 && (
        <SuggestionWrapper>
          {address.suggestions.map((suggestion: ISuggestion, index) => (
            <Suggestion
              key={index}
              onClick={() => {
                // address.setValue(suggestion.place_name);
                // console.log(suggestion);
                // address.setSuggestions([]);
                // address.setGoToLocation(suggestion.place_name);
              }}
            >
              {suggestion.place_name}
            </Suggestion>
          ))}
        </SuggestionWrapper>
      )}
    </div>
  );
};

export default InputField;

const Input = styled.input<InputProps>`
  &:focus {
    outline: none;
    border-radius: ${(props) =>
      props.isTyping ? "10px 10px 0px 0px" : "30px"};
  }
`;

const SuggestionWrapper = styled.div`
  background: white;
  position: absolute;
  width: 400px;
  padding: 10px 20px;
  border-radius: 0px 0px 10px 10px;
`;

const Suggestion = styled.p`
  cursor: pointer;
  max-width: 400px;
`;
