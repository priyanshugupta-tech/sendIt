import type { RootState } from "@/app/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { updateUserState } from "@/app/slices/userSlice";
import { Outlet } from "react-router-dom";

type User = {
  userName: string;
  email: string;
};

function Dashboard() {
  const [loader, setLoader] = React.useState(true);
  const [redirectMsg, setRedirectMsg] = React.useState("");
  const [accessToken, setAccessToken] = React.useState("");
  const isLoggedIn = useSelector(
    (state: RootState) => state.userState.isLoggedIn,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      setLoader(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();

    axios
      .get<{ message: string; accessToken: string }>("/api/auth/newtoken", {
        signal: controller.signal,
      })
      .then((res: AxiosResponse<{ message: string; accessToken: string }>) => {
        if (res.status === 201) {
          // User is logged in; fetch chat data here when that request is implemented.
          setAccessToken(res.data.accessToken);
          axios
            .post<
              {
                message: string;
                user: object;
              },
              any,
              { accessToken: string }
            >(
              "/api/auth/getuser",
              { accessToken: accessToken },
              { signal: controller.signal },
            )
            .then((res: AxiosResponse<{ message: string; user: User }>) => {
              dispatch(
                updateUserState({
                  userName: res.data.user.userName,
                  isLoggedIn: true,
                  email: res.data.user.email,
                  accessToken: accessToken,
                }),
              );
            })
            .catch((err: AxiosError<{ message: string }>) => {
              if (axios.isCancel(err)) {
                return;
              }

              setLoader(false);

              if (err.response?.status === 401) {
                const isExpired =
                  err.response.data?.message ===
                  "token expired, please login again!";
                setRedirectMsg(
                  isExpired
                    ? "Session expired, please login again!"
                    : "You are not authenticated, please login first",
                );
                timeoutId = setTimeout(() => navigate("/auth"), 1000);
                return;
              }
              setRedirectMsg("Something went wrong. Please try again.");
            });
        }
        setLoader(false);
      })
      .catch((err: AxiosError<{ message: string }>) => {
        if (axios.isCancel(err)) {
          return;
        }

        setLoader(false);

        if (err.response?.status === 401) {
          const isExpired =
            err.response.data?.message === "token expired, please login again!";
          setRedirectMsg(
            isExpired
              ? "Session expired, please login again!"
              : "You are not authenticated, please login first",
          );
          timeoutId = setTimeout(() => navigate("/auth"), 1000);
          return;
        }

        setRedirectMsg("Something went wrong. Please try again.");
      });

    return () => {
      controller.abort();
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoggedIn, navigate]);

  if (loader) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      </Box>
    ); //koi badhiya sa Loader Animation
  }

  return <div>{redirectMsg || <Outlet />}</div>;
}

export default Dashboard;
