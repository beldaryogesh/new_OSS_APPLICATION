


// let nameRegex = /^[.a-zA-Z\s]+$/;
// let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
// let emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/;
let passRegex =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
// let statusRegex = /^(success|failed|pending)$/
let sectionRegex = /^(Select All|Select All Users|Select All Vendors|Specific Host)$/
let documentStatusRegex = /^(Verify|Reject)$/
let SubscriptionStatusRegex = /^(Active|Deactive)$/
let planValidityRegex = /^(Monthly|Quarterly|Yearly)$/

module.exports = {
  passRegex,
  documentStatusRegex,
  sectionRegex,
  SubscriptionStatusRegex,
  planValidityRegex
};
