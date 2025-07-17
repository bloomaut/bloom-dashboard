import { get } from "@/services/fetch";
import { setUserData } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

interface Props {
  setTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function PollUser({ setTab }: Props) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await get("user/me");
        console.log(res);
        if (res.result.user.client.proposal_url) {
          dispatch(setUserData(res.result.user));
          setTab("prop");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
    const interval = setInterval(fetchUser, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
