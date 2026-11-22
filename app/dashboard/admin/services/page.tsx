import { ManageServices } from '@/app/components/manage-service';
import { getService } from '@/lib/api/services';
import { getSession } from '@/lib/core/server';

import React from 'react';

export const instant = false;

const ManageServicesPage = async () => {
    const session = await getSession();
    const res = await getService(`adminId=${session?.user.id}`);
    console.log(res)
    return (
        <main className="min-h-screen bg-[#fdf9f6] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-[1600px]">
                <ManageServices services={res} error={null}/>
            </div>
        </main>
    );
};

export default ManageServicesPage;
