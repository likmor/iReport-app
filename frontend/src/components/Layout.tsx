import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AppShell, Group, Button, Text, Burger, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Reports", to: "/my-reports" },
];

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { isLoggedIn,fullName } = useAuthStore();
  const navigate = useNavigate();

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header px="xl">
        <Group h="100%" justify="space-between">
          <Text fw={800} size="xl" style={{ letterSpacing: -1 }}>
            iReport
          </Text>

          <Group gap="xs" visibleFrom="sm">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {({ isActive }) => (
                  <Button variant={isActive ? "light" : "subtle"} color="dark" size="sm">
                    {link.label}
                  </Button>
                )}
              </NavLink>
            ))}
            {!isLoggedIn ? (
              <Button
                variant="filled"
                color="lime"
                c="dark"
                onClick={() => {
                  navigate("/login");
                  close();
                }}
              >
                Login
              </Button>
            ) : (
              <Text>Logged in {fullName}</Text>
            )}
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
        </Group>
      </AppShell.Header>

      <Drawer opened={opened} onClose={close} title="Menu" hiddenFrom="sm" zIndex={1000}>
        <Stack>
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={close}>
              {({ isActive }) => (
                <Button variant={isActive ? "light" : "subtle"} color="dark" fullWidth>
                  {link.label}
                </Button>
              )}
            </NavLink>
          ))}
          {!isLoggedIn ? (
            <Button
              variant="filled"
              color="lime"
              c="dark"
              onClick={() => {
                navigate("/login");
                close();
              }}
            >
              Login
            </Button>
          ) : (
            <Text>Logged in  {fullName}</Text>
          )}
        </Stack>
      </Drawer>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
