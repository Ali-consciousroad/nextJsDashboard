// " use server " marks all the exported functions within the file as Server Actions.
/* Server Actions could have been written directly inside Server Components by adding "use server" inside the action.
but for this course, we preferred to keep them all organized in a separate file. */
'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
// Import Zod, a TypeScript-first validation library 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
        }
      }
      throw error;
    }
  }
  
/* The schema that matches the form of our object will validate the formData 
before saving it to the DB. */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
      .number() // The amount field is set to coerce (change) from a string to a number while also validating its type
      .gt(0, { message: 'Please enter an amount greater than $0.'}),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

// Use Zod to update and create the expected types 
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Extract the data from formData
// formData is a built-in JS object
// formData: FormData ensures that the formData parameter is correctly typed as a FormData object
/* prevState: contains the state passed from the  hook.
   We won't be using it in the action in this example but it's a required prop. */
export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    /* safeParse() will return an object containing either a success or error field. 
    This will help handle validation more gracefully 
    without having put this logic inside the try/catch block compared with the previous .parse() used. */
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return erros early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
        };
      }
      // TEST 
      // Console.log validatedFields and submit an empty form to see the shape of it.
      // console.log(validatedFields);

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    // Convert the amount into cents
    const amountInCents = amount * 100; 
    // Create a new date for the invoice's creation date
    const date = new Date().toISOString().split('T')[0];

    // Add JS's try/catch statements to the Server Actions
    try {
    // Insert the data into the database
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
    /* We're updating the data displayed in the invoices route 
    so we want to clear this cache and trigger a new request to the server.
    This is possible thanks to the revalidatePath function from Next.js */
    revalidatePath('/dashboard/invoices');
    /* We need to keep the redirect() function outside of the try/catch block.
    This is because " redirect " works by throwing an error which would be caught by the catch block. */  
    redirect('/dashboard/invoices');
}

// Steps are similar to the createInvoice action 
// Update action
export async function updateInvoice(
  id: string, 
  prevState: State,
  formData: FormData,
) {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to update invoice.",
      };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
   
    try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Invoice.'};
    }
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  // Delete action
  export async function deleteInvoice(id: string) {
    // TEST: Throw an error when an invoice is deleted.
    // throw new Error('Failed to Delete Invoice');
    // Unreachable code block
    try{
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/dashboard/invoices');
      return { message: 'Deleted Invoice.'};
    } catch (error) {
      return { message: 'Database Error: Failed to Delete Invoice.'};
    }
  }
