import { foo } from "../components/utils/foo";

describe("Jest Tests", () => {
  test("Verify tests work", () => {
    expect(foo()).toBeTruthy();
  });
});
