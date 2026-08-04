import { baseApi } from '../baseApi';

export const consultantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ========== PUBLIC ROUTES ==========
        getAllConsultants: builder.query({
            query: (params = {}) => ({
                url: '/consultants',
                method: 'GET',
                params,
            }),
            providesTags: ['Consultant'],
            transformResponse: (response) => response.data,
        }),

        getTopConsultants: builder.query({
            query: (params = {}) => ({
                url: '/consultants/top',
                method: 'GET',
                params,
            }),
            providesTags: ['Consultant'],
            transformResponse: (response) => response.data,
        }),

        getConsultantById: builder.query({
            query: (id) => ({
                url: `/consultants/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Consultant', id }],
            transformResponse: (response) => response.data,
        }),

        getConsultantAvailability: builder.query({
            query: ({ id, date } = {}) => ({
                url: `/availability/consultants/${id}/slots`,
                method: 'GET',
                params: date ? { date } : {},
            }),
            providesTags: (result, error, { id } = {}) => [{ type: 'Availability', id }],
            transformResponse: (response) => response.data,
        }),

        // Weekly-only availability (separate cache from date-specific queries)
        getConsultantWeeklyAvailability: builder.query({
            query: (id) => ({
                url: `/availability/consultants/${id}/slots`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Availability', id }],
            transformResponse: (response) => response.data,
        }),

        // Date-specific bookable slots (separate cache from weekly query)
        getConsultantDateAvailability: builder.query({
            query: ({ id, date }) => ({
                url: `/availability/consultants/${id}/slots`,
                method: 'GET',
                params: { date },
            }),
            providesTags: (result, error, { id } = {}) => [{ type: 'Availability', id }],
            transformResponse: (response) => response.data,
        }),

        getConsultantReviews: builder.query({
            query: ({ id, params = {} }) => ({
                url: `/consultants/${id}/reviews`,
                method: 'GET',
                params,
            }),
            providesTags: (result, error, { id }) => [{ type: 'Review', id }],
            transformResponse: (response) => response.data,
        }),

        // ========== PROTECTED ROUTES (Consultant only) ==========
        getMyConsultantProfile: builder.query({
            query: () => ({
                url: '/consultants/me/profile',
                method: 'GET',
            }),
            providesTags: ['MyConsultantProfile'],
            transformResponse: (response) => response.data,
        }),

        updateMyConsultantProfile: builder.mutation({
            query: (data) => ({
                url: '/consultants/me/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['MyConsultantProfile', 'Consultant'],
            transformResponse: (response) => response.data,
        }),

        updateOnlineStatus: builder.mutation({
            query: (data) => ({
                url: '/consultants/me/status',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['MyConsultantProfile', 'Consultant'],
            transformResponse: (response) => response.data,
        }),

        getMyEarnings: builder.query({
            query: (params = {}) => ({
                url: '/consultants/me/earnings',
                method: 'GET',
                params,
            }),
            providesTags: ['Earnings'],
            transformResponse: (response) => response.data,
        }),

        getMyEarningsDashboard: builder.query({
            query: () => ({
                url: '/consultants/me/earnings/dashboard',
                method: 'GET',
            }),
            providesTags: ['Earnings'],
            transformResponse: (response) => response.data,
        }),

        getRecentClients: builder.query({
            query: () => ({
                url: '/sessions/consultant/recent-clients',
                method: 'GET',
            }),
            providesTags: ['Session'],
            transformResponse: (response) => response.data,
        }),

        getMyStats: builder.query({

            query: () => ({
                url: '/consultants/me/stats',
                method: 'GET',
            }),
            providesTags: ['Stats'],
            transformResponse: (response) => response.data,
        }),

        getMyAvailabilitySlots: builder.query({
            query: (params = {}) => ({
                url: '/availability/my-slots',
                method: 'GET',
                params,
            }),
            providesTags: ['AvailabilitySlots'],
            transformResponse: (response) => {
                const data = response?.data || response;
                const weeklySlots = data?.weeklySlots || [];
                const allSlots = data?.allSlots || [];
                const rawSlots = weeklySlots.length > 0 ? weeklySlots : (data?.slots || allSlots || []);

                const slots = [...rawSlots]
                    .map((slot) => ({
                        id: slot.id,
                        dayOfWeek: slot.dayOfWeek,
                        dayLabel: slot.dayLabel || slot.dayOfWeek,
                        dayOrder: typeof slot.dayOrder === 'number' ? slot.dayOrder : undefined,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isActive: slot.isActive !== false,
                        type: slot.type || 'weekly',
                    }))
                    .filter((slot) => slot.isActive !== false)
                    .sort((a, b) => {
                        if (typeof a.dayOrder === 'number' && typeof b.dayOrder === 'number') {
                            return a.dayOrder - b.dayOrder;
                        }
                        return String(a.dayOfWeek || '').localeCompare(String(b.dayOfWeek || ''));
                    });

                return { slots, weeklySlots, allSlots };
            },
        }),

        addAvailabilitySlots: builder.mutation({
            query: (data) => {
                const toApiSlot = (slot = {}) => ({
                    dayOfWeek: (
                        slot.dayOfWeek ||
                        slot.day ||
                        data.dayOfWeek ||
                        data.day ||
                        'SUNDAY'
                    )
                        .toString()
                        .toUpperCase(),
                    startTime: slot.startTime || slot.from || data.from || data.startTime || '09:00',
                    endTime: slot.endTime || slot.to || data.to || data.endTime || '21:00',
                });

                const slots = Array.isArray(data?.slots)
                    ? data.slots.map(toApiSlot)
                    : [toApiSlot(data)];

                return {
                    url: '/availability/slots/bulk',
                    method: 'POST',
                    body: { slots },
                };
            },
            invalidatesTags: ['AvailabilitySlots', 'Availability'],
            transformResponse: (response) => response.data,
        }),

        updateAvailabilitySlot: builder.mutation({
            query: ({ slotId, ...data }) => {
                const body = {};
                if (data.dayOfWeek || data.day) {
                    body.dayOfWeek = (data.dayOfWeek || data.day).toString().toUpperCase();
                }
                if (data.startTime || data.from) {
                    body.startTime = data.startTime || data.from;
                }
                if (data.endTime || data.to) {
                    body.endTime = data.endTime || data.to;
                }
                return {
                    url: `/availability/slots/${slotId}`,
                    method: 'PATCH',
                    body,
                };
            },
            invalidatesTags: ['AvailabilitySlots', 'Availability'],
            transformResponse: (response) => response.data,
        }),

        deleteAvailabilitySlot: builder.mutation({
            query: (slotId) => ({
                url: `/availability/slots/${slotId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AvailabilitySlots', 'Availability'],
            transformResponse: (response) => response.data,
        }),

        getMonthlyInvoices: builder.query({
            query: () => '/consultants/me/invoices',
            providesTags: ['Invoices'],
            transformResponse: (response) => response?.data?.invoices || [],
        }),

        updateVerificationInfo: builder.mutation({
            query: (data) => ({
                url: '/consultants/me/verification',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['MyConsultantProfile'],
            transformResponse: (response) => response.data,
        }),

        getPendingVerifications: builder.query({
            query: () => '/consultants/admin/verifications',
            providesTags: ['Consultant'],
            transformResponse: (response) => response?.data?.consultants || [],
        }),

        reviewVerification: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/consultants/${id}/verification-review`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Consultant', 'MyConsultantProfile'],
            transformResponse: (response) => response.data,
        }),

        updateScheduleStatus: builder.mutation({
            query: ({ scheduleId, ...data }) => ({
                url: `/consultants/me/schedules/${scheduleId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['AvailabilitySlots', 'Availability', 'Schedule'],
            transformResponse: (response) => response.data,
        }),

        addConsultantReview: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/consultants/${id}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Review', id },
                'Consultant',
            ],
            transformResponse: (response) => response.data,
        }),

        // ========== ADMIN ONLY ROUTES ==========
        approveConsultant: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/consultants/${id}/approve`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Consultant', id },
                'Consultant',
            ],
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    // Public queries
    useGetAllConsultantsQuery,
    useGetTopConsultantsQuery,
    useGetConsultantByIdQuery,
    useGetConsultantAvailabilityQuery,
    useGetConsultantWeeklyAvailabilityQuery,
    useGetConsultantDateAvailabilityQuery,
    useGetConsultantReviewsQuery,

    // Consultant profile (protected)
    useGetMyConsultantProfileQuery,
    useUpdateMyConsultantProfileMutation,
    useUpdateOnlineStatusMutation,
    useGetMyEarningsQuery,
    useGetMyEarningsDashboardQuery,
    useGetMyStatsQuery,
    useGetRecentClientsQuery,

    // Availability slots (protected)
    useGetMyAvailabilitySlotsQuery,
    useAddAvailabilitySlotsMutation,
    useUpdateAvailabilitySlotMutation,
    useDeleteAvailabilitySlotMutation,
    useGetMonthlyInvoicesQuery,
    useUpdateVerificationInfoMutation,
    useGetPendingVerificationsQuery,
    useReviewVerificationMutation,
    useUpdateScheduleStatusMutation,

    // Reviews (public but requires auth)
    useAddConsultantReviewMutation,

    // Admin only
    useApproveConsultantMutation,
} = consultantApi;