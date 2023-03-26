import { getUserData, UserData } from "@decentraland/Identity";

export let userWallet: string | undefined;
export let userData: UserData | null;

export const getUser = async () => {
  userData = await getUserData();
  userWallet = userData?.userId;
  log(userData)
}