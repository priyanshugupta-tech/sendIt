import { Box, Text, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";

type Inputs = {
  userName: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const [display, setDisplay] = React.useState<boolean>(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column">
        <label htmlFor="userName">
          <Text fontSize="sm">User name</Text>
        </label>
        <input
          id="userName"
          placeholder="user name"
          className="inputBox"
          style={{
            color: "gray",
            backgroundColor: "#FAF9F6",
            padding: "10px",
            marginTop: "2px",
            outline: "none",
            borderRadius: "10px",
            border: "1px solid #F0EAD6",
            width: "100%",
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
        <label style={{ marginTop: "10px" }} htmlFor="password">
          <Text fontSize="sm">Password</Text>
        </label>
        <Box position="relative" width="100%">
          <input
            id="password"
            placeholder="password"
            className="inputBox"
            type={display ? "text" : "password"}
            style={{
              width: "100%",
              boxSizing: "border-box",
              color: "gray",
              padding: "10px",
              paddingRight: "45px",
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
            size="2xs"
            backgroundColor="#FAF9F6"
            onClick={() => setDisplay((prev) => !prev)}
            top="2.5"
            right="1"
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
        >
          <CiLogin color="white" size="20px" />
          Login
        </button>
      </Box>
    </form>
  );
}
