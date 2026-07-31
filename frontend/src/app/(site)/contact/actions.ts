"use server";

type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const email = formData.get("email");
  const fullName = formData.get("full_name");
  const phone = formData.get("phone");

  if (typeof email !== "string" || typeof fullName !== "string" || !email || !fullName) {
    return { status: "error", message: "Please provide your name and email." };
  }

  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:8000";

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        full_name: fullName,
        phone: typeof phone === "string" && phone ? phone : null,
      }),
    });

    if (!response.ok) {
      return { status: "error", message: "Something went wrong. Please try again or call us directly." };
    }

    return { status: "success", message: "Thank you. We'll be in touch shortly." };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again or call us directly." };
  }
}
