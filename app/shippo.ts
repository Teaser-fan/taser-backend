import Shippo, { Parcel } from 'shippo';
const shippo = new Shippo(
  'shippo_live_b66f754722d3d8dc6dc619a6c9dc0a01574c68ae'
);
const addressFrom = {
  name: 'Ms Hippo',
  company: 'Shippo',
  street1: '215 Clayton St.',
  city: 'San Francisco',
  state: 'CA',
  zip: '94117',
  country: 'US', // iso2 country code
  phone: '+1 555 341 9393',
  email: 'support@goshippo.com',
};

// example address_to object dict
const addressTo = {
  name: 'Ms Hippo',
  company: 'Shippo',
  street1: '803 Clayton St.',
  city: 'San Francisco',
  state: 'CA',
  zip: '94117',
  country: 'US', // iso2 country code
  phone: '+1 555 341 9393',
  email: 'support@goshippo.com',
};

// parcel object dict
const parcelOne: Parcel = {
  distance_unit: 'in',
  width: 5,
  weight: 2,
  mass_unit: 'lb',
  length: 5,
  height: 5,
};

export async function createShipment() {
  await shippo.shipment.create({
    address_from: addressFrom,
    address_to: addressTo,
    parcels: [parcelOne],
  });
}
