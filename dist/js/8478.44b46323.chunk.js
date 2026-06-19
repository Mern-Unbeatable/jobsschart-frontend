/*! For license information please see 8478.44b46323.chunk.js.LICENSE.txt */
"use strict";
(self.webpackChunkreact_webpack_tailwind_app =
  self.webpackChunkreact_webpack_tailwind_app || []).push([
  [8478],
  {
    17788(e, t, n) {
      n.d(t, {
        Er: () => f,
        LK: () => g,
        R5: () => m,
        TQ: () => v,
        UO: () => y,
        c_: () => p,
        gj: () => d,
        lK: () => l,
        vU: () => c,
      });
      var r = n(69215),
        a = ["scheduleId"],
        s = ["id"],
        o = ["id"];
      function i(e, t) {
        if (null == e) return {};
        var n,
          r,
          a = (function (e, t) {
            if (null == e) return {};
            var n = {};
            for (var r in e)
              if ({}.hasOwnProperty.call(e, r)) {
                if (-1 !== t.indexOf(r)) continue;
                n[r] = e[r];
              }
            return n;
          })(e, t);
        if (Object.getOwnPropertySymbols) {
          var s = Object.getOwnPropertySymbols(e);
          for (r = 0; r < s.length; r++)
            ((n = s[r]),
              -1 === t.indexOf(n) &&
                {}.propertyIsEnumerable.call(e, n) &&
                (a[n] = e[n]));
        }
        return a;
      }
      var u = r.q.injectEndpoints({
          endpoints: function (e) {
            return {
              getAllConsultants: e.query({
                query: function () {
                  return {
                    url: "/consultants",
                    method: "GET",
                    params:
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                  };
                },
                providesTags: ["Consultant"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getTopConsultants: e.query({
                query: function () {
                  return {
                    url: "/consultants/top",
                    method: "GET",
                    params:
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                  };
                },
                providesTags: ["Consultant"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getConsultantById: e.query({
                query: function (e) {
                  return { url: "/consultants/".concat(e), method: "GET" };
                },
                providesTags: function (e, t, n) {
                  return [{ type: "Consultant", id: n }];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getConsultantAvailability: e.query({
                query: function (e) {
                  return {
                    url: "/consultants/".concat(e, "/availability"),
                    method: "GET",
                  };
                },
                providesTags: function (e, t, n) {
                  return [{ type: "Availability", id: n }];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getConsultantReviews: e.query({
                query: function (e) {
                  var t = e.id,
                    n = e.params,
                    r = void 0 === n ? {} : n;
                  return {
                    url: "/consultants/".concat(t, "/reviews"),
                    method: "GET",
                    params: r,
                  };
                },
                providesTags: function (e, t, n) {
                  return [{ type: "Review", id: n.id }];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getMyConsultantProfile: e.query({
                query: function () {
                  return { url: "/consultants/me/profile", method: "GET" };
                },
                providesTags: ["MyConsultantProfile"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              updateMyConsultantProfile: e.mutation({
                query: function (e) {
                  return {
                    url: "/consultants/me/profile",
                    method: "PATCH",
                    body: e,
                  };
                },
                invalidatesTags: ["MyConsultantProfile", "Consultant"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              updateOnlineStatus: e.mutation({
                query: function (e) {
                  return {
                    url: "/consultants/me/status",
                    method: "PATCH",
                    body: e,
                  };
                },
                invalidatesTags: ["MyConsultantProfile", "Consultant"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getMyEarnings: e.query({
                query: function () {
                  return {
                    url: "/consultants/me/earnings",
                    method: "GET",
                    params:
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                  };
                },
                providesTags: ["Earnings"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getMyStats: e.query({
                query: function () {
                  return { url: "/consultants/me/stats", method: "GET" };
                },
                providesTags: ["Stats"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getMyAvailabilitySlots: e.query({
                query: function () {
                  return {
                    url: "/consultants/me/slots",
                    method: "GET",
                    params:
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                  };
                },
                providesTags: ["AvailabilitySlots"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              addAvailabilitySlots: e.mutation({
                query: function (e) {
                  return {
                    url: "/consultants/me/slots",
                    method: "POST",
                    body: e,
                  };
                },
                invalidatesTags: ["AvailabilitySlots", "Availability"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              deleteAvailabilitySlot: e.mutation({
                query: function (e) {
                  return {
                    url: "/consultants/me/slots/".concat(e),
                    method: "DELETE",
                  };
                },
                invalidatesTags: ["AvailabilitySlots", "Availability"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              updateScheduleStatus: e.mutation({
                query: function (e) {
                  var t = e.scheduleId,
                    n = i(e, a);
                  return {
                    url: "/consultants/me/schedules/".concat(t),
                    method: "PATCH",
                    body: n,
                  };
                },
                invalidatesTags: [
                  "AvailabilitySlots",
                  "Availability",
                  "Schedule",
                ],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              addConsultantReview: e.mutation({
                query: function (e) {
                  var t = e.id,
                    n = i(e, s);
                  return {
                    url: "/consultants/".concat(t, "/reviews"),
                    method: "POST",
                    body: n,
                  };
                },
                invalidatesTags: function (e, t, n) {
                  return [{ type: "Review", id: n.id }, "Consultant"];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              approveConsultant: e.mutation({
                query: function (e) {
                  var t = e.id,
                    n = i(e, o);
                  return {
                    url: "/consultants/".concat(t, "/approve"),
                    method: "PATCH",
                    body: n,
                  };
                },
                invalidatesTags: function (e, t, n) {
                  return [{ type: "Consultant", id: n.id }, "Consultant"];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
            };
          },
        }),
        l = u.useGetAllConsultantsQuery,
        c = (u.useGetTopConsultantsQuery, u.useGetConsultantByIdQuery),
        d =
          (u.useGetConsultantAvailabilityQuery,
          u.useGetConsultantReviewsQuery,
          u.useGetMyConsultantProfileQuery),
        f = u.useUpdateMyConsultantProfileMutation,
        m = u.useUpdateOnlineStatusMutation,
        p =
          (u.useGetMyEarningsQuery,
          u.useGetMyStatsQuery,
          u.useGetMyAvailabilitySlotsQuery),
        y = u.useAddAvailabilitySlotsMutation,
        v = u.useDeleteAvailabilitySlotMutation,
        g =
          (u.useUpdateScheduleStatusMutation,
          u.useAddConsultantReviewMutation,
          u.useApproveConsultantMutation);
    },
    8350(e, t, n) {
      n.d(t, { HC: () => f, RD: () => d, VL: () => c, d2: () => l });
      var r = n(69215),
        a = ["id"],
        s = ["id"],
        o = ["id"];
      function i(e, t) {
        if (null == e) return {};
        var n,
          r,
          a = (function (e, t) {
            if (null == e) return {};
            var n = {};
            for (var r in e)
              if ({}.hasOwnProperty.call(e, r)) {
                if (-1 !== t.indexOf(r)) continue;
                n[r] = e[r];
              }
            return n;
          })(e, t);
        if (Object.getOwnPropertySymbols) {
          var s = Object.getOwnPropertySymbols(e);
          for (r = 0; r < s.length; r++)
            ((n = s[r]),
              -1 === t.indexOf(n) &&
                {}.propertyIsEnumerable.call(e, n) &&
                (a[n] = e[n]));
        }
        return a;
      }
      var u = r.q.injectEndpoints({
          endpoints: function (e) {
            return {
              getMe: e.query({
                query: function () {
                  return { url: "/users/me", method: "GET" };
                },
                providesTags: ["UserProfile"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              updateProfile: e.mutation({
                query: function (e) {
                  return (
                    FormData,
                    { url: "/users/me", method: "PATCH", body: e }
                  );
                },
                invalidatesTags: ["UserProfile", "UserStats"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              deleteMe: e.mutation({
                query: function () {
                  return { url: "/users/me", method: "DELETE" };
                },
                invalidatesTags: ["UserProfile"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getMyStats: e.query({
                query: function () {
                  return { url: "/users/me/stats", method: "GET" };
                },
                providesTags: ["UserStats"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getMyCreditHistory: e.query({
                query: function () {
                  return {
                    url: "/users/me/credits",
                    method: "GET",
                    params:
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                  };
                },
                providesTags: ["CreditHistory"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getAllUsers: e.query({
                query: function () {
                  var e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                    t = e.page,
                    n = void 0 === t ? 1 : t,
                    r = e.limit;
                  return {
                    url: "/users/admin/users",
                    method: "GET",
                    params: {
                      page: n,
                      limit: void 0 === r ? 10 : r,
                      search: e.search,
                      role: e.role,
                      status: e.status,
                      sortBy: e.sortBy,
                      sortOrder: e.sortOrder,
                    },
                  };
                },
                providesTags: ["AllUsers"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getAdminStats: e.query({
                query: function () {
                  return { url: "/users/admin/stats", method: "GET" };
                },
                providesTags: ["AdminStats"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getUserById: e.query({
                query: function (e) {
                  return {
                    url: "/users/admin/users/".concat(e),
                    method: "GET",
                  };
                },
                providesTags: function (e, t, n) {
                  return [{ type: "User", id: n }];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              updateUserStatus: e.mutation({
                query: function (e) {
                  var t = e.id,
                    n = i(e, a);
                  return {
                    url: "/users/admin/users/".concat(t, "/status"),
                    method: "PATCH",
                    body: n,
                  };
                },
                invalidatesTags: function (e, t, n) {
                  return [{ type: "User", id: n.id }, "AllUsers", "AdminStats"];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              updateUserRole: e.mutation({
                query: function (e) {
                  var t = e.id,
                    n = i(e, s);
                  return {
                    url: "/users/admin/users/".concat(t, "/role"),
                    method: "PATCH",
                    body: n,
                  };
                },
                invalidatesTags: function (e, t, n) {
                  return [{ type: "User", id: n.id }, "AllUsers", "AdminStats"];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              adjustCredits: e.mutation({
                query: function (e) {
                  var t = e.id,
                    n = i(e, o);
                  return {
                    url: "/users/admin/users/".concat(t, "/credits"),
                    method: "PATCH",
                    body: n,
                  };
                },
                invalidatesTags: function (e, t, n) {
                  return [
                    { type: "User", id: n.id },
                    "CreditHistory",
                    "UserStats",
                  ];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              deleteUser: e.mutation({
                query: function (e) {
                  return {
                    url: "/users/admin/users/".concat(e),
                    method: "DELETE",
                  };
                },
                invalidatesTags: function (e, t, n) {
                  return [{ type: "User", id: n }, "AllUsers", "AdminStats"];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
            };
          },
        }),
        l = (u.useGetMeQuery, u.useUpdateProfileMutation),
        c =
          (u.useDeleteMeMutation,
          u.useGetMyStatsQuery,
          u.useGetMyCreditHistoryQuery,
          u.useGetAllUsersQuery),
        d =
          (u.useGetAdminStatsQuery,
          u.useGetUserByIdQuery,
          u.useUpdateUserStatusMutation),
        f =
          (u.useUpdateUserRoleMutation,
          u.useAdjustCreditsMutation,
          u.useDeleteUserMutation);
      (u.useLazyGetMeQuery,
        u.useLazyGetMyStatsQuery,
        u.useLazyGetMyCreditHistoryQuery,
        u.useLazyGetAllUsersQuery,
        u.useLazyGetAdminStatsQuery,
        u.useLazyGetUserByIdQuery);
    },
    48478(e, t, n) {
      (n.r(t), n.d(t, { default: () => q }));
      var r = n(96540),
        a = n(90888),
        s = n(48686),
        o = n(97282),
        i = n(74848);
      function u(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function l(e) {
        var t,
          n,
          a = e.name,
          l = void 0 === a ? "Suima" : a,
          c = e.email,
          d = void 0 === c ? "suimlt61799@gmail.com" : c,
          f = e.avatar,
          m = e.onAvatarChange,
          p = (0, r.useRef)(null),
          y =
            ((t = (0, r.useState)(null)),
            (n = 2),
            (function (e) {
              if (Array.isArray(e)) return e;
            })(t) ||
              (function (e, t) {
                var n =
                  null == e
                    ? null
                    : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
                      e["@@iterator"];
                if (null != n) {
                  var r,
                    a,
                    s,
                    o,
                    i = [],
                    u = !0,
                    l = !1;
                  try {
                    if (((s = (n = n.call(e)).next), 0 === t)) {
                      if (Object(n) !== n) return;
                      u = !1;
                    } else
                      for (
                        ;
                        !(u = (r = s.call(n)).done) &&
                        (i.push(r.value), i.length !== t);
                        u = !0
                      );
                  } catch (e) {
                    ((l = !0), (a = e));
                  } finally {
                    try {
                      if (
                        !u &&
                        null != n.return &&
                        ((o = n.return()), Object(o) !== o)
                      )
                        return;
                    } finally {
                      if (l) throw a;
                    }
                  }
                  return i;
                }
              })(t, n) ||
              (function (e, t) {
                if (e) {
                  if ("string" == typeof e) return u(e, t);
                  var n = {}.toString.call(e).slice(8, -1);
                  return (
                    "Object" === n && e.constructor && (n = e.constructor.name),
                    "Map" === n || "Set" === n
                      ? Array.from(e)
                      : "Arguments" === n ||
                          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        ? u(e, t)
                        : void 0
                  );
                }
              })(t, n) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              })()),
          v = y[0],
          g = y[1];
        (0, r.useEffect)(
          function () {
            g(null);
          },
          [f],
        );
        var h = v || f;
        return (0, i.jsxs)("div", {
          className: "flex items-center gap-4",
          children: [
            (0, i.jsxs)("div", {
              className: "relative size-22.25",
              children: [
                (0, i.jsx)("div", {
                  className:
                    "size-full rounded-full overflow-hidden border border-gray-100 bg-[#e9eaeb] flex items-center justify-center",
                  children: h
                    ? (0, i.jsx)("img", {
                        src: h,
                        alt: l,
                        className: "w-full h-full object-cover",
                      })
                    : (0, i.jsx)(s.A, {
                        size: 54,
                        className: "text-[#8a8a8a]",
                      }),
                }),
                (0, i.jsx)("button", {
                  type: "button",
                  onClick: function () {
                    var e;
                    null === (e = p.current) || void 0 === e || e.click();
                  },
                  className:
                    "absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-transform duration-200 hover:scale-110 active:scale-95",
                  "aria-label": "Upload avatar",
                  children: (0, i.jsx)(o.A, { size: 14 }),
                }),
                (0, i.jsx)("input", {
                  type: "file",
                  ref: p,
                  onChange: function (e) {
                    var t,
                      n =
                        null === (t = e.target.files) || void 0 === t
                          ? void 0
                          : t[0];
                    if (n) {
                      var r = URL.createObjectURL(n);
                      (g(r), m && m(n));
                    }
                  },
                  accept: "image/*",
                  className: "hidden",
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              children: [
                (0, i.jsx)("h2", {
                  className: "text-2xl font-semibold text-[#0c0c0c]",
                  children: l,
                }),
                (0, i.jsx)("p", {
                  className: "text-base text-[#464646]",
                  children: d,
                }),
              ],
            }),
          ],
        });
      }
      var c =
          "w-full h-12 rounded-lg border border-gray-100 px-4 text-sm text-[#1d1d1d] placeholder:text-[#989da1] focus:outline-none focus:ring-2 focus:ring-green-500/60",
        d =
          "w-full rounded-lg border border-gray-100 px-4 py-3 text-sm text-[#1d1d1d] placeholder:text-[#989da1] focus:outline-none focus:ring-2 focus:ring-green-500/60";
      function f(e) {
        var t = e.profile,
          n = e.onChange,
          r = e.onUpdate;
        return (0, i.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, i.jsx)("h3", {
              className: "text-xl font-medium text-[#4c515b]",
              children: "Account Information",
            }),
            (0, i.jsxs)("div", {
              className: "grid grid-cols-1 gap-5 lg:grid-cols-2",
              children: [
                (0, i.jsxs)("div", {
                  className: "space-y-3",
                  children: [
                    (0, i.jsx)("label", {
                      htmlFor: "profile-name",
                      className: "block text-base text-[#464646]",
                      children: "Name",
                    }),
                    (0, i.jsx)("input", {
                      id: "profile-name",
                      type: "text",
                      value: t.name || "",
                      onChange: function (e) {
                        return n("name", e.target.value);
                      },
                      className: c,
                    }),
                  ],
                }),
                (0, i.jsxs)("div", {
                  className: "space-y-3",
                  children: [
                    (0, i.jsx)("label", {
                      htmlFor: "profile-email",
                      className: "block text-base text-[#464646]",
                      children: "Email",
                    }),
                    (0, i.jsx)("input", {
                      id: "profile-email",
                      type: "email",
                      value: t.email || "",
                      onChange: function (e) {
                        return n("email", e.target.value);
                      },
                      className: c,
                    }),
                  ],
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "space-y-3",
              children: [
                (0, i.jsx)("label", {
                  htmlFor: "profile-phone",
                  className: "block text-base text-[#464646]",
                  children: "Phone Number",
                }),
                (0, i.jsx)("input", {
                  id: "profile-phone",
                  type: "text",
                  value: t.phone || "",
                  onChange: function (e) {
                    return n("phone", e.target.value);
                  },
                  className: c,
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "space-y-3",
              children: [
                (0, i.jsx)("label", {
                  htmlFor: "profile-about",
                  className: "block text-base text-[#464646]",
                  children: "About Me",
                }),
                (0, i.jsx)("textarea", {
                  id: "profile-about",
                  rows: 5,
                  value: t.about || "",
                  onChange: function (e) {
                    return n("about", e.target.value);
                  },
                  className: d,
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "space-y-3",
              children: [
                (0, i.jsx)("label", {
                  htmlFor: "profile-expertise",
                  className: "block text-base text-[#464646]",
                  children: "Areas Of Expertise",
                }),
                (0, i.jsx)("textarea", {
                  id: "profile-expertise",
                  rows: 5,
                  value: t.expertise || "",
                  onChange: function (e) {
                    return n("expertise", e.target.value);
                  },
                  className: d,
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "grid grid-cols-1 gap-5 lg:grid-cols-3",
              children: [
                (0, i.jsxs)("div", {
                  className: "space-y-3",
                  children: [
                    (0, i.jsx)("label", {
                      htmlFor: "profile-experience",
                      className: "block text-base text-[#464646]",
                      children: "Experience",
                    }),
                    (0, i.jsx)("input", {
                      id: "profile-experience",
                      type: "text",
                      value: t.experience || "",
                      onChange: function (e) {
                        return n("experience", e.target.value);
                      },
                      className: c,
                    }),
                  ],
                }),
                (0, i.jsxs)("div", {
                  className: "space-y-3",
                  children: [
                    (0, i.jsx)("label", {
                      htmlFor: "profile-language",
                      className: "block text-base text-[#464646]",
                      children: "Language",
                    }),
                    (0, i.jsx)("input", {
                      id: "profile-language",
                      type: "text",
                      value: t.language || "",
                      onChange: function (e) {
                        return n("language", e.target.value);
                      },
                      className: c,
                    }),
                  ],
                }),
                (0, i.jsxs)("div", {
                  className: "space-y-3",
                  children: [
                    (0, i.jsx)("label", {
                      htmlFor: "profile-location",
                      className: "block text-base text-[#464646]",
                      children: "Location",
                    }),
                    (0, i.jsx)("input", {
                      id: "profile-location",
                      type: "text",
                      value: t.location || "",
                      onChange: function (e) {
                        return n("location", e.target.value);
                      },
                      className: c,
                    }),
                  ],
                }),
              ],
            }),
            (0, i.jsx)("div", {
              className: "flex justify-end pt-1",
              children: (0, i.jsx)("button", {
                type: "button",
                onClick: r,
                className:
                  "h-8 rounded bg-green-500/60 px-4 text-sm font-medium text-white transition-colors duration-200 ",
                children: "Update Profile",
              }),
            }),
          ],
        });
      }
      var m = n(66220),
        p = n(80697),
        y = n(32708);
      function v(e) {
        var t = e.slots,
          n = e.onAdd,
          r = e.onRemove,
          a = e.onChange;
        return (0, i.jsxs)("div", {
          className: "space-y-4",
          children: [
            (0, i.jsxs)("div", {
              className: "flex items-center justify-between gap-3",
              children: [
                (0, i.jsxs)("div", {
                  className:
                    "flex items-center gap-2 text-sm font-medium text-[#4a5565]",
                  children: [
                    (0, i.jsx)(m.A, { size: 14 }),
                    (0, i.jsx)("span", { children: "Availability" }),
                  ],
                }),
                (0, i.jsxs)("button", {
                  type: "button",
                  onClick: n,
                  className:
                    "inline-flex h-8 items-center gap-1.5 rounded-md bg-[#6e35ae] px-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#5f2f98]",
                  children: [(0, i.jsx)(p.A, { size: 12 }), "Add Time Slot"],
                }),
              ],
            }),
            (0, i.jsx)("div", {
              className: "space-y-3",
              children: t.map(function (e) {
                return (0, i.jsxs)(
                  "div",
                  {
                    className:
                      "flex flex-col gap-3 lg:flex-row lg:items-center",
                    children: [
                      (0, i.jsx)("div", {
                        className: "lg:min-w-0 lg:flex-1",
                        children: (0, i.jsx)("input", {
                          type: "text",
                          value: e.day || "",
                          onChange: function (t) {
                            return a(e.id, "day", t.target.value);
                          },
                          className:
                            "h-10 w-full rounded-lg border border-[#b9b9b9] px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60",
                        }),
                      }),
                      (0, i.jsx)("div", {
                        className: "relative lg:w-38 lg:shrink-0",
                        children: (0, i.jsx)("input", {
                          type: "time",
                          value: e.from || "",
                          onChange: function (t) {
                            return a(e.id, "from", t.target.value);
                          },
                          step: "900",
                          className:
                            "h-10 w-full rounded-lg border border-[#b9b9b9] px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60",
                        }),
                      }),
                      (0, i.jsx)("span", {
                        className: "hidden text-sm text-[#616874] lg:block",
                        children: "-",
                      }),
                      (0, i.jsx)("div", {
                        className: "relative lg:w-38 lg:shrink-0",
                        children: (0, i.jsx)("input", {
                          type: "time",
                          value: e.to || "",
                          onChange: function (t) {
                            return a(e.id, "to", t.target.value);
                          },
                          step: "900",
                          className:
                            "h-10 w-full rounded-lg border border-[#b9b9b9] px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60",
                        }),
                      }),
                      (0, i.jsx)("button", {
                        type: "button",
                        onClick: function () {
                          return r(e.id);
                        },
                        className:
                          "mx-auto p-0.5 text-[#ef4444] transition-colors duration-200 hover:text-[#dc2626] lg:mx-0 lg:ml-2 lg:shrink-0",
                        "aria-label": "Remove time slot",
                        children: (0, i.jsx)(y.A, { size: 16 }),
                      }),
                    ],
                  },
                  e.id,
                );
              }),
            }),
          ],
        });
      }
      var g =
        "w-full h-12 rounded-lg border border-gray-100 px-4 text-sm text-[#1d1d1d] placeholder:text-[#989da1] focus:outline-none focus:ring-2 focus:ring-green-500/60";
      function h(e) {
        var t = e.passwordForm,
          n = e.onChange,
          r = e.onSubmit;
        return (0, i.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, i.jsx)("h3", {
              className: "text-xl font-medium text-[#4c515b]",
              children: "Change Password",
            }),
            (0, i.jsxs)("div", {
              className: "grid grid-cols-1 gap-5 lg:grid-cols-2",
              children: [
                (0, i.jsxs)("div", {
                  className: "space-y-3",
                  children: [
                    (0, i.jsx)("label", {
                      htmlFor: "new-password",
                      className: "block text-base text-[#464646]",
                      children: "New Password",
                    }),
                    (0, i.jsx)("input", {
                      id: "new-password",
                      type: "password",
                      value: t.newPassword || "",
                      onChange: function (e) {
                        return n("newPassword", e.target.value);
                      },
                      placeholder: "..........",
                      className: g,
                    }),
                  ],
                }),
                (0, i.jsxs)("div", {
                  className: "space-y-3",
                  children: [
                    (0, i.jsx)("label", {
                      htmlFor: "confirm-password",
                      className: "block text-base text-[#464646]",
                      children: "Confirm New Password",
                    }),
                    (0, i.jsx)("input", {
                      id: "confirm-password",
                      type: "password",
                      value: t.confirmPassword || "",
                      onChange: function (e) {
                        return n("confirmPassword", e.target.value);
                      },
                      placeholder: ".........",
                      className: g,
                    }),
                  ],
                }),
              ],
            }),
            (0, i.jsx)("div", {
              className: "flex justify-end",
              children: (0, i.jsx)("button", {
                type: "button",
                onClick: r,
                className:
                  "h-8 rounded bg-green-500/60 px-4 text-sm font-medium text-white transition-colors duration-200 ",
                children: "Change Password",
              }),
            }),
          ],
        });
      }
      var b = n(17788),
        x = n(24641),
        j = n(8350);
      function w(e) {
        return (
          (w =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          w(e)
        );
      }
      function C() {
        var e,
          t,
          n = "function" == typeof Symbol ? Symbol : {},
          r = n.iterator || "@@iterator",
          a = n.toStringTag || "@@toStringTag";
        function s(n, r, a, s) {
          var u = r && r.prototype instanceof i ? r : i,
            l = Object.create(u.prototype);
          return (
            N(
              l,
              "_invoke",
              (function (n, r, a) {
                var s,
                  i,
                  u,
                  l = 0,
                  c = a || [],
                  d = !1,
                  f = {
                    p: 0,
                    n: 0,
                    v: e,
                    a: m,
                    f: m.bind(e, 4),
                    d: function (t, n) {
                      return ((s = t), (i = 0), (u = e), (f.n = n), o);
                    },
                  };
                function m(n, r) {
                  for (
                    i = n, u = r, t = 0;
                    !d && l && !a && t < c.length;
                    t++
                  ) {
                    var a,
                      s = c[t],
                      m = f.p,
                      p = s[2];
                    n > 3
                      ? (a = p === r) &&
                        ((u = s[(i = s[4]) ? 5 : ((i = 3), 3)]),
                        (s[4] = s[5] = e))
                      : s[0] <= m &&
                        ((a = n < 2 && m < s[1])
                          ? ((i = 0), (f.v = r), (f.n = s[1]))
                          : m < p &&
                            (a = n < 3 || s[0] > r || r > p) &&
                            ((s[4] = n), (s[5] = r), (f.n = p), (i = 0)));
                  }
                  if (a || n > 1) return o;
                  throw ((d = !0), r);
                }
                return function (a, c, p) {
                  if (l > 1) throw TypeError("Generator is already running");
                  for (
                    d && 1 === c && m(c, p), i = c, u = p;
                    (t = i < 2 ? e : u) || !d;
                  ) {
                    s ||
                      (i
                        ? i < 3
                          ? (i > 1 && (f.n = -1), m(i, u))
                          : (f.n = u)
                        : (f.v = u));
                    try {
                      if (((l = 2), s)) {
                        if ((i || (a = "next"), (t = s[a]))) {
                          if (!(t = t.call(s, u)))
                            throw TypeError("iterator result is not an object");
                          if (!t.done) return t;
                          ((u = t.value), i < 2 && (i = 0));
                        } else
                          (1 === i && (t = s.return) && t.call(s),
                            i < 2 &&
                              ((u = TypeError(
                                "The iterator does not provide a '" +
                                  a +
                                  "' method",
                              )),
                              (i = 1)));
                        s = e;
                      } else if ((t = (d = f.n < 0) ? u : n.call(r, f)) !== o)
                        break;
                    } catch (t) {
                      ((s = e), (i = 1), (u = t));
                    } finally {
                      l = 1;
                    }
                  }
                  return { value: t, done: d };
                };
              })(n, a, s),
              !0,
            ),
            l
          );
        }
        var o = {};
        function i() {}
        function u() {}
        function l() {}
        t = Object.getPrototypeOf;
        var c = [][r]
            ? t(t([][r]()))
            : (N((t = {}), r, function () {
                return this;
              }),
              t),
          d = (l.prototype = i.prototype = Object.create(c));
        function f(e) {
          return (
            Object.setPrototypeOf
              ? Object.setPrototypeOf(e, l)
              : ((e.__proto__ = l), N(e, a, "GeneratorFunction")),
            (e.prototype = Object.create(d)),
            e
          );
        }
        return (
          (u.prototype = l),
          N(d, "constructor", l),
          N(l, "constructor", u),
          (u.displayName = "GeneratorFunction"),
          N(l, a, "GeneratorFunction"),
          N(d),
          N(d, a, "Generator"),
          N(d, r, function () {
            return this;
          }),
          N(d, "toString", function () {
            return "[object Generator]";
          }),
          (C = function () {
            return { w: s, m: f };
          })()
        );
      }
      function N(e, t, n, r) {
        var a = Object.defineProperty;
        try {
          a({}, "", {});
        } catch (e) {
          a = 0;
        }
        ((N = function (e, t, n, r) {
          function s(t, n) {
            N(e, t, function (e) {
              return this._invoke(t, n, e);
            });
          }
          t
            ? a
              ? a(e, t, {
                  value: n,
                  enumerable: !r,
                  configurable: !r,
                  writable: !r,
                })
              : (e[t] = n)
            : (s("next", 0), s("throw", 1), s("return", 2));
        }),
          N(e, t, n, r));
      }
      function S(e, t, n, r, a, s, o) {
        try {
          var i = e[s](o),
            u = i.value;
        } catch (e) {
          return void n(e);
        }
        i.done ? t(u) : Promise.resolve(u).then(r, a);
      }
      function A(e) {
        return function () {
          var t = this,
            n = arguments;
          return new Promise(function (r, a) {
            var s = e.apply(t, n);
            function o(e) {
              S(s, r, a, o, i, "next", e);
            }
            function i(e) {
              S(s, r, a, o, i, "throw", e);
            }
            o(void 0);
          });
        };
      }
      function R(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function T(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? R(Object(n), !0).forEach(function (t) {
                P(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : R(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t),
                  );
                });
        }
        return e;
      }
      function P(e, t, n) {
        return (
          (t = (function (e) {
            var t = (function (e) {
              if ("object" != w(e) || !e) return e;
              var t = e[Symbol.toPrimitive];
              if (void 0 !== t) {
                var n = t.call(e, "string");
                if ("object" != w(n)) return n;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value.",
                );
              }
              return String(e);
            })(e);
            return "symbol" == w(t) ? t : t + "";
          })(t)) in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function O(e, t) {
        return (
          (function (e) {
            if (Array.isArray(e)) return e;
          })(e) ||
          (function (e, t) {
            var n =
              null == e
                ? null
                : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
                  e["@@iterator"];
            if (null != n) {
              var r,
                a,
                s,
                o,
                i = [],
                u = !0,
                l = !1;
              try {
                if (((s = (n = n.call(e)).next), 0 === t)) {
                  if (Object(n) !== n) return;
                  u = !1;
                } else
                  for (
                    ;
                    !(u = (r = s.call(n)).done) &&
                    (i.push(r.value), i.length !== t);
                    u = !0
                  );
              } catch (e) {
                ((l = !0), (a = e));
              } finally {
                try {
                  if (
                    !u &&
                    null != n.return &&
                    ((o = n.return()), Object(o) !== o)
                  )
                    return;
                } finally {
                  if (l) throw a;
                }
              }
              return i;
            }
          })(e, t) ||
          (function (e, t) {
            if (e) {
              if ("string" == typeof e) return E(e, t);
              var n = {}.toString.call(e).slice(8, -1);
              return (
                "Object" === n && e.constructor && (n = e.constructor.name),
                "Map" === n || "Set" === n
                  ? Array.from(e)
                  : "Arguments" === n ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                    ? E(e, t)
                    : void 0
              );
            }
          })(e, t) ||
          (function () {
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })()
        );
      }
      function E(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      var U = {
          name: "",
          email: "",
          phone: "",
          about: "",
          expertise: "",
          experience: "",
          language: "",
          location: "",
        },
        k = (0, r.memo)(function () {
          var e,
            t,
            n,
            s = O((0, r.useState)(U), 2),
            o = s[0],
            u = s[1],
            c = O((0, r.useState)({ newPassword: "", confirmPassword: "" }), 2),
            d = c[0],
            m = c[1],
            p = O((0, r.useState)([]), 2),
            y = p[0],
            g = p[1],
            w = (0, b.gj)(),
            N = w.data,
            S = w.isLoading,
            R = w.refetch,
            E = (0, b.c_)(),
            k = E.data,
            q = E.isLoading,
            G = O((0, b.Er)(), 1)[0],
            M = O((0, b.UO)(), 1)[0],
            Q = O((0, b.TQ)(), 1)[0],
            F = O((0, x.SV)(), 1)[0],
            L = O((0, j.d2)(), 1)[0];
          ((0, r.useEffect)(
            function () {
              if (null != N && N.profile) {
                var e,
                  t,
                  n,
                  r,
                  a,
                  s,
                  o = N.profile;
                u({
                  name:
                    (null === (e = o.user) || void 0 === e ? void 0 : e.name) ||
                    "",
                  email:
                    (null === (t = o.user) || void 0 === t
                      ? void 0
                      : t.email) || "",
                  phone:
                    (null === (n = o.user) || void 0 === n
                      ? void 0
                      : n.phone) || "",
                  about: o.bio || "",
                  expertise:
                    (null === (r = o.specialization) || void 0 === r
                      ? void 0
                      : r.join(", ")) || "",
                  experience: o.experience || "",
                  language:
                    (null === (a = o.user) || void 0 === a
                      ? void 0
                      : a.language) || "",
                  location:
                    (null === (s = o.user) || void 0 === s
                      ? void 0
                      : s.location) || "",
                });
              }
            },
            [N],
          ),
            (0, r.useEffect)(
              function () {
                null != k && k.slots ? g(k.slots) : Array.isArray(k) && g(k);
              },
              [k],
            ));
          var z = (0, r.useCallback)(function (e, t) {
              u(function (n) {
                return T(T({}, n), {}, P({}, e, t));
              });
            }, []),
            I = (0, r.useCallback)(function (e, t) {
              m(function (n) {
                return T(T({}, n), {}, P({}, e, t));
              });
            }, []),
            H = (0, r.useCallback)(
              A(
                C().m(function e() {
                  var t, n, r, s, o, i;
                  return C().w(
                    function (e) {
                      for (;;)
                        switch ((e.p = e.n)) {
                          case 0:
                            return (
                              (t = a.oR.loading("Adding time slot...")),
                              (n = {
                                day: "Sunday",
                                from: "09:00",
                                to: "21:00",
                              }),
                              (e.p = 1),
                              (e.n = 2),
                              M({ slots: [n] }).unwrap()
                            );
                          case 2:
                            (a.oR.dismiss(t),
                              a.oR.success("New time slot added."),
                              (e.n = 7));
                            break;
                          case 3:
                            return (
                              (e.p = 3),
                              (o = e.v),
                              (e.p = 4),
                              (e.n = 5),
                              M(n).unwrap()
                            );
                          case 5:
                            (a.oR.dismiss(t),
                              a.oR.success("New time slot added."),
                              (e.n = 7));
                            break;
                          case 6:
                            ((e.p = 6),
                              (i = e.v),
                              a.oR.dismiss(t),
                              a.oR.error(
                                (null == i ||
                                null === (r = i.data) ||
                                void 0 === r
                                  ? void 0
                                  : r.message) ||
                                  (null == o ||
                                  null === (s = o.data) ||
                                  void 0 === s
                                    ? void 0
                                    : s.message) ||
                                  "Failed to add time slot.",
                              ));
                          case 7:
                            return e.a(2);
                        }
                    },
                    e,
                    null,
                    [
                      [4, 6],
                      [1, 3],
                    ],
                  );
                }),
              ),
              [M],
            ),
            _ = (0, r.useCallback)(
              (function () {
                var e = A(
                  C().m(function e(t) {
                    var n, r, s;
                    return C().w(
                      function (e) {
                        for (;;)
                          switch ((e.p = e.n)) {
                            case 0:
                              return (
                                (n = a.oR.loading("Removing time slot...")),
                                (e.p = 1),
                                (e.n = 2),
                                Q(t).unwrap()
                              );
                            case 2:
                              (a.oR.dismiss(n),
                                a.oR.success("Time slot removed."),
                                (e.n = 4));
                              break;
                            case 3:
                              ((e.p = 3),
                                (s = e.v),
                                a.oR.dismiss(n),
                                a.oR.error(
                                  (null == s ||
                                  null === (r = s.data) ||
                                  void 0 === r
                                    ? void 0
                                    : r.message) ||
                                    "Failed to remove time slot.",
                                ));
                            case 4:
                              return e.a(2);
                          }
                      },
                      e,
                      null,
                      [[1, 3]],
                    );
                  }),
                );
                return function (t) {
                  return e.apply(this, arguments);
                };
              })(),
              [Q],
            ),
            D = (0, r.useCallback)(function (e, t, n) {
              g(function (r) {
                return r.map(function (r) {
                  return r.id === e ? T(T({}, r), {}, P({}, t, n)) : r;
                });
              });
            }, []),
            B = (0, r.useCallback)(
              (function () {
                var e = A(
                  C().m(function e(t) {
                    var n, r, s, o;
                    return C().w(
                      function (e) {
                        for (;;)
                          switch ((e.p = e.n)) {
                            case 0:
                              return (
                                (n = a.oR.loading("Uploading image...")),
                                (e.p = 1),
                                (r = new FormData()).append("avatar", t),
                                (e.n = 2),
                                L(r).unwrap()
                              );
                            case 2:
                              (R(),
                                a.oR.dismiss(n),
                                a.oR.success("Avatar updated successfully."),
                                (e.n = 4));
                              break;
                            case 3:
                              ((e.p = 3),
                                (o = e.v),
                                a.oR.dismiss(n),
                                a.oR.error(
                                  (null == o ||
                                  null === (s = o.data) ||
                                  void 0 === s
                                    ? void 0
                                    : s.message) || "Failed to upload avatar.",
                                ));
                            case 4:
                              return e.a(2);
                          }
                      },
                      e,
                      null,
                      [[1, 3]],
                    );
                  }),
                );
                return function (t) {
                  return e.apply(this, arguments);
                };
              })(),
              [L, R],
            ),
            K = (0, r.useCallback)(
              A(
                C().m(function e() {
                  var t, n, r, s, i;
                  return C().w(
                    function (e) {
                      for (;;)
                        switch ((e.p = e.n)) {
                          case 0:
                            return (
                              (t = a.oR.loading("Updating profile...")),
                              (e.p = 1),
                              (n = {
                                bio: o.about,
                                specialization: o.expertise
                                  ? o.expertise
                                      .split(",")
                                      .map(function (e) {
                                        return e.trim();
                                      })
                                      .filter(Boolean)
                                  : [],
                              }),
                              (r = {
                                name: o.name,
                                email: o.email,
                                phone: o.phone,
                                location: o.location,
                                language: o.language,
                              }),
                              (e.n = 2),
                              Promise.all([G(n).unwrap(), L(r).unwrap()])
                            );
                          case 2:
                            (R(),
                              a.oR.dismiss(t),
                              a.oR.success("Profile updated successfully."),
                              (e.n = 4));
                            break;
                          case 3:
                            ((e.p = 3),
                              (i = e.v),
                              a.oR.dismiss(t),
                              a.oR.error(
                                (null == i ||
                                null === (s = i.data) ||
                                void 0 === s
                                  ? void 0
                                  : s.message) || "Failed to update profile.",
                              ));
                          case 4:
                            return e.a(2);
                        }
                    },
                    e,
                    null,
                    [[1, 3]],
                  );
                }),
              ),
              [o, G, L, R],
            ),
            V = (0, r.useCallback)(
              A(
                C().m(function e() {
                  var t, n, r;
                  return C().w(
                    function (e) {
                      for (;;)
                        switch ((e.p = e.n)) {
                          case 0:
                            if (d.newPassword) {
                              e.n = 1;
                              break;
                            }
                            return (
                              a.oR.error("Please enter a new password."),
                              e.a(2)
                            );
                          case 1:
                            if (d.newPassword === d.confirmPassword) {
                              e.n = 2;
                              break;
                            }
                            return (
                              a.oR.error("Passwords do not match."),
                              e.a(2)
                            );
                          case 2:
                            return (
                              (t = a.oR.loading("Updating password...")),
                              (e.p = 3),
                              (e.n = 4),
                              F({ password: d.newPassword }).unwrap()
                            );
                          case 4:
                            (a.oR.dismiss(t),
                              a.oR.success("Password updated successfully."),
                              m({ newPassword: "", confirmPassword: "" }),
                              (e.n = 6));
                            break;
                          case 5:
                            ((e.p = 5),
                              (r = e.v),
                              a.oR.dismiss(t),
                              a.oR.error(
                                (null == r ||
                                null === (n = r.data) ||
                                void 0 === n
                                  ? void 0
                                  : n.message) || "Failed to update password.",
                              ));
                          case 6:
                            return e.a(2);
                        }
                    },
                    e,
                    null,
                    [[3, 5]],
                  );
                }),
              ),
              [d, F],
            );
          return S || q
            ? (0, i.jsx)("div", {
                className: "flex items-center justify-center min-h-[300px]",
                children: (0, i.jsx)("div", {
                  className:
                    "animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60",
                }),
              })
            : (0, i.jsxs)("section", {
                className: "space-y-6",
                children: [
                  (0, i.jsxs)("div", {
                    className: "space-y-2",
                    children: [
                      (0, i.jsx)("h1", {
                        className: "dashboard-page-title",
                        children: "My Profile",
                      }),
                      (0, i.jsx)("p", {
                        className: "dashboard-page-subtitle",
                        children: "Manage your account and store preferences.",
                      }),
                    ],
                  }),
                  (0, i.jsx)("div", {
                    className:
                      "rounded-[20px] border border-gray-100 bg-white px-6 py-8 lg:px-10 lg:py-12",
                    children: (0, i.jsxs)("div", {
                      className: "space-y-8",
                      children: [
                        (0, i.jsx)(l, {
                          name:
                            (null == N ||
                            null === (e = N.profile) ||
                            void 0 === e ||
                            null === (e = e.user) ||
                            void 0 === e
                              ? void 0
                              : e.name) || "Suima",
                          email:
                            (null == N ||
                            null === (t = N.profile) ||
                            void 0 === t ||
                            null === (t = t.user) ||
                            void 0 === t
                              ? void 0
                              : t.email) || "suimlt61799@gmail.com",
                          avatar:
                            null == N ||
                            null === (n = N.profile) ||
                            void 0 === n ||
                            null === (n = n.user) ||
                            void 0 === n
                              ? void 0
                              : n.avatar,
                          onAvatarChange: B,
                        }),
                        (0, i.jsx)(f, { profile: o, onChange: z, onUpdate: K }),
                        (0, i.jsx)(v, {
                          slots: y,
                          onAdd: H,
                          onRemove: _,
                          onChange: D,
                        }),
                        (0, i.jsx)(h, {
                          passwordForm: d,
                          onChange: I,
                          onSubmit: V,
                        }),
                      ],
                    }),
                  }),
                ],
              });
        });
      k.displayName = "ConsultantProfile";
      const q = k;
    },
  },
]);
