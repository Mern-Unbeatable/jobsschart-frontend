import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import ActivitiesContent from '../components/activities/ActivitiesContent';

const Activities = memo(() => {
  useSEO({
    title: 'Activities, Events & Workshops',
    description: 'Discover and register for upcoming spiritual events, gatherings, interactive masterclasses, and workshops.',
    keywords: ['activities', 'events', 'workshops', 'webinars', 'spiritual gatherings', 'masterclass'],
  });

  return <ActivitiesContent />;
});

Activities.displayName = 'Activities';

export default Activities;

