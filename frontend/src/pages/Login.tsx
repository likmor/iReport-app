import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Alert,
  CheckIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, Navigate } from "react-router-dom";
import { useLogin } from "../services/authService";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const { isLoggedIn } = useAuthStore();
  
  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
      password: (v) => (v.length < 6 ? "Password must be at least 6 characters" : null),
    },
  });

  if (isLoggedIn) return <Navigate to="/" />;

  return (
    <div
      style={{
        height: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper withBorder shadow="md" p="xl" radius="md" w={420}>
        <Title order={2} mb={4}>
          Sign in to your account
        </Title>
        <Text c="dimmed" size="sm" mb="xl">
          Don't have an account?{" "}
          <Anchor component={Link} to="/register" size="sm">
            Register
          </Anchor>
        </Text>

        {error && (
          <Alert icon={<CheckIcon size={16} />} color="red" mb="md">
            Invalid email or password
          </Alert>
        )}

        <form onSubmit={form.onSubmit((values) => login(values))}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            mb="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mb="xs"
            {...form.getInputProps("password")}
          />
          {/* <Anchor size="xs" style={{ display: "block", textAlign: "right" }} mb="xl">
            Forgot password?
          </Anchor> */}
          <Button type="submit" fullWidth color="lime" c="dark" loading={isPending}>
            Sign In
          </Button>
        </form>
      </Paper>
    </div>
  );
}
