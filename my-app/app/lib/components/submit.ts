// lib/submit.ts
"use server";

import { sql } from "@vercel/postgres";
import { z } from "zod"; // Using Zod for server-side validation

// Define a schema for your form data
const FormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
});

// Define the shape of the state object that the action will return
export type FormState = {
    success: boolean;
    message: string;
    errors?: {
        name?: string[];
        email?: string[];
    };
};

/**
 * The 'submit' server action.
 *
 * @param prevState - The previous state of the form (required by useFormState).
 * @param formData - The data submitted from the form.
 * @returns A new state object with a message and success status.
 */
export async function submit(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    // 1. Convert FormData to a plain object
    const rawData = Object.fromEntries(formData.entries());

    // 2. Validate the data using Zod
    const validatedFields = FormSchema.safeParse(rawData);

    // 3. If validation fails, return the errors
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed. Please check your inputs.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // 4. If validation succeeds, get the data
    const { name, email } = validatedFields.data;

    // 5. Try inserting the data into the database
    try {
        // --- THIS IS THE NEW PART ---
        // This query inserts the validated data into your Vercel Postgres DB
        await sql`
      INSERT INTO subscribers (name, email) 
      VALUES (${name}, ${email})
    `;
        // --- End database call ---

        // 6. Return a success message
        return {
            success: true,
            message: `Success! Welcome, ${name}. Your email (${email}) is registered.`,
        };
    } catch (error) {
        // 7. Handle any database errors
        console.error("Database submission error:", error);
        return {
            success: false,
            message: "Database error. Failed to subscribe. Please try again.",
        };
    }
}