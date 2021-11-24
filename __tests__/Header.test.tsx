import Header from "../components/Header";
import { fireEvent, render, screen, waitFor } from "./utils";
import { users } from "../mocks/data";

describe("Header", () => {
  it("should render a login button with no user logged in", async () => {
    render(<Header />);
    const button = screen.getByRole("button", { name: "Login" });
    fireEvent.click(button);

    const modal = await screen.findByRole("dialog");
    expect(modal).toHaveTextContent(/login/i);
  });

  it("should render a user avatar and username if a user logged in", async () => {
    const { container } = render(<Header />, { defaultUser: users.user });
    expect(container.querySelector(".anticon-user")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(users.user.name)).toBeInTheDocument();
    });
  });
});
