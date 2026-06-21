"use strict";
(self.webpackChunkreact_webpack_tailwind_app =
  self.webpackChunkreact_webpack_tailwind_app || []).push([
  [8615],
  {
    75755(e, t, n) {
      n.d(t, { $W: () => i, J$: () => l, _2: () => o, we: () => d });
      var r = n(69215),
        s = ["id"],
        a = r.q.injectEndpoints({
          endpoints: function (e) {
            return {
              getFaqs: e.query({
                query: function () {
                  return {
                    url: "/faqs",
                    method: "GET",
                    params:
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                  };
                },
                providesTags: ["Faq"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              createFaq: e.mutation({
                query: function (e) {
                  return { url: "/faqs", method: "POST", body: e };
                },
                invalidatesTags: ["Faq"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              updateFaq: e.mutation({
                query: function (e) {
                  var t = e.id,
                    n = (function (e, t) {
                      if (null == e) return {};
                      var n,
                        r,
                        s = (function (e, t) {
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
                        var a = Object.getOwnPropertySymbols(e);
                        for (r = 0; r < a.length; r++)
                          ((n = a[r]),
                            -1 === t.indexOf(n) &&
                              {}.propertyIsEnumerable.call(e, n) &&
                              (s[n] = e[n]));
                      }
                      return s;
                    })(e, s);
                  return { url: "/faqs/".concat(t), method: "PATCH", body: n };
                },
                invalidatesTags: function (e, t, n) {
                  return [{ type: "Faq", id: n.id }, "Faq"];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              deleteFaq: e.mutation({
                query: function (e) {
                  return { url: "/faqs/".concat(e), method: "DELETE" };
                },
                invalidatesTags: ["Faq"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
            };
          },
        }),
        i = a.useGetFaqsQuery,
        l = a.useCreateFaqMutation,
        o = a.useUpdateFaqMutation,
        d = a.useDeleteFaqMutation;
    },
    68615(e, t, n) {
      (n.r(t), n.d(t, { default: () => f }));
      var r = n(96540),
        s = n(74848);
      const a = function (e) {
        var t = e.stats;
        return (0, s.jsxs)(s.Fragment, {
          children: [
            (0, s.jsx)("header", {
              style: {
                background: "linear-gradient(to bottom,#f3ebfc,#ffffff)",
              },
              className: "py-14 lg:py-20",
              children: (0, s.jsxs)("div", {
                className: "container mx-auto px-4 text-center",
                children: [
                  (0, s.jsx)("h1", {
                    className:
                      "text-4xl sm:text-5xl font-semibold text-[#6E35AE]",
                    children: "We're here to help",
                  }),
                  (0, s.jsx)("p", {
                    className:
                      "mt-4 max-w-3xl mx-auto text-base text-[#6b6b78]",
                    children:
                      "Find answers, learn more about your sessions, or reach our team anytime you need.",
                  }),
                ],
              }),
            }),
            (0, s.jsx)("section", {
              className: "container mx-auto px-4 -mt-12",
              children: (0, s.jsx)("div", {
                className: "rounded-xl bg-white shadow-sm p-6",
                children: (0, s.jsx)("div", {
                  className:
                    "grid grid-cols-1 sm:grid-cols-4 gap-4 text-center",
                  children: t.map(function (e) {
                    return (0, s.jsxs)(
                      "div",
                      {
                        className: "py-6",
                        children: [
                          (0, s.jsx)("div", {
                            className:
                              "text-xl sm:text-2xl font-semibold text-[#6E35AE]",
                            children: e.value,
                          }),
                          (0, s.jsx)("div", {
                            className: "mt-2 text-xl text-[#6b6b78]",
                            children: e.label,
                          }),
                        ],
                      },
                      e.label,
                    );
                  }),
                }),
              }),
            }),
          ],
        });
      };
      function i(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      const l = function (e) {
        var t,
          n,
          a = e.faqs,
          l =
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
                    s,
                    a,
                    i,
                    l = [],
                    o = !0,
                    d = !1;
                  try {
                    if (((a = (n = n.call(e)).next), 0 === t)) {
                      if (Object(n) !== n) return;
                      o = !1;
                    } else
                      for (
                        ;
                        !(o = (r = a.call(n)).done) &&
                        (l.push(r.value), l.length !== t);
                        o = !0
                      );
                  } catch (e) {
                    ((d = !0), (s = e));
                  } finally {
                    try {
                      if (
                        !o &&
                        null != n.return &&
                        ((i = n.return()), Object(i) !== i)
                      )
                        return;
                    } finally {
                      if (d) throw s;
                    }
                  }
                  return l;
                }
              })(t, n) ||
              (function (e, t) {
                if (e) {
                  if ("string" == typeof e) return i(e, t);
                  var n = {}.toString.call(e).slice(8, -1);
                  return (
                    "Object" === n && e.constructor && (n = e.constructor.name),
                    "Map" === n || "Set" === n
                      ? Array.from(e)
                      : "Arguments" === n ||
                          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        ? i(e, t)
                        : void 0
                  );
                }
              })(t, n) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              })()),
          o = l[0],
          d = l[1];
        return (0, s.jsx)("div", {
          className: "space-y-3",
          children: a.map(function (e) {
            return (0, s.jsxs)(
              "div",
              {
                className:
                  "bg-white border border-[#efeaf8] rounded-lg shadow-sm overflow-hidden",
                children: [
                  (0, s.jsxs)("button", {
                    type: "button",
                    onClick: function () {
                      return ((t = e.id), void d(o === t ? null : t));
                      var t;
                    },
                    className:
                      "w-full text-left px-4 py-4 flex justify-between items-center hover:bg-[#f8f6fc] transition-colors",
                    children: [
                      (0, s.jsx)("span", {
                        className: "text-base font-medium",
                        children: e.question,
                      }),
                      (0, s.jsx)("button", {
                        type: "button",
                        "aria-hidden": !0,
                        className:
                          "w-6 h-6 rounded-full border border-[#e7def6] bg-white flex items-center justify-center text-[#8b6ac1] transition-all",
                        style: {
                          transform:
                            o === e.id ? "rotate(45deg)" : "rotate(0deg)",
                        },
                        children: (0, s.jsx)("svg", {
                          className: "w-6 h-6",
                          viewBox: "0 0 20 20",
                          fill: "currentColor",
                          children: (0, s.jsx)("path", {
                            d: "M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
                          }),
                        }),
                      }),
                    ],
                  }),
                  o === e.id &&
                    (0, s.jsx)("div", {
                      className:
                        "px-4 pb-4 text-base text-[#595367] border-t border-[#efeaf8]",
                      children: e.answer,
                    }),
                ],
              },
              e.id,
            );
          }),
        });
      };
      var o = n(93610);
      const d = function (e) {
          var t = e.items;
          return t && 0 !== t.length
            ? (0, s.jsxs)("div", {
                className: "mt-8",
                children: [
                  (0, s.jsx)("h3", {
                    className: "text-2xl font-semibold text-[#2b2540] mb-3",
                    children: "Pending Community Questions",
                  }),
                  (0, s.jsx)("div", {
                    className:
                      "rounded-lg border border-[#efeaf8] bg-white p-4 shadow-sm",
                    children: t.map(function (e) {
                      return (0, s.jsxs)(
                        "div",
                        {
                          className: "flex gap-4 mb-4",
                          children: [
                            (0, s.jsx)("div", {
                              className:
                                "shrink-0 w-12 h-12 rounded-full bg-[#ece3ff] flex items-center justify-center text-[#8b6ac1]",
                              children: (0, s.jsx)(o.A, { size: 24 }),
                            }),
                            (0, s.jsxs)("div", {
                              className: "flex-1",
                              children: [
                                (0, s.jsx)("p", {
                                  className:
                                    "text-base font-medium text-[#2b2540]",
                                  children: e.title,
                                }),
                                (0, s.jsx)("p", {
                                  className: "mt-2 text-base text-[#6b6b78]",
                                  children: e.body,
                                }),
                                (0, s.jsx)("div", {
                                  className: "mt-3",
                                  children: (0, s.jsx)("button", {
                                    className:
                                      "inline-flex items-center gap-2 rounded-lg bg-green-500/60 px-4 py-2 text-sm font-semibold text-white shadow-sm",
                                    children: "Answer",
                                  }),
                                }),
                              ],
                            }),
                          ],
                        },
                        e.id,
                      );
                    }),
                  }),
                ],
              })
            : null;
        },
        c = function () {
          return (0, s.jsx)("section", {
            className: "mt-14 lg:mt-20",
            children: (0, s.jsx)("div", {
              className:
                "bg-gradient-to-br from-[#7B5EA7] to-[#9B7DC7] rounded-lg overflow-hidden shadow-sm",
              children: (0, s.jsxs)("div", {
                className:
                  "flex flex-col lg:flex-row items-center justify-between p-4 lg:px-20 lg:py-16 gap-10",
                children: [
                  (0, s.jsxs)("div", {
                    className: "flex-1 text-white max-w-md",
                    children: [
                      (0, s.jsx)("h3", {
                        className: "text-3xl lg:text-4xl  mb-4 leading-snug",
                        children: "Still need help? Ask our admin team.",
                      }),
                      (0, s.jsx)("p", {
                        className:
                          "text-base text-white/80 leading-relaxed font-light",
                        children:
                          "Our dedicated support experts are available to ensure your experience remains premium and uninterrupted.",
                      }),
                    ],
                  }),
                  (0, s.jsx)("div", {
                    className: "w-full lg:w-[620px]",
                    children: (0, s.jsx)("div", {
                      className:
                        "bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
                      children: (0, s.jsxs)("form", {
                        children: [
                          (0, s.jsxs)("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                            children: [
                              (0, s.jsxs)("div", {
                                children: [
                                  (0, s.jsx)("label", {
                                    className:
                                      "block text-base text-white/70 uppercase tracking-widest mb-1.5 font-medium",
                                    children: "Topic",
                                  }),
                                  (0, s.jsx)("input", {
                                    className:
                                      "w-full rounded-md bg-white/10 border-none text-white text-sm placeholder-white/40 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-white/30",
                                    placeholder: "Billing Inquiry",
                                  }),
                                ],
                              }),
                              (0, s.jsxs)("div", {
                                children: [
                                  (0, s.jsx)("label", {
                                    className:
                                      "block text-base text-white/70 uppercase tracking-widest mb-1.5 font-medium",
                                    children: "Subject",
                                  }),
                                  (0, s.jsx)("input", {
                                    className:
                                      "w-full rounded-md bg-white/10 border-none text-white text-sm placeholder-white/40 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-white/30",
                                    placeholder: "Summary of issue",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, s.jsxs)("div", {
                            className: "mt-4",
                            children: [
                              (0, s.jsx)("label", {
                                className:
                                  "block text-base text-white/70 uppercase tracking-widest mb-1.5 font-medium",
                                children: "Question",
                              }),
                              (0, s.jsx)("textarea", {
                                className:
                                  "w-full rounded-md bg-white/10 border-none text-white text-sm placeholder-white/40 px-3 py-2.5 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-white/30",
                                placeholder:
                                  "Describe your inquiry in detail...",
                              }),
                            ],
                          }),
                          (0, s.jsx)("button", {
                            type: "submit",
                            className:
                              "mt-6 w-full rounded-md bg-green-500/60 px-4 py-3 text-sm font-semibold text-white  transition-colors",
                            children: "Send Message",
                          }),
                        ],
                      }),
                    }),
                  }),
                ],
              }),
            }),
          });
        };
      var u = n(75755),
        m = [
          { label: "Questions Answered", value: "3,200+" },
          { label: "Satisfaction Rate", value: "98%" },
          { label: "Support Available", value: "24/7" },
          { label: "Avg. Response Time", value: "< 2h" },
        ],
        x = [
          {
            id: "p1",
            title:
              "Can I sync my external SAP calendar directly with the EliteConsult portal?",
            body: "I've been trying to automate my bookings but can't find the API key or calendar integration settings.",
          },
        ];
      const f = function () {
        var e = (0, u.$W)({ limit: 100 }),
          t = e.data,
          n = e.isLoading,
          r = (null == t ? void 0 : t.faqs) || [];
        return (0, s.jsxs)("div", {
          className: "min-h-screen bg-white  ",
          children: [
            (0, s.jsx)(a, { stats: m }),
            (0, s.jsxs)("main", {
              className: "container mx-auto px-4 py-14 lg:py-20",
              children: [
                (0, s.jsx)("div", {
                  className: "flex items-center gap-3 text-[#6E35AE] mb-4",
                  children: (0, s.jsx)("h2", {
                    className: "text-2xl font-semibold",
                    children: "Frequently Asked Questions",
                  }),
                }),
                n
                  ? (0, s.jsx)("div", {
                      className: "flex justify-center py-12",
                      children: (0, s.jsx)("div", {
                        className:
                          "animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60",
                      }),
                    })
                  : 0 === r.length
                    ? (0, s.jsx)("div", {
                        className:
                          "text-center py-12 text-lg text-gray-500 border border-dashed border-gray-200 rounded-xl my-4",
                        children: "No FAQs found.",
                      })
                    : (0, s.jsx)(l, { faqs: r }),
                (0, s.jsx)(d, { items: x }),
                (0, s.jsx)(c, {}),
              ],
            }),
          ],
        });
      };
    },
  },
]);
