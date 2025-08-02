"use client";
import Homepage from "@/screen/Homepage";
import Naviagtion from "@/components/Navigation"
import { useClient } from '@/context';

function Page() {
        const { userMetadata, setUserMetadata } = useClient();
    return (
        <div className="fit-container flex flex-col justify-center my-3 gap-3">
            <Naviagtion />
            {userMetadata && (
                <Homepage />
            )}
        </div>
    )
}

export default Page