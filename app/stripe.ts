import Stripe from 'stripe';
const stripe = new Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc', {
  apiVersion: '2020-08-27',
});
export async function placeOrder(totalAmount: number) {
  const charge = await stripe.charges.create({
    amount: totalAmount,
    currency: 'usd',
    source: 'tok_visa'
  });
  console.log(charge);
}
