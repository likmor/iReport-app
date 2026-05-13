import {
  Title,
  Table,
  Badge,
  Select,
  Group,
  Text,
  Center,
  Loader,
  Stack,
  Paper,
  Avatar,
} from "@mantine/core";
import { useAdminUsers, useChangeRole } from "../services/adminService";
import type { Roles } from "@/types/auth";

const ROLE_COLORS: Record<string, string> = {
  Citizen: "gray",
  Official: "blue",
  Admin: "red",
};

export default function AdminPanel() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutate: changeRole } = useChangeRole();

  if (isLoading)
    return (
      <Center h="calc(100vh - 60px)">
        <Loader color="lime" />
      </Center>
    );

  return (
    <Stack p="xl" maw={900} mx="auto">
      <Group justify="space-between">
        <Title order={3}>User Management</Title>
        <Text size="sm" c="dimmed">
          {users?.length ?? 0} users
        </Text>
      </Group>

      <Paper withBorder radius="md">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Joined</Table.Th>
              <Table.Th>Role</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users?.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Text size="sm" fw={500}>
                      {user.id}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar color="lime" radius="xl" size="sm">
                      {user.fullName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Text size="sm" fw={500}>
                      {user.fullName}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {user.email}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Select
                    size="xs"
                    w={120}
                    value={user.role}
                    data={["User", "Official", "Admin"] as Roles[]}
                    onChange={(role) => role && changeRole({ id: user.id, role })}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
