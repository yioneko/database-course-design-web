import Login from "../components/Login";
import { users } from "../mocks/data";
import { fireEvent, render, screen } from "./utils";

describe("Login form", () => {
  beforeEach(() => {
    render(<Login visible={true} onLogin={() => {}} onCancel={() => {}} />);
  });

  it("only allow number in the userId field", async () => {
    const idInput = screen.getByPlaceholderText("id");

    fireEvent.change(idInput, { target: { value: "abc" } });
    const alert = await screen.findByText("id should only contain numbers");
    expect(alert).toBeInTheDocument();
  });

  it("shouldn't allow empty id or passowrd", async () => {
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const idAlert = await screen.findByText("'id' is required");
    expect(idAlert).toBeInTheDocument();

    const passwordAlert = await screen.findByText("password", { exact: false });
    expect(passwordAlert).toBeInTheDocument();
  });

  it("only allow login if the credential is correct", async () => {
    fireEvent.change(screen.getByPlaceholderText("id"), {
      target: { value: users.user.userId },
    });
    const passwordInput = screen.getByPlaceholderText("password");

    fireEvent.change(passwordInput, {
      target: { value: users.user.password + "!" },
    });
    const submit = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submit);
    const invalidAlert = await screen.findByText(
      "Invalid username or password"
    );
    expect(invalidAlert).toBeInTheDocument();

    fireEvent.change(passwordInput, {
      target: { value: users.user.password },
    });
    fireEvent.click(submit);
    const successAlert = await screen.findByText("Login successfully");
    expect(successAlert).toBeInTheDocument();
  });
});
