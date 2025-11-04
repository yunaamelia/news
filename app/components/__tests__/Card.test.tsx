import { fireEvent, render, screen } from "@testing-library/react";
import Card from "../ui/Card";

describe("Card Component", () => {
  it("should render children", () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("should apply default padding", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("p-6");
  });

  it("should apply custom padding", () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("p-8");
  });

  it('should apply no padding when padding="none"', () => {
    const { container } = render(<Card padding="none">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain("p-");
  });

  it("should apply hover class when hover prop is true", () => {
    const { container } = render(<Card hover>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card-hover");
    expect(card.className).toContain("cursor-pointer");
  });

  it("should not apply hover class by default", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain("card-hover");
  });

  it("should handle onClick events", () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <p>Clickable card</p>
      </Card>
    );

    fireEvent.click(screen.getByText("Clickable card"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply custom className", () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("custom-card");
  });

  it("should always have base card-primary class", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card-primary");
  });
});
