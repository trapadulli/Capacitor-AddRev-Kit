import { rcLogIn, rcLogOut } from './revenuecat';

export async function logInToRevenueCat(appUserID: string) {
  await rcLogIn(appUserID);
}

export async function logOutOfRevenueCat() {
  await rcLogOut();
}
