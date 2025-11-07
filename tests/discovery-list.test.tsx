import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect } from "vitest";
import { DiscoveryList } from "@/components/DiscoveryList";

const member = (id: string) => ({
  id,
  display_name: `Member ${id}`,
  avatar_url: null,
  level: "guest",
  bio: null,
  reputation_score: 0,
  created_at: "",
  updated_at: "",
});

describe("DiscoveryList", () => {
  it("renders mutuals with avatars", () => {
    const markup = renderToStaticMarkup(
      <DiscoveryList
        mutuals={[
          { member: member("2"), mutuals: [member("3"), member("4"), member("5")] },
        ]}
        sharedInterests={[{ member: member("6") }]}
        trending={[{ member: member("7") }]}
      />
    );
    expect(markup).toMatchSnapshot();
  });
});
