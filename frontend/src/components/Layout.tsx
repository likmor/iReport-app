import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AppShell, Group, Button, Text, Burger, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Reports", to: "/reports" },
];

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure(false);
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
            <Button variant="filled"  c="dark" onClick={() => navigate("/login")}>
              Login
            </Button>
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
        </Group>
      </AppShell.Header>

      <Drawer opened={opened} onClose={close} title="Menu" hiddenFrom="sm">
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
        </Stack>
      </Drawer>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
