// Mark all the exported functions within the file as Server Actions.
/* Server Actions could have been written directly inside Server Components by adding "use server" inside the action.
For this course, we preferred to keep them all organized in a separate file. */
'use server';

export async function createInvoice(formData: FormData) {}
