/*! For license information please see 8036.f108ded3.chunk.js.LICENSE.txt */
"use strict";
(self.webpackChunkreact_webpack_tailwind_app =
  self.webpackChunkreact_webpack_tailwind_app || []).push([
  [8036],
  {
    29673(e, t, n) {
      n.d(t, { A: () => i });
      var r = n(96540),
        o = n(74848),
        a = (0, r.memo)(function (e) {
          var t = e.wrapperClassName,
            n = void 0 === t ? "" : t,
            r = e.containerClassName,
            a = void 0 === r ? "container mx-auto px-4 lg:px-6" : r;
          return (0, o.jsx)("div", {
            className: n,
            children: (0, o.jsx)("div", {
              className: a,
              children: (0, o.jsx)("div", {
                className:
                  "w-full h-44 md:h-56 lg:h-72 bg-[#F1F5F9] rounded-xl border border-dashed border-gray-300 flex items-center justify-center group",
                children: (0, o.jsx)("span", {
                  className:
                    "text-black font-bold text-xl md:text-2xl tracking-widest uppercase",
                  children: "Advertisement Area",
                }),
              }),
            }),
          });
        });
      a.displayName = "CommonAdsSection";
      const i = a;
    },
    85457(e, t, n) {
      n.d(t, { D6: () => o });
      var r = n(69215).q.injectEndpoints({
          endpoints: function (e) {
            return {
              createCheckout: e.mutation({
                query: function (e) {
                  return { url: "/payments/checkout", method: "POST", body: e };
                },
                invalidatesTags: ["Payment", "PaymentHistory"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              verifyPayment: e.query({
                query: function (e) {
                  return {
                    url: "/payments/verify",
                    method: "GET",
                    params: {
                      paymentId: e.paymentId,
                      orderId: e.orderId,
                      signature: e.signature,
                    },
                  };
                },
                providesTags: function (e, t, n) {
                  return [{ type: "Payment", id: n.paymentId }];
                },
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getPaymentHistory: e.query({
                query: function () {
                  var e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                    t = e.page,
                    n = void 0 === t ? 1 : t,
                    r = e.limit;
                  return {
                    url: "/payments/history",
                    method: "GET",
                    params: {
                      page: n,
                      limit: void 0 === r ? 10 : r,
                      status: e.status,
                    },
                  };
                },
                providesTags: ["PaymentHistory"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
              getAllPayments: e.query({
                query: function () {
                  var e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                    t = e.page,
                    n = void 0 === t ? 1 : t,
                    r = e.limit;
                  return {
                    url: "/payments/admin/all",
                    method: "GET",
                    params: {
                      page: n,
                      limit: void 0 === r ? 10 : r,
                      status: e.status,
                      startDate: e.startDate,
                      endDate: e.endDate,
                    },
                  };
                },
                providesTags: ["AllPayments"],
                transformResponse: function (e) {
                  return e.data;
                },
              }),
            };
          },
        }),
        o = r.useCreateCheckoutMutation;
      (r.useVerifyPaymentQuery,
        r.useLazyVerifyPaymentQuery,
        r.useGetPaymentHistoryQuery,
        r.useGetAllPaymentsQuery);
    },
    75493(e, t, n) {
      n.d(t, { P: () => a });
      var r = n(96540),
        o = n(9521),
        a = function (e) {
          var t = e.title,
            n = e.description,
            a = e.keywords,
            i = void 0 === a ? [] : a,
            s = e.image,
            l = void 0 === s ? "" : s,
            c = e.type,
            d = void 0 === c ? "website" : c,
            u = e.locale,
            m = void 0 === u ? "en" : u,
            p = i.join(",");
          (0, r.useEffect)(
            function () {
              var e = (function (e) {
                var t = e.title,
                  n = e.description,
                  r = e.keywords,
                  a = void 0 === r ? [] : r,
                  i = e.url,
                  s = void 0 === i ? "" : i,
                  l = e.image,
                  c = void 0 === l ? "" : l,
                  d = e.type,
                  u = void 0 === d ? "website" : d,
                  m = e.locale,
                  p = void 0 === m ? "en" : m,
                  b =
                    "undefined" != typeof window ? window.location.origin : "",
                  y =
                    s ||
                    ("undefined" != typeof window ? window.location.href : b),
                  f = o.l8.DEFAULT_TITLE;
                return {
                  title: t ? "".concat(t, " | ").concat(f) : f,
                  description: n,
                  keywords: a.join(", "),
                  canonical: y,
                  openGraph: {
                    title: t,
                    description: n,
                    url: y,
                    siteName: f,
                    images: c ? [{ url: c }] : [],
                    locale: p,
                    type: u,
                  },
                  twitter: {
                    card: "summary_large_image",
                    title: t,
                    description: n,
                    images: c ? [c] : [],
                  },
                };
              })({
                title: t,
                description: n,
                keywords: i,
                image: l,
                type: d,
                locale: m,
              });
              !(function (e) {
                if ("undefined" != typeof document) {
                  document.title = e.title;
                  var t = [
                    { name: "description", content: e.description },
                    { name: "keywords", content: e.keywords },
                    { property: "og:title", content: e.openGraph.title },
                    {
                      property: "og:description",
                      content: e.openGraph.description,
                    },
                    { property: "og:url", content: e.openGraph.url },
                    { property: "og:site_name", content: e.openGraph.siteName },
                    { property: "og:locale", content: e.openGraph.locale },
                    { property: "og:type", content: e.openGraph.type },
                    { name: "twitter:card", content: e.twitter.card },
                    { name: "twitter:title", content: e.twitter.title },
                    {
                      name: "twitter:description",
                      content: e.twitter.description,
                    },
                  ];
                  (e.openGraph.images.length > 0 &&
                    t.push({
                      property: "og:image",
                      content: e.openGraph.images[0].url,
                    }),
                    e.twitter.images.length > 0 &&
                      t.push({
                        name: "twitter:image",
                        content: e.twitter.images[0],
                      }),
                    t.forEach(function (e) {
                      var t = e.name,
                        n = e.property,
                        r = e.content;
                      if (r) {
                        var o = t
                            ? 'meta[name="'.concat(t, '"]')
                            : 'meta[property="'.concat(n, '"]'),
                          a = document.querySelector(o);
                        (a ||
                          ((a = document.createElement("meta")),
                          t && a.setAttribute("name", t),
                          n && a.setAttribute("property", n),
                          document.head.appendChild(a)),
                          a.setAttribute("content", r));
                      }
                    }));
                  var n =
                    document.querySelector('link[rel="canonical"]') ||
                    document.createElement("link");
                  (n.setAttribute("rel", "canonical"),
                    n.setAttribute("href", e.canonical),
                    document.querySelector('link[rel="canonical"]') ||
                      document.head.appendChild(n));
                }
              })(e);
            },
            [t, n, p, l, d, m],
          );
        };
    },
    18036(e, t, n) {
      (n.r(t), n.d(t, { default: () => K }));
      var r = n(96540),
        o = n(75493),
        a = n(22022),
        i = n(74848),
        s = (0, r.memo)(function () {
          var e = (0, a.Bd)().t;
          return (0, i.jsxs)("div", {
            className:
              "relative w-full h-100 md:h-150 bg-cover bg-center flex items-center",
            style: {
              backgroundImage:
                'url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&h=800&fit=crop")',
            },
            children: [
              (0, i.jsx)("div", {
                className:
                  "absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent",
              }),
              (0, i.jsx)("div", {
                className: "relative z-10 container mx-auto px-6 lg:px-6",
                children: (0, i.jsxs)("div", {
                  className: "max-w-2xl",
                  children: [
                    (0, i.jsx)("h1", {
                      className:
                        "text-3xl sm:text-4xl lg:text-6xl text-white mb-4 leading-tight tracking-tight",
                      children: e("donationHero.title"),
                    }),
                    (0, i.jsx)("p", {
                      className:
                        "text-base md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed",
                      children: e("donationHero.description"),
                    }),
                    (0, i.jsx)("button", {
                      className:
                        "bg-green-400/90 hover:bg-green-600 cursor-pointer text-white px-6 py-3 rounded-sm font-medium text-sm sm:text-base transition-all duration-300 shadow-md active:scale-95",
                      children: e("donationHero.button"),
                    }),
                  ],
                }),
              }),
            ],
          });
        });
      s.displayName = "HeroSection";
      const l = s;
      var c = n(15338),
        d = n(9044),
        u = n(96844),
        m = (0, r.memo)(function () {
          var e = (0, a.Bd)().t,
            t = [
              {
                icon: c.A,
                titleKey: "donation.impact.cards.feedFamily.title",
                descriptionKey: "donation.impact.cards.feedFamily.description",
                color: "bg-orange-50",
              },
              {
                icon: d.A,
                titleKey: "donation.impact.cards.supportEducation.title",
                descriptionKey:
                  "donation.impact.cards.supportEducation.description",
                color: "bg-amber-50",
              },
              {
                icon: u.A,
                titleKey: "donation.impact.cards.medicalSupport.title",
                descriptionKey:
                  "donation.impact.cards.medicalSupport.description",
                color: "bg-yellow-50",
              },
            ];
          return (0, i.jsx)("div", {
            className: "py-14 md:py-20 bg-[#F1F5F9] text-center",
            children: (0, i.jsxs)("div", {
              className: "container mx-auto px-4 lg:px-6",
              children: [
                (0, i.jsx)("h2", {
                  className:
                    "text-2xl md:text-3xl font-bold text-gray-800 mb-8",
                  children: e("donation.impact.title"),
                }),
                (0, i.jsx)("div", {
                  className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                  children: t.map(function (t, n) {
                    return (0, i.jsxs)(
                      "div",
                      {
                        className:
                          "bg-white border border-gray-100 rounded-xl p-8 text-left shadow-sm",
                        children: [
                          (0, i.jsx)("div", {
                            className: "w-10 h-10 ".concat(
                              t.color,
                              " rounded-lg flex items-center justify-center mb-5",
                            ),
                            children: (0, i.jsx)(t.icon, {
                              size: 20,
                              className: "text-green-500/60",
                            }),
                          }),
                          (0, i.jsx)("h3", {
                            className: "text-xl font-bold text-gray-800 mb-2",
                            children: e(t.titleKey),
                          }),
                          (0, i.jsx)("p", {
                            className: "text-gray-500 text-base",
                            children: e(t.descriptionKey),
                          }),
                        ],
                      },
                      n,
                    );
                  }),
                }),
              ],
            }),
          });
        });
      m.displayName = "ImpactSection";
      const p = m;
      var b = n(48686),
        y = n(82762),
        f = n(76069),
        x = n(30684),
        g = n(82853),
        h = n(71464),
        v = n(76316),
        j = n(8723),
        w = n(85457),
        N = n(90888);
      function F(e) {
        return (
          (F =
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
          F(e)
        );
      }
      function O() {
        var e,
          t,
          n = "function" == typeof Symbol ? Symbol : {},
          r = n.iterator || "@@iterator",
          o = n.toStringTag || "@@toStringTag";
        function a(n, r, o, a) {
          var l = r && r.prototype instanceof s ? r : s,
            c = Object.create(l.prototype);
          return (
            S(
              c,
              "_invoke",
              (function (n, r, o) {
                var a,
                  s,
                  l,
                  c = 0,
                  d = o || [],
                  u = !1,
                  m = {
                    p: 0,
                    n: 0,
                    v: e,
                    a: p,
                    f: p.bind(e, 4),
                    d: function (t, n) {
                      return ((a = t), (s = 0), (l = e), (m.n = n), i);
                    },
                  };
                function p(n, r) {
                  for (
                    s = n, l = r, t = 0;
                    !u && c && !o && t < d.length;
                    t++
                  ) {
                    var o,
                      a = d[t],
                      p = m.p,
                      b = a[2];
                    n > 3
                      ? (o = b === r) &&
                        ((l = a[(s = a[4]) ? 5 : ((s = 3), 3)]),
                        (a[4] = a[5] = e))
                      : a[0] <= p &&
                        ((o = n < 2 && p < a[1])
                          ? ((s = 0), (m.v = r), (m.n = a[1]))
                          : p < b &&
                            (o = n < 3 || a[0] > r || r > b) &&
                            ((a[4] = n), (a[5] = r), (m.n = b), (s = 0)));
                  }
                  if (o || n > 1) return i;
                  throw ((u = !0), r);
                }
                return function (o, d, b) {
                  if (c > 1) throw TypeError("Generator is already running");
                  for (
                    u && 1 === d && p(d, b), s = d, l = b;
                    (t = s < 2 ? e : l) || !u;
                  ) {
                    a ||
                      (s
                        ? s < 3
                          ? (s > 1 && (m.n = -1), p(s, l))
                          : (m.n = l)
                        : (m.v = l));
                    try {
                      if (((c = 2), a)) {
                        if ((s || (o = "next"), (t = a[o]))) {
                          if (!(t = t.call(a, l)))
                            throw TypeError("iterator result is not an object");
                          if (!t.done) return t;
                          ((l = t.value), s < 2 && (s = 0));
                        } else
                          (1 === s && (t = a.return) && t.call(a),
                            s < 2 &&
                              ((l = TypeError(
                                "The iterator does not provide a '" +
                                  o +
                                  "' method",
                              )),
                              (s = 1)));
                        a = e;
                      } else if ((t = (u = m.n < 0) ? l : n.call(r, m)) !== i)
                        break;
                    } catch (t) {
                      ((a = e), (s = 1), (l = t));
                    } finally {
                      c = 1;
                    }
                  }
                  return { value: t, done: u };
                };
              })(n, o, a),
              !0,
            ),
            c
          );
        }
        var i = {};
        function s() {}
        function l() {}
        function c() {}
        t = Object.getPrototypeOf;
        var d = [][r]
            ? t(t([][r]()))
            : (S((t = {}), r, function () {
                return this;
              }),
              t),
          u = (c.prototype = s.prototype = Object.create(d));
        function m(e) {
          return (
            Object.setPrototypeOf
              ? Object.setPrototypeOf(e, c)
              : ((e.__proto__ = c), S(e, o, "GeneratorFunction")),
            (e.prototype = Object.create(u)),
            e
          );
        }
        return (
          (l.prototype = c),
          S(u, "constructor", c),
          S(c, "constructor", l),
          (l.displayName = "GeneratorFunction"),
          S(c, o, "GeneratorFunction"),
          S(u),
          S(u, o, "Generator"),
          S(u, r, function () {
            return this;
          }),
          S(u, "toString", function () {
            return "[object Generator]";
          }),
          (O = function () {
            return { w: a, m };
          })()
        );
      }
      function S(e, t, n, r) {
        var o = Object.defineProperty;
        try {
          o({}, "", {});
        } catch (e) {
          o = 0;
        }
        ((S = function (e, t, n, r) {
          function a(t, n) {
            S(e, t, function (e) {
              return this._invoke(t, n, e);
            });
          }
          t
            ? o
              ? o(e, t, {
                  value: n,
                  enumerable: !r,
                  configurable: !r,
                  writable: !r,
                })
              : (e[t] = n)
            : (a("next", 0), a("throw", 1), a("return", 2));
        }),
          S(e, t, n, r));
      }
      function k(e, t, n, r, o, a, i) {
        try {
          var s = e[a](i),
            l = s.value;
        } catch (e) {
          return void n(e);
        }
        s.done ? t(l) : Promise.resolve(l).then(r, o);
      }
      function T(e, t) {
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
      function P(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? T(Object(n), !0).forEach(function (t) {
                A(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : T(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t),
                  );
                });
        }
        return e;
      }
      function A(e, t, n) {
        return (
          (t = (function (e) {
            var t = (function (e) {
              if ("object" != F(e) || !e) return e;
              var t = e[Symbol.toPrimitive];
              if (void 0 !== t) {
                var n = t.call(e, "string");
                if ("object" != F(n)) return n;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value.",
                );
              }
              return String(e);
            })(e);
            return "symbol" == F(t) ? t : t + "";
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
      function D(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      var C = (0, r.memo)(function (e) {
        var t,
          n,
          o = e.formData,
          s = e.setFormData,
          l = (0, a.Bd)().t,
          c = (0, r.useRef)(null),
          d =
            ((t = (0, w.D6)()),
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
                    o,
                    a,
                    i,
                    s = [],
                    l = !0,
                    c = !1;
                  try {
                    if (((a = (n = n.call(e)).next), 0 === t)) {
                      if (Object(n) !== n) return;
                      l = !1;
                    } else
                      for (
                        ;
                        !(l = (r = a.call(n)).done) &&
                        (s.push(r.value), s.length !== t);
                        l = !0
                      );
                  } catch (e) {
                    ((c = !0), (o = e));
                  } finally {
                    try {
                      if (
                        !l &&
                        null != n.return &&
                        ((i = n.return()), Object(i) !== i)
                      )
                        return;
                    } finally {
                      if (c) throw o;
                    }
                  }
                  return s;
                }
              })(t, n) ||
              (function (e, t) {
                if (e) {
                  if ("string" == typeof e) return D(e, t);
                  var n = {}.toString.call(e).slice(8, -1);
                  return (
                    "Object" === n && e.constructor && (n = e.constructor.name),
                    "Map" === n || "Set" === n
                      ? Array.from(e)
                      : "Arguments" === n ||
                          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        ? D(e, t)
                        : void 0
                  );
                }
              })(t, n) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              })()),
          u = d[0],
          m = d[1].isLoading,
          p = "business" === o.donorType,
          F = (function () {
            var e,
              t =
                ((e = O().m(function e(t) {
                  var n, r, a, i;
                  return O().w(
                    function (e) {
                      for (;;)
                        switch ((e.p = e.n)) {
                          case 0:
                            if (
                              (t.preventDefault(),
                              o.name && o.email && o.phone && o.amount)
                            ) {
                              e.n = 1;
                              break;
                            }
                            return (
                              N.Ay.error("Please fill in all required fields."),
                              e.a(2)
                            );
                          case 1:
                            return (
                              (e.p = 1),
                              (n = new FormData()).append("type", "DONATION"),
                              n.append(
                                "donationData[donorType]",
                                o.donorType.toUpperCase(),
                              ),
                              n.append("donationData[name]", o.name),
                              n.append("donationData[email]", o.email),
                              n.append("donationData[phone]", o.phone),
                              n.append("donationData[amount]", o.amount),
                              n.append("donationData[benefit]", o.benefit),
                              "business" === o.donorType &&
                                (n.append(
                                  "donationData[businessType]",
                                  "online" === o.businessType
                                    ? "ONLINE_BUSINESS"
                                    : "LOCAL_BUSINESS",
                                ),
                                n.append(
                                  "donationData[businessName]",
                                  o.businessName,
                                ),
                                n.append(
                                  "donationData[description]",
                                  o.description,
                                ),
                                "online" === o.businessType
                                  ? n.append(
                                      "donationData[websiteUrl]",
                                      o.websiteUrl,
                                    )
                                  : n.append(
                                      "donationData[location]",
                                      o.location,
                                    ),
                                o.image &&
                                  n.append("donationData[image]", o.image)),
                              (e.n = 2),
                              u(n).unwrap()
                            );
                          case 2:
                            (null != (r = e.v) && r.url
                              ? (window.location.href = r.url)
                              : N.Ay.error(
                                  "Could not initiate payment. Please try again.",
                                ),
                              (e.n = 4));
                            break;
                          case 3:
                            ((e.p = 3),
                              (i = e.v),
                              N.Ay.error(
                                (null == i ||
                                null === (a = i.data) ||
                                void 0 === a
                                  ? void 0
                                  : a.message) ||
                                  (null == i ? void 0 : i.message) ||
                                  "Payment failed. Please try again.",
                              ));
                          case 4:
                            return e.a(2);
                        }
                    },
                    e,
                    null,
                    [[1, 3]],
                  );
                })),
                function () {
                  var t = this,
                    n = arguments;
                  return new Promise(function (r, o) {
                    var a = e.apply(t, n);
                    function i(e) {
                      k(a, r, o, i, s, "next", e);
                    }
                    function s(e) {
                      k(a, r, o, i, s, "throw", e);
                    }
                    i(void 0);
                  });
                });
            return function (e) {
              return t.apply(this, arguments);
            };
          })();
        return (0, i.jsxs)("div", {
          className: "container  mx-auto px-4 lg:px-6 py-14 lg:py-20",
          children: [
            (0, i.jsxs)("div", {
              className: "mb-10",
              children: [
                (0, i.jsx)("h2", {
                  className:
                    "text-2xl md:text-3xl font-bold text-gray-800 mb-2",
                  children: l("donationForm.header.title"),
                }),
                (0, i.jsx)("p", {
                  className: "text-gray-500 text-base",
                  children: l("donationForm.header.subtitle"),
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className:
                "bg-white rounded-xl p-6 border border-gray-200 mb-12 ",
              children: [
                (0, i.jsx)("p", {
                  className: "text-gray-700 font-bold text-xl mb-2 ",
                  children: l("donationForm.quote"),
                }),
                (0, i.jsx)("p", {
                  className: "text-gray-400 text-base",
                  children: l("donationForm.attribution"),
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className:
                "bg-white rounded-xl  border border-gray-100 overflow-hidden",
              children: [
                (0, i.jsxs)("div", {
                  className: "bg-[#F1EBF7] p-4 lg:p-6 border-b border-gray-100",
                  children: [
                    (0, i.jsx)("h3", {
                      className: "text-xl font-bold text-gray-800 mb-1 ",
                      children: l("donationForm.formHeader.title"),
                    }),
                    (0, i.jsx)("p", {
                      className: "text-gray-500 text-base",
                      children: l("donationForm.formHeader.subtitle"),
                    }),
                  ],
                }),
                (0, i.jsx)("div", {
                  className: "p-4 lg:p-6",
                  children: (0, i.jsxs)("form", {
                    onSubmit: F,
                    className: "space-y-6",
                    children: [
                      (0, i.jsxs)("div", {
                        className: "grid grid-cols-1 gap-6",
                        children: [
                          (0, i.jsxs)("div", {
                            children: [
                              (0, i.jsx)("label", {
                                className:
                                  "block text-base  text-gray-600 mb-2",
                                children: l("donationForm.fields.name.label"),
                              }),
                              (0, i.jsx)("input", {
                                type: "text",
                                placeholder: l(
                                  "donationForm.fields.name.placeholder",
                                ),
                                className:
                                  "w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-green-500/60",
                                value: o.name,
                                onChange: function (e) {
                                  return s(
                                    P(P({}, o), {}, { name: e.target.value }),
                                  );
                                },
                              }),
                            ],
                          }),
                          (0, i.jsxs)("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                              (0, i.jsxs)("div", {
                                children: [
                                  (0, i.jsx)("label", {
                                    className:
                                      "block text-base  text-gray-600 mb-2",
                                    children: l(
                                      "donationForm.fields.email.label",
                                    ),
                                  }),
                                  (0, i.jsx)("input", {
                                    type: "email",
                                    placeholder: l(
                                      "donationForm.fields.email.placeholder",
                                    ),
                                    className:
                                      "w-full px-4 py-3 border border-gray-200 bg-gray-100 cursor-not-allowed rounded-md text-sm focus:outline-none",
                                    value: o.email,
                                    onChange: function (e) {
                                      return s(
                                        P(
                                          P({}, o),
                                          {},
                                          { email: e.target.value },
                                        ),
                                      );
                                    },
                                    disabled: !0,
                                  }),
                                ],
                              }),
                              (0, i.jsxs)("div", {
                                children: [
                                  (0, i.jsx)("label", {
                                    className:
                                      "block text-base  text-gray-600 mb-2",
                                    children: l(
                                      "donationForm.fields.phone.label",
                                    ),
                                  }),
                                  (0, i.jsx)("input", {
                                    type: "tel",
                                    placeholder: l(
                                      "donationForm.fields.phone.placeholder",
                                    ),
                                    className:
                                      "w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-green-500/60",
                                    value: o.phone,
                                    onChange: function (e) {
                                      return s(
                                        P(
                                          P({}, o),
                                          {},
                                          { phone: e.target.value },
                                        ),
                                      );
                                    },
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, i.jsxs)("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                              (0, i.jsxs)("div", {
                                children: [
                                  (0, i.jsx)("label", {
                                    className:
                                      "block text-base  text-gray-600 mb-2",
                                    children: l(
                                      "donationForm.fields.amount.label",
                                    ),
                                  }),
                                  (0, i.jsx)("input", {
                                    type: "number",
                                    placeholder: l(
                                      "donationForm.fields.amount.placeholder",
                                    ),
                                    className:
                                      "w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-green-500/60",
                                    value: o.amount,
                                    onChange: function (e) {
                                      return s(
                                        P(
                                          P({}, o),
                                          {},
                                          { amount: e.target.value },
                                        ),
                                      );
                                    },
                                  }),
                                ],
                              }),
                              (0, i.jsxs)("div", {
                                children: [
                                  (0, i.jsx)("label", {
                                    className:
                                      "block text-base text-gray-600 mb-2",
                                    children: "Benefit / Support Cause",
                                  }),
                                  (0, i.jsxs)("select", {
                                    className:
                                      "w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-green-500/60 bg-white",
                                    value: o.benefit,
                                    onChange: function (e) {
                                      return s(
                                        P(
                                          P({}, o),
                                          {},
                                          { benefit: e.target.value },
                                        ),
                                      );
                                    },
                                    children: [
                                      (0, i.jsx)("option", {
                                        value: "Feed a Family",
                                        children: "Feed a Family",
                                      }),
                                      (0, i.jsx)("option", {
                                        value: "Support Education",
                                        children: "Support Education",
                                      }),
                                      (0, i.jsx)("option", {
                                        value: "Medical Support",
                                        children: "Medical Support",
                                      }),
                                      (0, i.jsx)("option", {
                                        value: "General Fund",
                                        children: "General Fund",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsxs)("div", {
                        className: "pt-4",
                        children: [
                          (0, i.jsx)("label", {
                            className: "block text-lg text-gray-600 mb-4",
                            children: l("donationForm.donorType.label"),
                          }),
                          (0, i.jsxs)("div", {
                            className: "flex gap-4 max-w-md",
                            children: [
                              (0, i.jsxs)("button", {
                                type: "button",
                                onClick: function () {
                                  return s(
                                    P(
                                      P({}, o),
                                      {},
                                      { donorType: "individual" },
                                    ),
                                  );
                                },
                                className:
                                  "flex-1 py-6 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ".concat(
                                    "individual" === o.donorType
                                      ? "border-green-500/60 bg-[#FFFBEB]/50"
                                      : "border-gray-100 bg-white",
                                  ),
                                children: [
                                  (0, i.jsx)(b.A, {
                                    size: 20,
                                    className:
                                      "individual" === o.donorType
                                        ? "text-green-500/60"
                                        : "text-gray-400",
                                  }),
                                  (0, i.jsx)("span", {
                                    className:
                                      "text-base font-bold text-gray-700",
                                    children: l(
                                      "donationForm.donorType.individual",
                                    ),
                                  }),
                                ],
                              }),
                              (0, i.jsxs)("button", {
                                type: "button",
                                onClick: function () {
                                  return s(
                                    P(P({}, o), {}, { donorType: "business" }),
                                  );
                                },
                                className:
                                  "flex-1 py-6 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ".concat(
                                    "business" === o.donorType
                                      ? "border-green-500/60 bg-[#FCF7E7]"
                                      : "border-gray-100 bg-white",
                                  ),
                                children: [
                                  (0, i.jsx)(y.A, {
                                    size: 20,
                                    className:
                                      "business" === o.donorType
                                        ? "text-green-500/60"
                                        : "text-gray-400",
                                  }),
                                  (0, i.jsx)("span", {
                                    className:
                                      "text-base font-bold text-gray-700",
                                    children: l(
                                      "donationForm.donorType.business",
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      p &&
                        (0, i.jsxs)("div", {
                          className:
                            "space-y-6 pt-6 border-t border-gray-100 animate-in fade-in duration-500",
                          children: [
                            (0, i.jsxs)("div", {
                              className:
                                "flex bg-gray-100 p-1 rounded-full w-fit",
                              children: [
                                (0, i.jsxs)("button", {
                                  type: "button",
                                  onClick: function () {
                                    return s(
                                      P(
                                        P({}, o),
                                        {},
                                        { businessType: "local" },
                                      ),
                                    );
                                  },
                                  className:
                                    "px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ".concat(
                                      "local" === o.businessType
                                        ? "bg-white shadow-sm text-gray-800"
                                        : "text-gray-400",
                                    ),
                                  children: [
                                    (0, i.jsx)(f.A, { size: 12 }),
                                    " ",
                                    l("donationForm.businessType.local"),
                                  ],
                                }),
                                (0, i.jsxs)("button", {
                                  type: "button",
                                  onClick: function () {
                                    return s(
                                      P(
                                        P({}, o),
                                        {},
                                        { businessType: "online" },
                                      ),
                                    );
                                  },
                                  className:
                                    "px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ".concat(
                                      "online" === o.businessType
                                        ? "bg-white shadow-sm text-gray-800"
                                        : "text-gray-400",
                                    ),
                                  children: [
                                    (0, i.jsx)(x.A, { size: 12 }),
                                    " ",
                                    l("donationForm.businessType.online"),
                                  ],
                                }),
                              ],
                            }),
                            (0, i.jsxs)("div", {
                              children: [
                                (0, i.jsx)("label", {
                                  className:
                                    "block text-base font-bold text-gray-600 mb-2",
                                  children: l(
                                    "donationForm.fields.businessName.label",
                                  ),
                                }),
                                (0, i.jsx)("input", {
                                  type: "text",
                                  placeholder: l(
                                    "donationForm.fields.businessName.placeholder",
                                  ),
                                  className:
                                    "w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded text-sm focus:outline-none",
                                  value: o.businessName,
                                  onChange: function (e) {
                                    return s(
                                      P(
                                        P({}, o),
                                        {},
                                        { businessName: e.target.value },
                                      ),
                                    );
                                  },
                                }),
                              ],
                            }),
                            (0, i.jsxs)("div", {
                              children: [
                                (0, i.jsxs)("div", {
                                  className: "flex justify-between mb-2",
                                  children: [
                                    (0, i.jsx)("label", {
                                      className:
                                        "block text-base font-bold text-gray-600",
                                      children: l(
                                        "donationForm.fields.description.label",
                                      ),
                                    }),
                                    (0, i.jsxs)("span", {
                                      className: "text-[10px] text-gray-400",
                                      children: [o.description.length, "/200"],
                                    }),
                                  ],
                                }),
                                (0, i.jsx)("textarea", {
                                  rows: 3,
                                  maxLength: 200,
                                  placeholder: l(
                                    "donationForm.fields.description.placeholder",
                                  ),
                                  className:
                                    "w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded text-sm focus:outline-none resize-none",
                                  value: o.description,
                                  onChange: function (e) {
                                    return s(
                                      P(
                                        P({}, o),
                                        {},
                                        { description: e.target.value },
                                      ),
                                    );
                                  },
                                }),
                              ],
                            }),
                            (0, i.jsxs)("div", {
                              children: [
                                (0, i.jsx)("label", {
                                  className:
                                    "block text-base font-bold text-gray-600 mb-2",
                                  children:
                                    "online" === o.businessType
                                      ? l("donationForm.fields.website.label")
                                      : l("donationForm.fields.location.label"),
                                }),
                                (0, i.jsxs)("div", {
                                  className: "relative",
                                  children: [
                                    "online" === o.businessType
                                      ? (0, i.jsx)(g.A, {
                                          size: 14,
                                          className:
                                            "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                                        })
                                      : (0, i.jsx)(f.A, {
                                          size: 14,
                                          className:
                                            "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                                        }),
                                    (0, i.jsx)("input", {
                                      type: "text",
                                      placeholder:
                                        "online" === o.businessType
                                          ? l(
                                              "donationForm.fields.website.placeholder",
                                            )
                                          : l(
                                              "donationForm.fields.location.placeholder",
                                            ),
                                      className:
                                        "w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded text-sm focus:outline-none",
                                      value:
                                        "online" === o.businessType
                                          ? o.websiteUrl
                                          : o.location,
                                      onChange: function (e) {
                                        return s(
                                          P(
                                            P({}, o),
                                            {},
                                            A(
                                              {},
                                              "online" === o.businessType
                                                ? "websiteUrl"
                                                : "location",
                                              e.target.value,
                                            ),
                                          ),
                                        );
                                      },
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, i.jsxs)("div", {
                              children: [
                                (0, i.jsx)("label", {
                                  className:
                                    "block text-base font-bold text-gray-600 mb-2",
                                  children: l(
                                    "donationForm.fields.image.label",
                                  ),
                                }),
                                (0, i.jsxs)("div", {
                                  onClick: function () {
                                    var e;
                                    null === (e = c.current) ||
                                      void 0 === e ||
                                      e.click();
                                  },
                                  className:
                                    "border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-white hover:border-green-500/60 cursor-pointer transition-colors",
                                  children: [
                                    (0, i.jsx)("input", {
                                      type: "file",
                                      ref: c,
                                      onChange: function (e) {
                                        var t,
                                          n =
                                            null === (t = e.target.files) ||
                                            void 0 === t
                                              ? void 0
                                              : t[0];
                                        n && s(P(P({}, o), {}, { image: n }));
                                      },
                                      accept: "image/*",
                                      className: "hidden",
                                    }),
                                    o.image
                                      ? (0, i.jsxs)("div", {
                                          className:
                                            "flex flex-col items-center gap-2",
                                          children: [
                                            o.image instanceof File &&
                                              (0, i.jsx)("img", {
                                                src: URL.createObjectURL(
                                                  o.image,
                                                ),
                                                alt: "Preview",
                                                className:
                                                  "w-24 h-24 object-cover rounded-lg border border-gray-200",
                                              }),
                                            (0, i.jsx)("span", {
                                              className:
                                                "text-xs text-gray-500 font-medium",
                                              children: o.image.name,
                                            }),
                                          ],
                                        })
                                      : (0, i.jsxs)(i.Fragment, {
                                          children: [
                                            (0, i.jsx)(h.A, {
                                              size: 28,
                                              className: "text-gray-300",
                                            }),
                                            (0, i.jsx)("p", {
                                              className:
                                                "text-[11px] text-gray-400 font-medium",
                                              children: l(
                                                "donationForm.fields.image.placeholder",
                                              ),
                                            }),
                                          ],
                                        }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      (0, i.jsxs)("div", {
                        className: "bg-gray-50/50 rounded-2xl p-6 mt-8",
                        children: [
                          (0, i.jsxs)("div", {
                            className: "flex items-center gap-2 mb-4",
                            children: [
                              (0, i.jsx)(v.A, {
                                size: 16,
                                className: "text-gray-600",
                              }),
                              (0, i.jsx)("h4", {
                                className: "text-base font-bold text-gray-800",
                                children: l("donationForm.benefits.title"),
                              }),
                            ],
                          }),
                          (0, i.jsxs)("div", {
                            className: "flex flex-wrap gap-3",
                            children: [
                              (0, i.jsxs)("div", {
                                className:
                                  "flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm",
                                children: [
                                  (0, i.jsx)(x.A, {
                                    size: 14,
                                    className: "text-gray-400",
                                  }),
                                  (0, i.jsx)("span", {
                                    className:
                                      "text-base text-gray-600 font-bold",
                                    children: l(
                                      "donationForm.benefits.adPlacement",
                                    ),
                                  }),
                                ],
                              }),
                              (0, i.jsxs)("div", {
                                className:
                                  "flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm",
                                children: [
                                  (0, i.jsx)(v.A, {
                                    size: 14,
                                    className: "text-gray-400",
                                  }),
                                  (0, i.jsx)("span", {
                                    className:
                                      "text-base text-gray-600 font-bold",
                                    children: l(
                                      "donationForm.benefits.visibility",
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsx)("div", {
                        className: "pt-4",
                        children: (0, i.jsxs)("button", {
                          type: "submit",
                          disabled: m,
                          className:
                            "bg-green-500/60  text-white text-sm font-bold py-3 px-8 rounded transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                          children: [
                            m &&
                              (0, i.jsx)(j.A, {
                                className: "animate-spin h-5 w-5 text-white",
                              }),
                            m
                              ? "Processing..."
                              : l("donationForm.button", {
                                  amount: o.amount || "100",
                                }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        });
      });
      C.displayName = "DonationFormSection";
      const E = C;
      var G = n(29673),
        I = n(71468),
        _ = n(42038);
      function z(e) {
        return (
          (z =
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
          z(e)
        );
      }
      function U(e, t) {
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
      function q(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? U(Object(n), !0).forEach(function (t) {
                B(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : U(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t),
                  );
                });
        }
        return e;
      }
      function B(e, t, n) {
        return (
          (t = (function (e) {
            var t = (function (e) {
              if ("object" != z(e) || !e) return e;
              var t = e[Symbol.toPrimitive];
              if (void 0 !== t) {
                var n = t.call(e, "string");
                if ("object" != z(n)) return n;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value.",
                );
              }
              return String(e);
            })(e);
            return "symbol" == z(t) ? t : t + "";
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
      function H(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      var L = (0, r.memo)(function () {
        var e,
          t,
          n = (0, I.d4)(_.selectUser),
          a =
            ((e = (0, r.useState)({
              name: (null == n ? void 0 : n.name) || "",
              email: (null == n ? void 0 : n.email) || "",
              phone: (null == n ? void 0 : n.phone) || "",
              amount: "",
              donorType: "individual",
              benefit: "Feed a Family",
              businessType: "local",
              businessName: "",
              description: "",
              websiteUrl: "",
              location: "",
              image: null,
            })),
            (t = 2),
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
                    o,
                    a,
                    i,
                    s = [],
                    l = !0,
                    c = !1;
                  try {
                    if (((a = (n = n.call(e)).next), 0 === t)) {
                      if (Object(n) !== n) return;
                      l = !1;
                    } else
                      for (
                        ;
                        !(l = (r = a.call(n)).done) &&
                        (s.push(r.value), s.length !== t);
                        l = !0
                      );
                  } catch (e) {
                    ((c = !0), (o = e));
                  } finally {
                    try {
                      if (
                        !l &&
                        null != n.return &&
                        ((i = n.return()), Object(i) !== i)
                      )
                        return;
                    } finally {
                      if (c) throw o;
                    }
                  }
                  return s;
                }
              })(e, t) ||
              (function (e, t) {
                if (e) {
                  if ("string" == typeof e) return H(e, t);
                  var n = {}.toString.call(e).slice(8, -1);
                  return (
                    "Object" === n && e.constructor && (n = e.constructor.name),
                    "Map" === n || "Set" === n
                      ? Array.from(e)
                      : "Arguments" === n ||
                          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        ? H(e, t)
                        : void 0
                  );
                }
              })(e, t) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              })()),
          s = a[0],
          c = a[1];
        return (
          (0, r.useEffect)(
            function () {
              n &&
                c(function (e) {
                  return q(
                    q({}, e),
                    {},
                    {
                      name: e.name || n.name || "",
                      email: e.email || n.email || "",
                      phone: e.phone || n.phone || "",
                    },
                  );
                });
            },
            [n],
          ),
          (0, o.P)({
            title: "Donation",
            description: "Make a difference through donations",
            keywords: ["donation", "support", "charity"],
          }),
          (0, i.jsxs)("div", {
            className: "min-h-screen bg-[#FBFDFF]",
            children: [
              (0, i.jsx)(l, {}),
              (0, i.jsx)(p, {}),
              (0, i.jsx)(E, { formData: s, setFormData: c }),
              (0, i.jsx)(G.A, {
                containerClassName:
                  "container mx-auto pb-14 md:pb-20 px-4 lg:px-6",
                title: "Advertisement Area",
                titleClassName:
                  "text-black font-bold text-2xl tracking-widest uppercase",
              }),
            ],
          })
        );
      });
      L.displayName = "Donation";
      const K = L;
    },
  },
]);
