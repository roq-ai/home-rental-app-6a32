import { Box, Stack, Text, Divider, IconButton } from "@chakra-ui/react";
import { ChatWindow } from "@roq/nextjs";
import { compose } from "lib/compose";
import { withAppLayout } from "lib/hocs/with-app-layout.hoc";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi"; // Import the back arrow icon

function MessageHost() {
  const router = useRouter();
  const { conversationId, id } = router.query;

  const handleBack = () => {
    router.push(`/bookings/view/${id}`);
  };

  return (
    <Stack
      spacing={4}
      mt={6}
      width={{ sm: "100%", md: "80%", lg: "70%" }}
      mx="auto"
    >
      <Box
        bg="white"
        // boxShadow="lg"
        borderRadius="md"
        p={4}
        borderWidth="1px"
        borderColor="gray.200"
        overflowY="hidden"
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <IconButton
            icon={<FiArrowLeft />}
            aria-label="Back"
            variant="ghost"
            onClick={handleBack}
            fontWeight="bold"
          />
          <Text fontSize="xl" fontWeight="bold">
            Message
          </Text>
          <Box width="24px" />
        </Box>
        <Divider my={3} />
        {conversationId && (
          <Box width="100%" height="500px">
            <ChatWindow
              conversationId={conversationId as string}
              style={{ overflowY: "scroll" }}
            />
          </Box>
        )}
      </Box>
    </Stack>
  );
}

export default compose(withAppLayout())(MessageHost);
