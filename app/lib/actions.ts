// " use server " marks all the exported functions within the file as Server Actions.
/* Server Actions could have been written directly inside Server Components by adding "use server" inside the action.
but for this course, we preferred to keep them all organized in a separate file. */
'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
// Import Zod, a TypeScript-first validation library 
import { z } from 'zod';
import { sql } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

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
  try {
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    const id = uuidv4();

    await sql`
      INSERT INTO invoices (id, customer_id, amount, status, date)
      VALUES (${id}, ${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
}

// Steps are similar to the createInvoice action 
// Update action
export async function updateInvoice(
  id: string,
  formData: FormData,
) {
  try {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}::uuid
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
}

// Delete action
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}::uuid`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
