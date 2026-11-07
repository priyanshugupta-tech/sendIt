import { useForm, Controller } from "react-hook-form";
import { Box, Button, Field, PinInput, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserState } from "@/app/slices/userSlice";

type formData = {
  pin: Array<string>;
};

type Outputs = {
  message: string;
  accessToken: string;
  user: { userName: string; email: string };
};

function OTPForm() {
  const [info, setInfo] = React.useState("");
  const [redirecting, setRedirecting] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const routeEmail =
    typeof location.state?.email === "string" ? location.state.email : "";
  const email = routeEmail || sessionStorage.getItem("sendItOtpEmail") || "";

  React.useEffect(
    () => () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    },
    [],
  );

  const showErrorThenRedirect = (message: string) => {
    setInfo(message);
    setRedirecting(true);
    redirectTimer.current = setTimeout(() => {
      sessionStorage.removeItem("sendItOtpEmail");
      navigate("/auth", { replace: true });
    }, 1000);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      pin: ["", "", "", "", "", "", ""],
    },
  });

  const onSubmit = async (data: formData) => {
    /**
     * API call*
     */
    try {
      const result = await axios.post<Outputs>("/api/auth/verify-otp", {
        otp: data.pin.join(""),
        email,
      });

      if (result.status === 201) {
        sessionStorage.removeItem("sendItOtpEmail");
        const { user, accessToken } = result.data;
        dispatch(
          updateUserState({
            userName: user.userName,
            email: user.email,
            isLoggedIn: true,
            accessToken: accessToken,
          }),
        );
        navigate("/", { replace: true });
        return;
      }
      showErrorThenRedirect(result.data.message);
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data.message
        : undefined;
      showErrorThenRedirect(
        message || "Unable to verify the code. Please try again.",
      );
    }
  };

  if (!email) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw"
        padding="4"
      >
        <Stack gap={4} align="center">
          <Text color="white">
            Please sign up first so we know where to send your verification
            code.
          </Text>
          <Button
            backgroundColor="white"
            border="none"
            outline="none"
            className="submitButton"
            color="#2bbbd6"
            onClick={() => {
              sessionStorage.removeItem("sendItOtpEmail");
              navigate("/auth", { replace: true });
            }}
          >
            Go to sign up
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      padding="4"
    >
      <Box bg="white" p="4" borderRadius="xl" boxShadow="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4} align="flex-start">
            <Text>Enter the 6-digit code sent to {email}.</Text>
            {info && (
              <Text color="red" role="alert">
                {info}
              </Text>
            )}
            <Field.Root invalid={!!errors.pin}>
              <Field.Label marginY="1" fontSize="md" color="gray">
                Enter OTP
              </Field.Label>
              <Controller
                name="pin"
                control={control}
                rules={{
                  validate: (value) =>
                    value.length === 6 &&
                    value.every((digit) => /^[0-9]$/.test(digit))
                      ? true
                      : "Please enter a valid 6-digit OTP",
                }}
                render={({ field }) => (
                  <PinInput.Root
                    size="sm"
                    variant="outline"
                    colorPalette="cyan"
                    count={6}
                    value={field.value}
                    onValueChange={(details) => field.onChange(details.value)}
                    type="numeric"
                    otp
                  >
                    <PinInput.HiddenInput />
                    <PinInput.Control display="flex" flexWrap="wrap">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <PinInput.Input
                          border="1px solid gray"
                          key={index}
                          index={index}
                        />
                      ))}
                    </PinInput.Control>
                  </PinInput.Root>
                )}
              />

              <Field.ErrorText>{errors.pin?.message}</Field.ErrorText>
            </Field.Root>

            <Button
              type="submit"
              className="submitButton"
              backgroundColor="#2bbbd6"
              color="white"
              width="100%"
              disabled={redirecting}
            >
              Verify OTP
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export default OTPForm;
