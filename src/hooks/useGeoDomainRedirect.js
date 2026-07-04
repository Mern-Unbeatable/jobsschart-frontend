import { useEffect } from 'react';

function useGeoDomainRedirect() {
    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            try {
                const host = window.location.hostname.toLowerCase();
                const eligibleHosts = ['illorac.nl', 'www.illorac.nl', 'illorac.com', 'www.illorac.com'];

                if (!eligibleHosts.includes(host)) return;

                const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://api.illorac.nl';
                const res = await fetch(`${apiBase}/geo-routing`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { Accept: 'application/json' },
                });

                if (!res.ok || !isMounted) return;

                const data = await res.json();
                if (!isMounted || !data?.shouldRedirect || !data?.targetDomain) return;

                const currentHost = host.replace(/^www\./, '');
                const targetHost = String(data.targetDomain).toLowerCase().replace(/^www\./, '');

                if (currentHost === targetHost) return;

                const nextUrl =
                    `${window.location.protocol}//${targetHost}` +
                    `${window.location.pathname}${window.location.search}${window.location.hash}`;

                window.location.replace(nextUrl);
            } catch {
                // Fail silently to avoid blocking app render.
            }
        };

        void run();

        return () => {
            isMounted = false;
        };
    }, []);
}

export default useGeoDomainRedirect;