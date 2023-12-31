import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  IconProps,
  useBreakpointValue,
  useDisclosure,
  Icon,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import {
  ChatMessageBell,
  NotificationBell,
  UserAccountDropdown,
  useAuthorizationApi,
  useSession,
  AccessServiceEnum,
  RoqResourceEnum,
  AccessOperationEnum,
} from "@roq/nextjs";
import ConfigureCodeBanner from "components/configure-code-banner";
import { HelpBox } from "components/help-box";
import { PoweredBy } from "components/powered-by";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { GithubIcon } from "icons/github-icon";
import { SlackIcon } from "icons/slack-icon";
import { TwitterIcon } from "icons/twitter-icon";
import { YoutubeIcon } from "icons/youtube-icon";
import { AppLogo } from "layout/app-logo";
import Link from "next/link";
import { IconType } from "react-icons";

import { ChatIcon } from "icons/chat-icon";
import { HamburgerIcon } from "icons/hamburger-icon";
import { InviteMemberIcon } from "icons/invite-member-icon";
import { LogoIcon } from "icons/logo-icon";
import { NotificationIcon } from "icons/notification-icon";
import { useRouter } from "next/router";
import { routes } from "routes";
import useSWR from "swr";
import { FiCalendar, FiHome, FiLogIn } from "react-icons/fi";

import { CompanyInterface } from "interfaces/company";
import { getCompanies } from "apiSdk/companies";
import { SearchInput } from "components/SearchInput";
import FilterModal from "components/filter-section/FilterModal";
interface LinkItemProps {
  name: string;
  icon?: IconType;
  path: string;
  entity: string;
  service?: AccessServiceEnum;
}

interface NavItemPropsInterface {
  name: string;
  icon?: IconType;
  path: string;
  entity: string;
  service?: AccessServiceEnum;
}

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: ReactNode;
}

const sidebarFooterLinks = [
  { Icon: TwitterIcon, url: "https://twitter.com/roqtechnology" },
  { Icon: GithubIcon, url: "https://github.com/roqtech" },
  { Icon: YoutubeIcon, url: "https://www.youtube.com/@roq-tech" },
  {
    Icon: SlackIcon,
    url: "https://join.slack.com/t/roq-community/shared_invite/zt-1ly20yqpg-K03kNGxN1C7G1C0rr3TlSQ",
  },
];

import { Suspense } from "react";

