import React from "react";

const CookieCompanyDetails = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Bedrijfsgegevens
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold text-gray-600">
        <div className="space-y-1">
          <p className="text-gray-900 font-bold">DCAPZ B.V.</p>
          <p>Wijnstraat 75</p>
          <p>3311 BT Dordrecht</p>
        </div>
        <div className="space-y-1">
          <p>KvK-nummer: 42039361</p>
          <p>BTW-nummer: NL005448711B24</p>
          <p>
            E-mail:{" "}
            <a
              href="mailto:info@netwerkmediums.nl"
              className="text-green-600 hover:underline"
            >
              info@netwerkmediums.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieCompanyDetails;
