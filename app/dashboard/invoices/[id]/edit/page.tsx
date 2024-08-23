// 1. Create a new route and form 
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string }}) {
    const id = params.id;
    // Fetch both the invoice and customers in parallel by using Promise.all
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    if (!invoice) {
      notFound();
    }
    /* The URL should also be updated with an id as follows: 
    http://localhost:3000/dashboard/invoice/uuid/edit
    
    UUIDS is used here instead of auto-incrementing keys for the URL. 
    This makes the URL longer but eliminate the risk of ID collision. */
    return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}