'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    /* URLSearchParams is a web API that provides utility methods 
    for simplified URL query parameters manipulation */
    const params = new URLSearchParams(searchParams);
    // If the input is empty, then delete it
    if (term) {
      params.set('query', term);}
    else {
      params.delete('query');
    }
    // ${pathname} is the current path, in this case, "/dashboard/invoices"
    // Updates the URL with the user's search data
    replace(`${pathname}?${params.toString()}`);
  }, 500);
  
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      {/* By adding an onChange listener to the <input> element, 
          onChange will invoke handleSearch whenever the input value changes. */}
      {/* The defaultValue for the input by reading from searchParams will ensure 
      the input field is in sync with the URL and will be populated when sharing, 
      if we're using state to manage the value of an input, which is currently not the case, we'd use the "value" attribute 
      to make it a controlled component. */}     
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
