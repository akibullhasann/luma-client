import { getService } from '@/lib/api/services';
import { getSession } from '@/lib/core/server';
import Image from 'next/image';

import React from 'react';

const ManageServicesPage = async () => {
    const session = await getSession();
    const res = await getService(`adminId=${session?.user.id}`);
    console.log(res)
    return (
        <div>
            services page
            <Image
                src={res[0].image}
                alt="Service image"
                width={300}
                height={200}
            />
        </div>
    );
};

export default ManageServicesPage;