function Loader() {
  return (
    <Flex align="center" justify="center" w="100%" h="60vh">
      <Spinner size="lg" color="black" />
    </Flex>
  );
}

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const { status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMd = useBreakpointValue({ base: false, md: true });
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    if (isMd && isOpen) {
      onClose();
    }
  }, [isMd, isOpen, onClose]);

  return (
    <Suspense fallback={<Loader />}>
      <Box h={isBannerVisible ? "calc(100vh - 40px)" : "100vh"} bg={"base.100"}>
        <ConfigureCodeBanner
          isBannerVisible={isBannerVisible}
          setIsBannerVisible={setIsBannerVisible}
        />
        <HelpBox />
        {status === "authenticated" ? (
          <SidebarContent
            transition="none"
            h={isBannerVisible ? "calc(100vh - 40px)" : "100vh"}
            onClose={() => onClose}
            display={{ base: "none", md: "block" }}
          />
        ) : null}
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="xs"
        >
          <DrawerContent>
            <SidebarContent
              onClose={onClose}
              display={{ base: "block", md: "none" }}
            />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} isBannerVisible={isBannerVisible} />

        <Box
          ml={{ base: 0, md: `${status === "authenticated" ? 60 : 0}` }}
          p="8"
        >
          {/* Breadcrumbs */}
          {breadcrumbs ? breadcrumbs : null}
          {children}
        </Box>
      </Box>
    </Suspense>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  display: Record<string, string>;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  let loading = false;
  const { session } = useSession();
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const currentUser = session?.user?.roles?.[0];

  const isActiveRoute = useCallback(
    (path: string) => {
      const basePath = path.split("/").filter(Boolean)[0];
      const currentBasePath = router.pathname.split("/").filter(Boolean)[0];
      return basePath === currentBasePath;
    },
    [router]
  );

  const tenantRoles = ["host", "guest"];
  const isTenantUser = tenantRoles.some((role) =>
    session?.user?.roles?.includes(role)
  );
  const { data, error, isLoading } = useSWR<CompanyInterface[]>(
    () => (isTenantUser && session?.user?.tenantId ? `/companies` : null),
    () =>
      getCompanies({ tenant_id: session?.user?.tenantId }).then(
        ({ data }) => data
      )
  );
  loading = isLoading;

  const MockedLinkItems: Array<NavItemPropsInterface> = [
    {
      name: currentUser === "host" ? "Bookings" : "My Bookings",
      path: "/bookings",
      entity: "booking",
      service: AccessServiceEnum.PROJECT,
      icon: FiCalendar,
    },
    {
      name: currentUser === "host" ? "My Properties" : "Properties",
      path: currentUser === "guest" ? "/properties" : "/my-properties",
      entity: "property",
      service: AccessServiceEnum.PROJECT,
      icon: FiHome,
    },

    /** Add navigation item here **/
  ].filter((e) =>
    hasAccess(e.entity, AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
  );

  return (
    <Box
      transition="3s ease"
      bgColor="base.200"
      borderColor="base.300 !important"
      borderRight="1px solid"
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        pos="fixed"
        left="240px"
        right={0}
        h="20"
        alignItems="center"
        justifyContent="center"
      >
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Flex flexDirection="column" h="full" overflowY="auto">
        {/* Mock link items */}
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          px="8"
          height="80px"
          flex="0 0 auto"
        >
          <LogoIcon width="24px" height="24px" fill="base.content" />
          <Box sx={{ ml: "10px" }}>
            <AppLogo />
          </Box>
        </Flex>
        <Box className="main-nav">
          {currentUser !== undefined
            ? MockedLinkItems.map((link) => (
                <NavItem
                  key={link.name}
                  icon={link.icon}
                  path={link.path}
                  isActive={isActiveRoute(link.path)}
                >
                  {link.name}
                </NavItem>
              ))
            : null}
        </Box>
        <Box mt="auto" px={8} pb={4}>
          {session?.user?.roles?.[0] == "host" && (
            <a
              href={routes.frontend.invites.index}
              style={{ textDecoration: "none" }}
            >
              <Button
                className="nav-userInvite"
                width="100%"
                bgColor="#ff385c"
                color="secondary.content"
                _hover={{ bg: "secondary.focus" }}
                borderRadius="100px"
                size="sm"
                rightIcon={
                  <InviteMemberIcon
                    color="secondary.content"
                    width="17px"
                    height="17px"
                  />
                }
                boxShadow={`
              0px 3px 5px -1px #74748526,
              0px 6px 10px 0px #7474851A,
              0px 1px 18px 0px #7474850D
            `}
              >
                Invite Members
              </Button>
            </a>
          )}
        </Box>
        <Box px={8} py={4} borderTop="1px solid" borderColor="base.300">
          <Flex mb={1}>
            {sidebarFooterLinks.map(({ Icon, url }, index) => (
              <Box key={index} mr={3} cursor={"pointer"}>
                <ChakraLink
                  isExternal
                  href={url}
                  style={{ textDecoration: "none" }}
                >
                  <Icon
                    fill="base.content"
                    width="18px"
                    height="18px"
                    opacity="0.6"
                  />
                </ChakraLink>
              </Box>
            ))}
          </Flex>
          <Flex justifyContent="flex-start">
            <PoweredBy />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon?: IconType | React.FC<IconProps>;
  children: string | number;
  path: string;
  isActive?: boolean;
}

const NavItem = ({
  icon: NavIcon,
  children,
  path,
  isActive,
  ...rest
}: NavItemProps) => {
  return (
    <a href={path} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        px="8"
        py="3"
        my="1"
        fontSize="14px"
        lineHeight="20px"
        fontWeight={isActive ? 700 : 500}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        {...rest}
      >
        {NavIcon && (
          <Box
            width="18px"
            height="18px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mr="4"
          >
            <Icon as={NavIcon} color="neutral.main" boxSize="18px" />
          </Box>
        )}
        {children}
      </Flex>
    </a>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  isBannerVisible: boolean;
}
const MobileNav = ({ onOpen, isBannerVisible, ...rest }: MobileProps) => {
  const { session, status } = useSession();
  const router = useRouter();
  const shouldShowSearchInput =
    router.pathname === "/properties" ||
    router.pathname === "/my-properties" ||
    status === "unauthenticated";
  const { hasAccess } = useAuthorizationApi();
  return (
    <Flex
      px={{ base: 4, md: 8 }}
      height="20"
      alignItems="center"
      bg={"base.100"}
      borderBottomWidth="1px"
      borderBottomColor={"base.300"}
      justifyContent={{ base: "space-between" }}
      position="sticky"
      top={{
        base: isBannerVisible ? "3rem" : 0,
        md: isBannerVisible ? "2.5rem" : 0,
      }}
      zIndex={1000}
      {...rest}
    >
      <HStack maxW="50%">
        <Box
          w="full"
          display={{ base: "flex", md: "none" }}
          alignItems="center"
        >
          <IconButton
            mr="3"
            p="0"
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            sx={{ border: "none" }}
            icon={
              <HamburgerIcon color="base.content" width="21px" height="14px" />
            }
          />
          <AppLogo />
        </Box>
      </HStack>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="full"
      >
        <Box display={{ base: "none", md: "flex" }} justifyContent="flex-start">
          <AppLogo />
        </Box>
        {shouldShowSearchInput && (
          <>
            <Box
              display={{ base: "none", md: "flex" }}
              justifyContent="center"
              mt={3}
            >
              <SearchInput />
            </Box>
            <FilterModal />
          </>
        )}
        {status === "authenticated" ? (
          <HStack spacing={0}>
            {hasAccess(
              RoqResourceEnum.CONVERSATION,
              AccessOperationEnum.READ,
              AccessServiceEnum.PLATFORM
            ) && (
              <Box className="nav-conversation" p={2}>
                <ChatMessageBell
                  onClick={() => router.push(routes.frontend.chat.index)}
                  icon={
                    <ChatIcon color="base.content" width="20px" height="20px" />
                  }
                />
              </Box>
            )}

            <Box className="layout-notification-bell" p={2}>
              <NotificationBell
                icon={
                  <NotificationIcon
                    color="base.content"
                    width="16px"
                    height="20px"
                  />
                }
              />
            </Box>
            <Flex alignItems={"center"}>
              <Box className="layout-user-profile" p={2}>
                {session?.roqUserId && <UserAccountDropdown />}
              </Box>
            </Flex>
          </HStack>
        ) : (
          <Link href="/login">
            <Button
              leftIcon={<FiLogIn />}
              variant="solid"
              background="primary.main"
              color="white"
              borderRadius="2xl"
              _hover={{
                background: "primary.main",
                color: "white",
              }}
            >
              Login
            </Button>
          </Link>
        )}
      </Box>
    </Flex>
  );
};
