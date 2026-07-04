import { useEffect } from 'react';

function useGeoDomainRedirect() {
    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            try {
                const host = window.location.hostname.toLowerCase();
                const eligibleHosts = ['illorac.nl', 'www.illorac.nl', 'illorac.com', 'www.illorac.com'];

                if (!eligibleHosts.includes(host)) return;

                const currentHost = host.replace(/^www\./, '');
                const viteApiBase =
                    typeof import.meta !== 'undefined' && import.meta.env
                        ? import.meta.env.VITE_API_BASE_URL
                        : undefined;
                const configuredApiBase =
                    viteApiBase || process.env.REACT_APP_API_BASE_URL || 'https://api.illorac.nl';

                let geoRoutingUrl = 'https://api.illorac.nl/geo-routing';
                try {
                    geoRoutingUrl = `${new URL(configuredApiBase).origin}/geo-routing`;
                } catch {
                    const fallbackBase = String(configuredApiBase).replace(/\/+$/, '');
                    geoRoutingUrl = `${fallbackBase}/geo-routing`;
                }

                const res = await fetch(geoRoutingUrl, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { Accept: 'application/json' },
                });

                if (!res.ok || !isMounted) return;

                const data = await res.json();
                if (!isMounted || !data?.targetDomain) return;


                const targetHost = String(data.targetDomain).toLowerCase().replace(/^www\./, '');
                if (currentHost === targetHost) return;

                const nextUrl =
                    `${window.location.protocol}//${targetHost}` +
                    `${window.location.pathname}${window.location.search}${window.location.hash}`;

                window.location.replace(nextUrl);
            } catch {

            }
        };

        void run();

        return () => {
            isMounted = false;
        };
    }, []);
}

export default useGeoDomainRedirect;