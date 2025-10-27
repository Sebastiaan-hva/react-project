// app/page.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submit, type FormState } from "@/app/lib/components/submit"; // Your import

// 1. Define the initial state for the form
const initialState: FormState = {
  success: false,
  message: "",
};

// 2. Create a separate component for the submit button
// This allows it to use the useFormStatus hook without
// affecting the form state itself.
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

// 3. Create your form component
export default function MyForm() {
  // 4. Hook up the server action with useFormState
  const [state, formAction] = useFormState(submit, initialState);

  return (
    <form action={formAction}>
      <h2>My Form</h2>

      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" className="my-text-input" />
        {/* Display validation errors for 'name' */}
        {state.errors?.name && (
          <p style={{ color: "red" }}>{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" className="my-text-input" />
        {/* Display validation errors for 'email' */}
        {state.errors?.email && (
          <p style={{ color: "red" }}>{state.errors.email[0]}</p>
        )}
      </div>

      <SubmitButton />

      {/* 5. Display the final success or error message */}
      {state.message && (
        <p style={{ color: state.success ? "green" : "red" }}>
          {state.message}
        </p>
      )}
    </form>
  );
}