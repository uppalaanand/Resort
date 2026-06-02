export const resortPolicies = [
  {
    title: "Check-In & Check-Out",
    policies: [
      "Check-in time: 2:00 PM onwards.",
      "Check-out time: 11:00 AM.",
      "Early check-in and late check-out are subject to availability and additional charges."
    ]
  },
  {
    title: "Booking & Cancellation",
    policies: [
      "A valid ID proof is required during check-in.",
      "Bookings can be canceled up to 48 hours before arrival for a full refund.",
      "No refund will be provided for cancellations made within 48 hours of arrival.",
      "Refunds will be processed within 7-10 business days."
    ]
  },
  {
    title: "Guest Conduct",
    policies: [
      "Guests are expected to maintain a peaceful environment.",
      "Damages caused to resort property will be charged to the guest.",
      "Illegal activities and substance abuse are strictly prohibited."
    ]
  },
  {
    title: "Children Policy",
    policies: [
      "Children below 5 years stay free when sharing existing bedding.",
      "Additional charges may apply for extra beds or mattresses.",
      "Parents are responsible for supervising children at all times."
    ]
  },
  {
    title: "Swimming Pool & Recreation",
    policies: [
      "Pool timings: 7:00 AM to 8:00 PM.",
      "Appropriate swimwear is mandatory.",
      "Children must be accompanied by an adult.",
      "The resort is not responsible for personal belongings left unattended."
    ]
  },
  {
    title: "Food & Dining",
    policies: [
      "Outside food and beverages are not permitted.",
      "Special dietary requirements can be accommodated upon prior request.",
      "Restaurant timings may vary during special events."
    ]
  },
  {
    title: "Pet Policy",
    policies: [
      "Pets are not allowed unless specifically approved by management.",
      "Guests bringing approved pets must ensure proper care and cleanliness."
    ]
  },
  {
    title: "Nature & Environment",
    policies: [
      "Help us preserve nature by avoiding littering.",
      "Do not disturb wildlife, plants, or natural habitats within the resort premises.",
      "Use water and electricity responsibly."
    ]
  },
  {
    title: "Safety & Security",
    policies: [
      "The resort provides 24/7 security surveillance in common areas.",
      "Guests are advised to keep valuables secured.",
      "Emergency contact information is available at reception."
    ]
  },
  {
    title: "Force Majeure",
    policies: [
      "The resort shall not be held liable for cancellations or disruptions caused by natural disasters, government restrictions, or unforeseen events beyond its control."
    ]
  }
];


const ResortPolicies = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-serif text-center mb-12 text-vp-dark">
          Resort Policies
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {resortPolicies.map((section, index) => (
            <div
              key={index}
              className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-100"
            >
              <h3 className="text-xl font-semibold text-vp-gold mb-4">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.policies.map((policy, idx) => (
                  <li
                    key={idx}
                    className="text-slate-600 flex items-start gap-3"
                  >
                    <span className="text-vp-gold mt-1">•</span>
                    <span>{policy}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResortPolicies;