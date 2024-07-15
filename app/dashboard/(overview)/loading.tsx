// Implement streaming at the page level with a loading.tsx file
// Loading skeleton is a simplified version of the UI used as a fallback to indicate to the users that the content is loading 
/* 1. loading.tsx is a special Next.js file built on top of Suspense, 
 it allows you to create fallback UI to show as a replacement while page content loads. */
/* 2. Since <SideNav is static, it's shown immediately. The user can interact with <SideNav> while the dynamic content is loading. */
/* 3. The user doesn't have to wait for the page to finish loading before navigating away (this is called interruptable navigation). */
import DashboardSkeleton from '@/app/ui/skeletons'; 

export default function Loading(){
    return <DashboardSkeleton />;
};