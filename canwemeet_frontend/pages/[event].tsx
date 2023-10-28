import React from "react";
import { useRouter } from 'next/router';

export default function Event() {
    const router = useRouter();
    const currentUrl = router.asPath;

    return (
        <div>{currentUrl}</div>
    )
}