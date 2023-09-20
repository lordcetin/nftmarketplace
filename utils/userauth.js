import store from "@/store/store";
import { setUser } from "@/slice/auth";

export const userHandler = data => {
    store.dispatch(setUser(data))
}