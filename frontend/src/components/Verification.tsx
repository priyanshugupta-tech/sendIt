import { useForm, Controller } from "react-hook-form";
import { Box, Button, Field, PinInput, Stack } from "@chakra-ui/react";

type formData = {
  pin: Array<string>;
};

function OTPForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      pin: ["", "", "", "", "", "", ""],
    },
  });

  const onSubmit = (data: formData) => {
    /**
     * API call*
     */
    console.log(data);
  };

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
