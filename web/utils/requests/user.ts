import { IUserPayload } from "../types/IUserData";

// Use this function directly in your component
export const sendUserData = async (payload: IUserPayload) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Response message:", result.message);
  } catch (error) {
    console.error("Error sending user data:", error);
  }
};
