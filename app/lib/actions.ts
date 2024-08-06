// Mark all the exported functions within the file as Server Actions.
/* Server Actions could have been written directly inside Server Components by adding "use server" inside the action.
For this course, we preferred to keep them all organized in a separate file. */
'use server';
// Import Zod, a TypeScript-first validation library 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/* The schema that matches the form of our object will validate the formData 
before saving it to the DB. */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), // The amount field is set to coerce (change) from a string to a number while also validating its type
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

// Use Zod to update and create the expected types 
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// Extract the data from formData
export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // Convert the amount into cents
    const amountInCents = amount * 100; 
    // Create a new date for the invoice's creation date
    const date = new Date().toISOString().split('T')[0];

    // Insert the data into the database
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    /* We're updating the data displayed in the invoices route 
    so we want to clear this cache and trigger a new request to the server.
    This is possible thanks to the revalidatePath function from Next.js */
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// Steps are similar to the createInvoice action 
export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }
