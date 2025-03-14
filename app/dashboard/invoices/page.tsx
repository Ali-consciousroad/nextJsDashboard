import { Metadata } from 'next';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
 
export const metadata: Metadata = {
  title: 'Invoices',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // Pass the query from searchParams as an argument 
  // fetchInvoicesPages return the total number of pages based on the search query
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* The <Search/> component allows users to search for specific invoices */}
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {/* The <Table/> component displays the invoices */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> 
      {/* The <Pagingation/> component allows users to navigate between pages of invoices. */}
      <div className="mt-5 flex w-full justify-center">
        {/* Pass the totalPages prop to the <Pagination/> component */}
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}