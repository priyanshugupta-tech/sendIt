import { Box, Text, Button, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React from "react";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type Inputs = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  image?: FileList;
};

type Outputs = {
  message: string;
};

type SignupError = {
  message: string;
};

export default function Signup() {
  const [info, setInfo] = React.useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await axios.post<Outputs>("/api/auth/signup", data);
      if (
        result.status === 201 &&
        result.data.message === "signup successfull!"
      ) {
        navigate("/otp", { replace: true });
        return;
      }

      setInfo(result.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<SignupError>;
        if (err.response) {
          setInfo(err.response.data.message);
        } else if (err.request) {
          setInfo("Network error, request failed!");
        } else {
          setInfo("Something went wrong!");
        }
      }
    }
  };

  const [display, setDisplay] = React.useState<boolean>(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" minW="100%">
        {info && (
          <Text color="red" fontSize="sm" role="alert" marginBottom="10px">
            {info}
          </Text>
        )}
        <Box display="flex" gap="4" marginBottom="10px">
          <Box display="flex" flexDirection="column" flex="1">
            <label htmlFor="userName">
              <Text fontSize="sm">User Name</Text>
            </label>
            <input
              id="userName"
              placeholder="john_doe"
              className="inputBox"
              style={{
                width: "100%",
                color: "gray",
                marginTop: "2px",
                outline: "none",
                borderRadius: "10px",
                backgroundColor: "#FAF9F6",
                border: "1px solid #F0EAD6",
              }}
              {...register("userName", { required: true })}
            />
            {errors.userName && (
              <span>
                <Text color="red" fontSize="2xs">
                  This field is required
                </Text>
              </span>
            )}
          </Box>
          <Box display="flex" flexDirection="column" flex="1">
            <label htmlFor="email">
              <Text fontSize="sm">Email</Text>
            </label>
            <input
              id="email"
              type="email"
              className="inputBox"
              placeholder="johndoe@gmail.com"
              style={{
                width: "100%",
                color: "gray",
                marginTop: "2px",
                outline: "none",
                borderRadius: "10px",
                backgroundColor: "#FAF9F6",
                border: "1px solid #F0EAD6",
              }}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span>
                <Text color="red" fontSize="2xs">
                  This field is required
                </Text>
              </span>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          gap="4"
          marginBottom="10px"
          minW="100%"
          flexWrap="wrap"
        >
          <Box display="flex" flexDirection="column" flex="1">
            <label htmlFor="password">
              <Text fontSize="sm">Password</Text>
            </label>
            <Box position="relative">
              <input
                id="password"
                placeholder="Enter Password"
                className="inputBox"
                type={display ? "text" : "password"}
                style={{
                  width: "100%",
                  color: "gray",
                  marginTop: "2px",
                  outline: "none",
                  borderRadius: "10px",
                  backgroundColor: "#FAF9F6",
                  border: "1px solid #F0EAD6",
                }}
                {...register("password", { required: true })}
              />
              <Button
                position="absolute"
                top="2.5"
                right="1"
                size="2xs"
                backgroundColor="#FAF9F6"
                onClick={() => setDisplay((prev) => !prev)}
              >
                {display ? <FaEye /> : <FaEyeSlash />}
              </Button>
            </Box>
            {errors.password && (
              <span>
                <Text color="red" fontSize="2xs">
                  This field is required
                </Text>
              </span>
            )}
          </Box>
          <Box display="flex" flexDirection="column" flex="1">
            <label htmlFor="confirmPassword">
              <Text fontSize="sm">Confirm</Text>
            </label>

            <input
              id="confirmPassword"
              placeholder="Confirm Password"
              className="inputBox"
              style={{
                width: "100%",
                color: "gray",
                marginTop: "2px",
                outline: "none",
                borderRadius: "10px",
                backgroundColor: "#FAF9F6",
                border: "1px solid #F0EAD6",
              }}
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <span>
                <Text color="red" fontSize="2xs">
                  This field is required
                </Text>
              </span>
            )}
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" flex="1">
          <label htmlFor="image">
            <Text fontSize="sm">Profile Picture</Text>
          </label>
          <input
            id="image"
            type="file"
            className="inputBox"
            accept=".jpg, .jpeg, .png"
            style={{
              width: "100%",
              color: "gray",
              marginTop: "2px",
              outline: "none",
              borderRadius: "10px",
              backgroundColor: "#FAF9F6",
              border: "1px solid #F0EAD6",
            }}
            {...register("image")}
          />
        </Box>

        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            minWidth: "100%",
            padding: "10px",
            backgroundColor: "#2bbbd7",
            borderRadius: "10px",
            marginTop: "30px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            color: "white",
          }}
          type="submit"
          className="submitButton"
          disabled={isSubmitting}
          aria-live="polite"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              Processing your request...
            </>
          ) : (
            <>
              <MdOutlineSupervisorAccount color="white" size="20px" />
              Sign up
            </>
          )}
        </button>
      </Box>
    </form>
  );
}
