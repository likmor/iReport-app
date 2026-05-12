import { TextInput, PasswordInput, Button, Paper, Title, Text, Anchor, Alert, ActionIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link } from "react-router-dom";
import { useRegister } from "../services/authService";

export default function RegisterPage() {
  const { mutate: register, isPending, error } = useRegister();

  const form = useForm({
    initialValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    validate: {
      fullName: (v) => (v.trim().length < 2 ? "Name is too short" : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
      password: (v) => (v.length < 6 ? "Password must be at least 6 characters" : null),
      confirmPassword: (v, values) => (v !== values.password ? "Passwords do not match" : null),
    },
  });

  return (
    <div style={{ height: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper withBorder shadow="md" p="xl" radius="md" w={420}>
        <Title order={2} mb={4}>Create an account</Title>
        <Text c="dimmed" size="sm" mb="xl">
          Already have an account?{" "}
          <Anchor component={Link} to="/login" size="sm">Sign in</Anchor>
        </Text>

        {error && (
          <Alert icon={<ActionIcon size={16} />} color="red" mb="md">
            Registration failed. Email may already be in use.
          </Alert>
        )}

        <form onSubmit={form.onSubmit(({ confirmPassword, ...values }) => register(values))}>
          <TextInput
            label="Full Name"
            placeholder="Jan Kowalski"
            mb="md"
            {...form.getInputProps("fullName")}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            mb="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="At least 6 characters"
            mb="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Repeat your password"
            mb="xl"
            {...form.getInputProps("confirmPassword")}
          />
          <Button type="submit" fullWidth color="lime" c="dark" loading={isPending}>
            Create Account
          </Button>
        </form>
      </Paper>
    </div>
  );
}