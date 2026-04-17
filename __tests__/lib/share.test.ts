import {
  getSpiceEmoji,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  buildShareData,
} from "@/lib/share";

const mockRecipe = {
  slug: "pesarattu",
  name_english: "Pesarattu",
  name_telugu: "పెసరట్టు",
  region: "coastal-andhra",
  spice_level: "medium",
  diet: "veg" as const,
};

describe("getSpiceEmoji", () => {
  it("returns single chilli for mild", () => {
    expect(getSpiceEmoji("mild")).toBe("🌶");
  });

  it("returns five chillies for kramp", () => {
    expect(getSpiceEmoji("kramp")).toBe("🌶🌶🌶🌶🌶");
  });

  it("returns empty string for unknown level", () => {
    expect(getSpiceEmoji("unknown")).toBe("");
  });
});

describe("buildWhatsAppMessage", () => {
  it("includes Telugu name, English name, and link", () => {
    const msg = buildWhatsAppMessage(mockRecipe, "https://andhra-vantalu.com");
    expect(msg).toContain("పెసరట్టు");
    expect(msg).toContain("Pesarattu");
    expect(msg).toContain("https://andhra-vantalu.com/recipe/pesarattu");
  });

  it("includes spice emoji and region", () => {
    const msg = buildWhatsAppMessage(mockRecipe, "https://example.com");
    expect(msg).toContain("🌶🌶");
    expect(msg).toContain("Coastal Andhra");
  });

  it("includes branding", () => {
    const msg = buildWhatsAppMessage(mockRecipe, "https://example.com");
    expect(msg).toContain("Andhra Vantalu");
  });
});

describe("buildWhatsAppUrl", () => {
  it("creates encoded whatsapp deep link", () => {
    const url = buildWhatsAppUrl("hello world");
    expect(url).toBe("whatsapp://send?text=hello%20world");
  });
});

describe("buildShareData", () => {
  it("returns Web Share API compatible object", () => {
    const data = buildShareData(mockRecipe, "https://example.com");
    expect(data).toEqual({
      title: "పెసరట్టు (Pesarattu)",
      text: "Authentic Coastal Andhra recipe 🌶🌶",
      url: "https://example.com/recipe/pesarattu",
    });
  });
});
