// Mark all the exported functions within the file as Server Actions.
/* Server Actions could have been written directly inside Server Components by adding "use server" inside the action.
For this course, we preferred to keep them all organized in a separate file. */
'use server';

// Extract the data from formData
export async function createInvoice(formData: FormData) {
    const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    };
    // Test it out:
    // Display the form in the terminal after submitting it
    console.log(rawFormData);
}
