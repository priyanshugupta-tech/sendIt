import { Tabs } from "@chakra-ui/react";
import Login from "../Login";
import Signup from "../Signup";

const Multitabs = () => {
  return (
    <Tabs.Root defaultValue="tab-1" variant="subtle" fitted maxW="md">
      <Tabs.List
        bg="#FAF9F6"
        p="1"
        borderRadius="lg"
        border="1px solid "
        borderColor="#F0EAD6"
      >
        <Tabs.Trigger
          value="tab-1"
          color="gray.600"
          borderRadius="md"
          _selected={{ bg: "#2ab5ce", color: "white" }}
        >
          Login
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab-2"
          color="gray.600"
          borderRadius="md"
          _selected={{ bg: "#2ab5ce", color: "white" }}
        >
          Signup
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tab-1">
        <Login />
      </Tabs.Content>
      <Tabs.Content value="tab-2">
        <Signup />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default Multitabs;
