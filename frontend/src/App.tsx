// import React from "react";
import { Box } from "@chakra-ui/react";
import Multitabs from "./components/ui/Multitabs";
import LogoComp from "./assets/logoComp.png";

function App() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="100vh"
      w="100vw"
      p={{ base: "20px", sm: "30px", md: "40px" }}
      flexDirection="column"
      overflow="scroll"
    >
      <Box
        p={{ base: "20px", sm: "30px", md: "40px" }}
        backgroundColor="white"
        boxShadow="lg"
        rounded="xl"
        w="100%"
        maxW={{ base: "100%", sm: "450px", md: "500px" }}
      >
        <Box
          display="flex"
          justifyContent="center"
          marginBottom={{ base: "0px", sm: "20px" }}
        >
          <img src={LogoComp} height="100px" width="100px" alt="Logo" />
        </Box>
        <Multitabs />
      </Box>
    </Box>
  );
}

export default App;
