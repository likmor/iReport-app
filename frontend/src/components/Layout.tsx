import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AppShell, Group, Button, Text, Burger, Drawer, Stack, Menu, Avatar } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "My Reports", to: "/my-reports" },
  { label: "Admin Panel", to: "/admin", role: "Admin" },
];

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { isLoggedIn, fullName, email, role, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header px="xl">
        <Group h="100%" justify="space-between">
          <Text fw={800} size="xl" style={{ letterSpacing: -1 }}>
            iReport
          </Text>

          <Group gap="xs" visibleFrom="sm">
            {navLinks
              .filter((link) => !link.role || link.role === role)
              .map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "filled" : "subtle"}
                      color="lime"
                      c="dark"
                      size="sm"
                    >
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
              <Menu shadow="md" width={180}>
                <Menu.Target>
                  <Button variant="subtle" c="dark" color="lime">
                    <Group>
                      <Avatar color="lime" radius="xl" size="sm">
                        {fullName?.charAt(0).toUpperCase()}
                      </Avatar>
                      {fullName}
                    </Group>
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>{email}</Menu.Label>
                  <Menu.Label>Role: {role}</Menu.Label>
                  <Menu.Item
                    color="red"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
        </Group>
      </AppShell.Header>

      <Drawer opened={opened} onClose={close} title="Menu" hiddenFrom="sm">
        <Stack>
          {navLinks
            .filter((link) => !link.role || link.role === role)
            .map((link) => (
              <NavLink key={link.to} to={link.to} onClick={close}>
                {({ isActive }) => (
                  <Button variant={isActive ? "filled" : "subtle"} color="lime" c="dark" fullWidth>
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
            <Menu shadow="md" width={180}>
              <Menu.Target>
                <Button variant="subtle" c="dark" color="lime">
                  <Group>
                    <Avatar color="lime" radius="xl" size="sm">
                      {fullName?.charAt(0).toUpperCase()}
                    </Avatar>
                    {fullName}
                  </Group>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{email}</Menu.Label>
                <Menu.Label>Role: {role}</Menu.Label>
                <Menu.Item
                  color="red"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Stack>
      </Drawer>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
