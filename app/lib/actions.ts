// Mark all the exported functions within the file as Server Actions.
/* Server Actions could have been written directly inside Server Components by adding "use server" inside the action.
For this course, we preferred to keep them all organized in a separate file. */
'use server';
// Import Zod, a TypeScript-first validation library 
import { z } from 'zod';

/* The schema that matches the form of our object will validate the formData 
before saving it to the DB. */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), // The amount field is set to coerce (change) from a string to a number while also validating its type
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

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
    const date = new Date().toISOString().split('T')[0];
}
