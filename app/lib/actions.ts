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
// formData is a built-in JS object
// formData: FormData ensures that the formData parameter is correctly typed as a FormData object
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
export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
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

  export async function deleteInvoice(id: string) {
    // TEST: Throw an error when an invoice is deleted.
    // throw new Error('Failed to Delete Invoice');
    // Unreachable code block
    try{
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/dashboard/invoices');
      return { message: 'Deleted Invoice.'};
    } catch (errror) {
      return { message: 'Database Error: Failed to Delete Invoice.'};
    }
  }
