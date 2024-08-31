import { doc, getDoc } from "@firebase/firestore";
import { db } from "@/utils/firebaseConfig";

export const getCurrentUserData = async (user: any) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.log("No such user document!");
      return null;
    }
  } else {
    console.log("No user is logged in");
    return null;
  }
};
